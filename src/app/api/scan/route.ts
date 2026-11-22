import { NextRequest, NextResponse } from 'next/server';
import { runPlantDiseaseInference, ScanInput } from '@/lib/scanner-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      image_data, 
      crop_name, 
      plant_part = 'Leaf', 
      is_low_quality = false, 
      is_non_plant = false,
      detection_reason,
      metrics,
      weather_context 
    } = body;

    if (!crop_name) {
      return NextResponse.json(
        { success: false, error: 'Crop name is mandatory for plant disease diagnosis.' },
        { status: 400 }
      );
    }

    // Size validation for base64 image (approx 5MB limit)
    if (image_data && image_data.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image payload exceeds the maximum 5MB size limit.' },
        { status: 413 }
      );
    }

    const input: ScanInput = {
      image_data,
      crop_name,
      plant_part,
      is_low_quality: is_low_quality === true,
      is_non_plant: is_non_plant === true,
      detection_reason,
      metrics,
      weather_context
    };

    const diagnosis = await runPlantDiseaseInference(input);

    return NextResponse.json({
      success: true,
      diagnosis
    });
  } catch (err: unknown) {
    console.error('Scan API error:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
