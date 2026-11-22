import { getDb, logAudit } from '../src/lib/db';
import { pilotDiseases, PilotDiseaseData } from '../src/data/pilot-diseases';
import fs from 'fs';

async function importDiseaseRecord(data: PilotDiseaseData, actorId = '00000000-0000-0000-0000-000000000001') {
  const db = await getDb();

  // 1. Resolve crop
  const cropRes = await db.query<{ id: string }>(
    `SELECT id FROM crops WHERE lower(name) = lower($1)`,
    [data.crop_name.trim()]
  );

  if (cropRes.rows.length === 0) {
    throw new Error(`Crop "${data.crop_name}" not found in crops catalog.`);
  }

  const cropId = cropRes.rows[0].id;

  // 2. Validate strict rules:
  // - No chemical treatments without source_url
  if (data.treatments && data.treatments.length > 0) {
    for (const t of data.treatments) {
      if (!t.source_url || !t.source_url.startsWith('http')) {
        throw new Error(`Strict validation failed for "${data.disease_name}": Treatment "${t.method_name}" lacks a valid official source_url.`);
      }
    }
  }

  if (!data.verified_sources || data.verified_sources.length === 0) {
    throw new Error(`Strict validation failed for "${data.disease_name}": Must include at least one verified government source.`);
  }

  // 3. Upsert into plant_diseases
  const checkRes = await db.query<{ id: string }>(
    `SELECT id FROM plant_diseases WHERE crop_id = $1 AND lower(trim(disease_name)) = lower(trim($2))`,
    [cropId, data.disease_name]
  );

  let diseaseId: string;

  if (checkRes.rows.length > 0) {
    diseaseId = checkRes.rows[0].id;
    await db.query(
      `UPDATE plant_diseases SET
        scientific_name = $1,
        category = $2,
        severity = $3,
        symptoms_early = $4,
        symptoms_advanced = $5,
        causes = $6,
        favourable_weather = $7,
        spread = $8,
        prevention = $9,
        organic_treatment = $10,
        ipm_methods = $11,
        chemical_treatment = $12,
        monitoring_recovery = $13,
        reference_images = $14,
        translations = $15,
        verified_sources = $16,
        verified = true,
        verified_by = $17,
        verified_at = NOW(),
        updated_at = NOW()
      WHERE id = $18`,
      [
        data.scientific_name,
        data.category,
        data.severity,
        data.symptoms_early,
        data.symptoms_advanced,
        data.causes,
        JSON.stringify(data.favourable_weather),
        data.spread,
        data.prevention,
        data.organic_treatment,
        data.ipm_methods,
        data.chemical_treatment,
        data.monitoring_recovery,
        JSON.stringify(data.reference_images),
        JSON.stringify(data.translations),
        JSON.stringify(data.verified_sources),
        actorId,
        diseaseId
      ]
    );
    console.log(`   ✓ Updated stub "${data.disease_name}" (${data.crop_name}) with verified cited content.`);
  } else {
    const insertRes = await db.query<{ id: string }>(
      `INSERT INTO plant_diseases (
        crop_id, disease_name, scientific_name, category, severity,
        symptoms_early, symptoms_advanced, causes, favourable_weather,
        spread, prevention, organic_treatment, ipm_methods, chemical_treatment,
        monitoring_recovery, reference_images, translations, verified_sources,
        verified, verified_by, verified_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, true, $19, NOW())
      RETURNING id`,
      [
        cropId,
        data.disease_name.trim(),
        data.scientific_name,
        data.category,
        data.severity,
        data.symptoms_early,
        data.symptoms_advanced,
        data.causes,
        JSON.stringify(data.favourable_weather),
        data.spread,
        data.prevention,
        data.organic_treatment,
        data.ipm_methods,
        data.chemical_treatment,
        data.monitoring_recovery,
        JSON.stringify(data.reference_images),
        JSON.stringify(data.translations),
        JSON.stringify(data.verified_sources),
        actorId
      ]
    );
    diseaseId = insertRes.rows[0].id;
    console.log(`   ✓ Inserted verified disease "${data.disease_name}" (${data.crop_name}).`);
  }

  // 4. Populate granular treatments into disease_treatments table
  // Clear old treatments for idempotency
  await db.query(`DELETE FROM disease_treatments WHERE disease_id = $1`, [diseaseId]);

  for (const t of data.treatments) {
    await db.query(
      `INSERT INTO disease_treatments (
        disease_id, treatment_type, method_name, dosage, application_method,
        safety_interval_days, source_url, verified, verified_by, verified_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, NOW())`,
      [
        diseaseId,
        t.treatment_type,
        t.method_name,
        t.dosage,
        t.application_method,
        t.safety_interval_days || null,
        t.source_url,
        actorId
      ]
    );
  }

  // 5. Audit Log
  await logAudit(db, actorId, 'VERIFY', 'plant_diseases', diseaseId, null, {
    disease_name: data.disease_name,
    crop: data.crop_name,
    verified_sources: data.verified_sources.map(s => s.title)
  });

  return diseaseId;
}

async function main() {
  console.log('========================================================');
  console.log('📦 KISHAN RAKSHAK AI - OFFICIAL DISEASE IMPORT TOOL');
  console.log('========================================================\n');

  const args = process.argv.slice(2);
  let dataset: PilotDiseaseData[] = pilotDiseases;

  if (args.includes('--file')) {
    const fileIdx = args.indexOf('--file') + 1;
    const filePath = args[fileIdx];
    if (!filePath || !fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    dataset = JSON.parse(content);
  }

  console.log(`Importing ${dataset.length} verified disease record(s)...`);

  for (const record of dataset) {
    try {
      await importDiseaseRecord(record);
    } catch (err: unknown) {
      console.error(`❌ Failed importing "${record.disease_name}":`, (err as Error).message);
    }
  }

  console.log('\n✅ All records successfully imported and verified in database.');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error in import-disease:', err);
    process.exit(1);
  });
}

export { importDiseaseRecord };
