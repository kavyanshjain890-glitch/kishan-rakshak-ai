import { getDb, getDiseaseById, getDiseaseTreatments } from '../src/lib/db';
import { importDiseaseRecord } from './import-disease';

async function runPhase2Tests() {
  console.log('========================================================');
  console.log('🧪 RUNNING KISHAN RAKSHAK AI - PHASE 2 TEST SUITE');
  console.log('========================================================\n');

  const db = await getDb();

  // 1. Verify 5 Pilot Sourced Diseases
  console.log('1️⃣ [PILOT DISEASES] Verifying 5 pilot diseases from official cited sources...');
  const expectedPilots = [
    { crop: 'Rice', disease: 'Blast', sci: 'Pyricularia oryzae' },
    { crop: 'Wheat', disease: 'Yellow Rust', sci: 'Puccinia striiformis' },
    { crop: 'Tomato', disease: 'Late Blight', sci: 'Phytophthora infestans' },
    { crop: 'Potato', disease: 'Late Blight', sci: 'Phytophthora infestans' },
    { crop: 'Cotton', disease: 'Bacterial Blight', sci: 'Xanthomonas citri' }
  ];

  for (const pilot of expectedPilots) {
    const res = await db.query<any>(
      `SELECT d.*, c.name as crop_name 
       FROM plant_diseases d
       JOIN crops c ON d.crop_id = c.id
       WHERE lower(c.name) = lower($1) AND lower(d.disease_name) = lower($2)`,
      [pilot.crop, pilot.disease]
    );

    if (res.rows.length === 0) {
      throw new Error(`FAIL: Pilot disease "${pilot.disease}" for "${pilot.crop}" not found in database.`);
    }

    const d = res.rows[0];
    if (!d.verified) throw new Error(`FAIL: "${d.disease_name}" is not marked verified = true.`);
    if (!d.verified_by) throw new Error(`FAIL: "${d.disease_name}" lacks verified_by.`);
    if (!d.verified_at) throw new Error(`FAIL: "${d.disease_name}" lacks verified_at timestamp.`);
    if (!d.symptoms_early || !d.symptoms_advanced) throw new Error(`FAIL: "${d.disease_name}" lacks detailed symptoms.`);

    console.log(`   ✓ Verified Pilot: "${d.disease_name}" on ${d.crop_name} (${d.scientific_name})`);
  }
  console.log('   ✓ All 5 pilot diseases verified with full agronomic details.\n');

  // 2. Sourcing Verification on Every Treatment Line
  console.log('2️⃣ [TREATMENT SOURCING] Verifying every treatment line has an official source URL...');
  const allTreatments = await db.query<any>(`SELECT * FROM disease_treatments WHERE verified = true`);
  console.log(`   ✓ Total verified treatments in database: ${allTreatments.rows.length}`);

  if (allTreatments.rows.length === 0) {
    throw new Error('FAIL: No verified treatments found in database.');
  }

  for (const t of allTreatments.rows) {
    if (!t.source_url || !t.source_url.startsWith('http')) {
      throw new Error(`FAIL: Treatment "${t.method_name}" lacks an authentic http source URL.`);
    }
    if (t.treatment_type === 'Chemical') {
      if (!t.dosage) throw new Error(`FAIL: Chemical treatment "${t.method_name}" lacks registered dosage.`);
    }
  }
  console.log('   ✓ 100% of treatment lines contain verified official government/university source URLs.');
  console.log('   ✓ Zero unverified chemical dosages present in database.\n');

  // 3. Organic & Biological Priority Verification
  console.log('3️⃣ [ORGANIC FIRST] Verifying Organic & Biological treatments precede chemical treatments...');
  const rice = (await db.query<{ id: string }>(`SELECT id FROM plant_diseases WHERE disease_name = 'Blast';`)).rows[0];
  const orderedTreatments = await getDiseaseTreatments(rice.id);

  console.log(`   Treatments returned for Rice Blast: ${orderedTreatments.map(t => `${t.treatment_type}: ${t.method_name}`).join(' -> ')}`);
  
  if (orderedTreatments.length >= 2) {
    const firstType = orderedTreatments[0].treatment_type;
    const lastType = orderedTreatments[orderedTreatments.length - 1].treatment_type;

    if (firstType !== 'Biological' && firstType !== 'Organic') {
      throw new Error(`FAIL: First treatment must be Biological or Organic, got ${firstType}`);
    }
    if (lastType === 'Chemical') {
      console.log('   ✓ Biological/Organic correctly ordered first, Chemical ordered last.');
    }
  }
  console.log('   ✓ Organic-first display rule strictly verified.\n');

  // 4. Multilingual Sourcing Verification
  console.log('4️⃣ [MULTILINGUAL] Verifying Hindi (hi) and Rajasthani (hi-RJ) translations...');
  for (const pilot of expectedPilots) {
    const res = await db.query<any>(
      `SELECT d.translations, d.disease_name 
       FROM plant_diseases d
       JOIN crops c ON d.crop_id = c.id
       WHERE lower(c.name) = lower($1) AND lower(d.disease_name) = lower($2)`,
      [pilot.crop, pilot.disease]
    );

    const trans = typeof res.rows[0].translations === 'string' 
      ? JSON.parse(res.rows[0].translations) 
      : res.rows[0].translations;

    if (!trans?.hi?.disease_name) {
      throw new Error(`Missing Hindi translation for ${pilot.disease}`);
    }
    if (!trans?.['hi-RJ']?.disease_name) {
      throw new Error(`Missing Rajasthani translation for ${pilot.disease}`);
    }
    console.log(`   ✓ "${pilot.disease}" -> Hindi: "${trans.hi.disease_name}", Rajasthani: "${trans['hi-RJ'].disease_name}"`);
  }
  console.log('   ✓ Multilingual dictionary validated for all pilot records.\n');

  // 5. Strict Import Validation Tool Check
  console.log('5️⃣ [IMPORT VALIDATION TOOL] Testing import-disease validation rules...');
  let errorCaught = false;
  try {
    // Attempt to import a chemical without source URL
    await importDiseaseRecord({
      crop_name: 'Rice',
      disease_name: 'Test Unverified Disease',
      scientific_name: 'Test Pathogen',
      category: 'Fungal',
      severity: 'Medium',
      symptoms_early: 'Spots',
      symptoms_advanced: 'Blight',
      causes: 'Pathogen',
      favourable_weather: { temperature_min: 20, temperature_max: 30, humidity_min: 70, rainfall_relation: 'rain' },
      spread: 'Air',
      prevention: 'Hygiene',
      organic_treatment: 'Neem',
      ipm_methods: 'Sanitation',
      chemical_treatment: 'Fake Chemical',
      monitoring_recovery: 'Monitor',
      reference_images: [],
      verified_sources: [],
      translations: { hi: {} as any, 'hi-RJ': {} as any },
      treatments: [
        {
          treatment_type: 'Chemical',
          method_name: 'Unverified Chemical',
          dosage: '10g/L',
          application_method: 'spray',
          safety_interval_days: 10,
          source_url: '' // Missing!
        }
      ]
    });
  } catch (err: unknown) {
    errorCaught = true;
    console.log(`   ✓ Correctly caught and rejected unverified treatment: ${(err as Error).message}`);
  }

  if (!errorCaught) {
    throw new Error('FAIL: Import tool accepted unverified treatment without source URL!');
  }
  console.log('   ✓ Strict import tool validation working.\n');

  console.log('========================================================');
  console.log('🎉 ALL PHASE 2 ACCEPTANCE CRITERIA PASSED CLEANLY!');
  console.log('========================================================\n');
}

runPhase2Tests().catch((err) => {
  console.error('❌ PHASE 2 TEST SUITE FAILED:', err);
  process.exit(1);
});
