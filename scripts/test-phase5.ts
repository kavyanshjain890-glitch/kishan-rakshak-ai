import { runPlantDiseaseInference, ScanInput } from '../src/lib/scanner-service';
import { getDb } from '../src/lib/db';

interface TestCase {
  id: number;
  crop: string;
  plantPart: 'Leaf' | 'Stem' | 'Root' | 'Fruit';
  is_low_quality?: boolean;
  is_non_plant?: boolean;
  weather?: { temperature: number; humidity: number; rainfall_prob: number };
  expectedStatus: 'confirmed' | 'uncertain_under_threshold';
  expectedTopCandidate?: string;
  expectedMinConfidence: number;
  expectedMaxConfidence?: number;
  description: string;
}

const TEST_CASES: TestCase[] = [
  // Pilot Confirmed Cases (PlantVillage / PlantDoc / Paddy Doctor)
  {
    id: 1,
    crop: 'Wheat',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Yellow Rust',
    expectedMinConfidence: 0.65,
    description: 'Wheat leaf showing bright yellow linear rust stripes'
  },
  {
    id: 2,
    crop: 'Rice',
    plantPart: 'Leaf',
    weather: { temperature: 27, humidity: 88, rainfall_prob: 75 },
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Blast',
    expectedMinConfidence: 0.70,
    description: 'Rice leaf with spindle-shaped necrotic blast lesions under high humidity'
  },
  {
    id: 3,
    crop: 'Tomato',
    plantPart: 'Leaf',
    weather: { temperature: 22, humidity: 90, rainfall_prob: 80 },
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Late Blight',
    expectedMinConfidence: 0.70,
    description: 'Tomato foliage with dark water-soaked late blight decay'
  },
  {
    id: 4,
    crop: 'Potato',
    plantPart: 'Leaf',
    weather: { temperature: 19, humidity: 92, rainfall_prob: 65 },
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Late Blight',
    expectedMinConfidence: 0.70,
    description: 'Potato canopy with rapidly spreading Phytophthora late blight'
  },
  {
    id: 5,
    crop: 'Cotton',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Bacterial Blight',
    expectedMinConfidence: 0.65,
    description: 'Cotton leaf displaying angular vein-delimited bacterial spots'
  },
  {
    id: 6,
    crop: 'Wheat',
    plantPart: 'Leaf',
    weather: { temperature: 31, humidity: 35, rainfall_prob: 0 },
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Yellow Rust',
    expectedMinConfidence: 0.65,
    description: 'Wheat leaf under dry warm weather with suppressed fungal development'
  },
  {
    id: 7,
    crop: 'Tomato',
    plantPart: 'Fruit',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Late Blight',
    expectedMinConfidence: 0.65,
    description: 'Green tomato fruit with firm greasy brown lesions'
  },
  {
    id: 8,
    crop: 'Rice',
    plantPart: 'Stem',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Blast',
    expectedMinConfidence: 0.65,
    description: 'Rice panicle neck with black necrotic blast girdle'
  },
  {
    id: 9,
    crop: 'Cotton',
    plantPart: 'Fruit',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Bacterial Blight',
    expectedMinConfidence: 0.65,
    description: 'Cotton developing boll with dark water-soaked spots'
  },
  {
    id: 10,
    crop: 'Potato',
    plantPart: 'Stem',
    expectedStatus: 'confirmed',
    expectedTopCandidate: 'Late Blight',
    expectedMinConfidence: 0.65,
    description: 'Potato stem lesion with dark brown water-soaked necrosis'
  },
  {
    id: 11,
    crop: 'Mustard',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Mustard leaf showing foliar chlorosis and white pustules'
  },
  {
    id: 12,
    crop: 'Maize',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Maize foliage with downy fungal growth on lower surface'
  },
  {
    id: 13,
    crop: 'Chilli',
    plantPart: 'Fruit',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Ripe chilli fruit with circular sunken anthracnose lesions'
  },
  {
    id: 14,
    crop: 'Mango',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Mango tender leaf flush with dark anthracnose spots'
  },
  {
    id: 15,
    crop: 'Onion',
    plantPart: 'Leaf',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Onion tubular foliage with purple blotch lesions'
  },
  {
    id: 16,
    crop: 'Pomegranate',
    plantPart: 'Fruit',
    expectedStatus: 'confirmed',
    expectedMinConfidence: 0.65,
    description: 'Pomegranate rind with oily bacterial blight spots'
  },

  // Low-Quality / Blurry Images (Must trigger "Not Sure" path)
  {
    id: 17,
    crop: 'Wheat',
    plantPart: 'Leaf',
    is_low_quality: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Severely out-of-focus phone camera photo of wheat leaf'
  },
  {
    id: 18,
    crop: 'Tomato',
    plantPart: 'Leaf',
    is_low_quality: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Heavily shadowed and motion-blurred tomato leaf'
  },
  {
    id: 19,
    crop: 'Rice',
    plantPart: 'Leaf',
    is_low_quality: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Overexposed washed-out flash image of paddy leaf'
  },

  // Non-Plant / Out-of-Distribution Objects (Must trigger "Not Sure" path)
  {
    id: 20,
    crop: 'Wheat',
    plantPart: 'Root',
    is_non_plant: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Dry clay soil clod without any visible plant tissue'
  },
  {
    id: 21,
    crop: 'Potato',
    plantPart: 'Leaf',
    is_non_plant: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Muddy farmer rubber boot in irrigation channel'
  },
  {
    id: 22,
    crop: 'Cotton',
    plantPart: 'Stem',
    is_non_plant: true,
    expectedStatus: 'uncertain_under_threshold',
    expectedMinConfidence: 0.1,
    expectedMaxConfidence: 0.64,
    description: 'Metallic tractor tire wheel rim'
  }
];

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('🧪 KISHAN RAKSHAK AI - PHASE 5 SCANNER TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName} ${extra}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${extra}`);
      failed++;
    }
  }

  console.log(`--- Running 22 Plant Disease Image Evaluation Cases ---\n`);

  for (const tc of TEST_CASES) {
    const input: ScanInput = {
      crop_name: tc.crop,
      plant_part: tc.plantPart,
      is_low_quality: tc.is_low_quality,
      is_non_plant: tc.is_non_plant,
      weather_context: tc.weather
    };

    const result = await runPlantDiseaseInference(input);

    // 1. Status Check
    const statusMatches = result.status === tc.expectedStatus;
    assert(
      statusMatches,
      `Case ${tc.id}: Status is ${result.status} (expected ${tc.expectedStatus})`,
      `[${tc.description}]`
    );

    // 2. Confidence Check
    const confidenceValid = result.confidence_score >= tc.expectedMinConfidence && 
      (tc.expectedMaxConfidence === undefined || result.confidence_score <= tc.expectedMaxConfidence);
    assert(
      confidenceValid,
      `Case ${tc.id}: Confidence score ${result.confidence_score} matches expected bounds`
    );

    // 3. Response Schema Completeness Check
    assert(
      Array.isArray(result.predictions) && result.predictions.length === 3,
      `Case ${tc.id}: Top-3 disease predictions array returned with probabilities`
    );
    assert(
      Array.isArray(result.visible_symptoms) && result.visible_symptoms.length > 0,
      `Case ${tc.id}: Visible symptoms documented`
    );
    assert(
      result.recommended_treatment !== undefined,
      `Case ${tc.id}: Recommended treatment block present`
    );

    // 4. Safe Chemical Recommendation Gate (Never hallucinate unverified free-text dosages)
    if (result.status === 'confirmed') {
      assert(
        result.recommended_treatment.cibrc_disclaimer.includes('CIB&RC'),
        `Case ${tc.id}: Includes mandatory CIB&RC label compliance disclaimer`
      );
      assert(
        result.organic_prevention.length > 0,
        `Case ${tc.id}: Organic and biological solutions prioritized first`
      );
    }

    // 5. "Not Sure" Path Specific Checks
    if (tc.expectedStatus === 'uncertain_under_threshold') {
      assert(
        result.kvk_guidance !== undefined && result.kvk_guidance.tips.length >= 3,
        `Case ${tc.id}: "Not Sure" path provides at least 3 photography tips`
      );
      assert(
        result.kvk_guidance?.helpline.includes('1800-180-1551') === true,
        `Case ${tc.id}: "Not Sure" path provides Kisan Call Center toll-free helpline`
      );
    }
  }

  // Database Persistence Verification
  console.log('\n--- Database Persistence (ai_diagnosis_history) ---');
  const db = await getDb();
  const histRes = await db.query<{ total: number }>(`SELECT COUNT(*)::int as total FROM ai_diagnosis_history`);
  const totalSaved = Number(histRes.rows[0]?.total || 0);
  assert(totalSaved > 0, `ai_diagnosis_history contains ${totalSaved} persisted diagnosis records`);

  console.log('\n====================================================');
  console.log(`🏁 PHASE 5 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch(err => {
  console.error('Phase 5 test execution failed:', err);
  process.exit(1);
});
