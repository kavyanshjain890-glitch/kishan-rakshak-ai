/**
 * Client-Side Image Pre-Processing & Security Utility
 * - Compresses high-resolution phone camera images
 * - Strips EXIF metadata (GPS, camera tags, device info) via canvas rendering
 * - Validates file types and sizes
 */

export interface ImageQualityMetrics {
  plantRatio: number;
  skinRatio: number;
  sharpnessScore: number;
  meanBrightness: number;
}

export interface ProcessedImageResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  is_non_plant: boolean;
  is_low_quality: boolean;
  detection_reason?: 'human_detected' | 'non_plant_object' | 'blurry_image' | 'dark_image' | 'valid_leaf';
  metrics: ImageQualityMetrics;
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type}). Please upload a JPEG, PNG, or WebP image.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit. Please upload a smaller photo.`
    };
  }

  return { valid: true };
}

export async function compressAndStripExif(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Create canvas - re-drawing to canvas naturally discards all EXIF metadata
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable'));
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Computer Vision Pre-Filter Analysis
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const totalSampledPixels = Math.floor(data.length / 4);

        let skinCount = 0;
        let plantCount = 0;
        let lumSum = 0;

        // 1. Color distribution analysis (step by 4 for high-speed sampling)
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          lumSum += lum;

          // Human skin tone detection (peer-reviewed RGB + YCbCr locus)
          const isSkinRgb = r > 95 && g > 40 && b > 20 &&
            (Math.max(r, g, b) - Math.min(r, g, b) > 15) &&
            Math.abs(r - g) > 15 && r > g && r > b;
          const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
          const isSkinYCbCr = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
          if (isSkinRgb && isSkinYCbCr) {
            skinCount++;
          }

          // Plant foliage & foliar disease detection
          // A: Green vegetative foliage
          const isGreen = (g > r + 6) && (g > b + 8) && (g > 35);
          // B: Yellow rust / chlorotic pustules (e.g. Yellow Rust, Blight yellow halo)
          const isYellowPustule = (r > 75 && g > 70 && b < 125 && ((r + g) / 2 > b + 20) && Math.abs(r - g) < 55);
          // C: Brown / necrotic blight lesions
          const isNecroticBrown = (r > 55 && g > 40 && b < 65 && r > g && g > b && lum < 155);
          if (isGreen || isYellowPustule || isNecroticBrown) {
            plantCount++;
          }
        }

        const sampledCount = Math.floor(data.length / 16) || 1;
        const skinRatio = skinCount / sampledCount;
        const plantRatio = plantCount / sampledCount;
        const meanBrightness = lumSum / sampledCount;

        // 2. Blur / Sharpness Detection (Spatial gradient variance)
        let gradSum = 0;
        let gradSqSum = 0;
        let gradCount = 0;
        const yStart = Math.floor(height * 0.1);
        const yEnd = Math.floor(height * 0.9);
        const xStart = Math.floor(width * 0.1);
        const xEnd = Math.floor(width * 0.9);
        const rowStride = width * 4;

        for (let y = yStart; y < yEnd; y += 4) {
          for (let x = xStart; x < xEnd; x += 4) {
            const idx = (y * width + x) * 4;
            const lumCenter = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            const lumRight = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];
            const lumDown = 0.299 * data[idx + rowStride] + 0.587 * data[idx + rowStride + 1] + 0.114 * data[idx + rowStride + 2];
            const grad = Math.abs(lumRight - lumCenter) + Math.abs(lumDown - lumCenter);
            gradSum += grad;
            gradSqSum += grad * grad;
            gradCount++;
          }
        }
        const meanGrad = gradSum / (gradCount || 1);
        const sharpnessVariance = (gradSqSum / (gradCount || 1)) - (meanGrad * meanGrad);

        // Decision logic
        let is_non_plant = false;
        let is_low_quality = false;
        let detection_reason: ProcessedImageResult['detection_reason'] = 'valid_leaf';

        if (skinRatio > 0.15 || (skinRatio > 0.08 && plantRatio < 0.10)) {
          is_non_plant = true;
          detection_reason = 'human_detected';
        } else if (plantRatio < 0.12) {
          is_non_plant = true;
          detection_reason = 'non_plant_object';
        } else if (sharpnessVariance < 32) {
          is_low_quality = true;
          detection_reason = 'blurry_image';
        } else if (meanBrightness < 25 || meanBrightness > 245) {
          is_low_quality = true;
          detection_reason = 'dark_image';
        }

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to compress canvas to blob'));
            }
            resolve({
              dataUrl,
              blob,
              width,
              height,
              originalSize: file.size,
              compressedSize: blob.size,
              is_non_plant,
              is_low_quality,
              detection_reason,
              metrics: {
                plantRatio: Number(plantRatio.toFixed(3)),
                skinRatio: Number(skinRatio.toFixed(3)),
                sharpnessScore: Number(sharpnessVariance.toFixed(2)),
                meanBrightness: Number(meanBrightness.toFixed(1))
              }
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image into browser DOM'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
