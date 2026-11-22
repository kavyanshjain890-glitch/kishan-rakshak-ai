import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';
import { Crop, PlantDisease, DiseaseFilters, PaginatedResult, AuditLog } from './types';

let dbInstance: PGlite | null = null;
let initialized = false;

// Ensure database instance is initialized and migrations are applied
export async function getDb(): Promise<PGlite> {
  if (dbInstance && initialized) {
    return dbInstance;
  }

  const dbPath = path.join(process.cwd(), '.db_pglite');
  dbInstance = new PGlite(dbPath);

  // Apply migrations if needed
  await runMigrations(dbInstance);
  initialized = true;
  return dbInstance;
}

export async function runMigrations(db: PGlite): Promise<void> {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    try {
      await db.exec(sql);
    } catch (err: unknown) {
      console.warn(`Migration ${file} notice:`, (err as Error).message);
    }
  }
}

// CROPS
export async function getCrops(category?: string, region?: string): Promise<Crop[]> {
  const db = await getDb();
  let sql = 'SELECT * FROM crops WHERE 1=1';
  const params: unknown[] = [];

  if (category && category !== 'All') {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }

  if (region && region !== 'All') {
    params.push(region);
    sql += ` AND region = $${params.length}`;
  }

  sql += ' ORDER BY category ASC, name ASC';
  const res = await db.query<Crop>(sql, params);
  return res.rows;
}

export async function createCrop(
  data: { name: string; scientific_name?: string; category: string; region?: string; description?: string },
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<Crop> {
  const db = await getDb();

  const insertRes = await db.query<Crop>(
    `INSERT INTO crops (name, scientific_name, category, region, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.name.trim(), data.scientific_name || null, data.category, data.region || 'All-India', data.description || null]
  );

  const crop = insertRes.rows[0];

  // Audit log
  await logAudit(db, actorId, 'INSERT', 'crops', crop.id, null, crop);
  return crop;
}

// DISEASES
export async function getDiseases(filters: DiseaseFilters = {}): Promise<PaginatedResult<PlantDisease>> {
  const db = await getDb();
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.max(1, filters.pageSize || 10);
  const offset = (page - 1) * pageSize;

  let whereClauses = ' WHERE 1=1';
  const params: unknown[] = [];

  if (filters.crop_id && filters.crop_id !== 'All') {
    params.push(filters.crop_id);
    whereClauses += ` AND d.crop_id = $${params.length}`;
  }

  if (filters.crop_category && filters.crop_category !== 'All') {
    params.push(filters.crop_category);
    whereClauses += ` AND c.category = $${params.length}`;
  }

  if (filters.category && filters.category !== 'All') {
    params.push(filters.category);
    whereClauses += ` AND d.category = $${params.length}`;
  }

  if (filters.severity && filters.severity !== 'All') {
    params.push(filters.severity);
    whereClauses += ` AND d.severity = $${params.length}`;
  }

  if (filters.verified !== undefined && filters.verified !== 'All') {
    const isVerified = filters.verified === true || filters.verified === 'true';
    params.push(isVerified);
    whereClauses += ` AND d.verified = $${params.length}`;
  }

  if (filters.query && filters.query.trim()) {
    params.push(`%${filters.query.trim()}%`);
    const qIdx = params.length;
    whereClauses += ` AND (
      d.disease_name ILIKE $${qIdx} 
      OR d.scientific_name ILIKE $${qIdx} 
      OR c.name ILIKE $${qIdx}
      OR d.symptoms_early ILIKE $${qIdx}
    )`;
  }

  // Count total
  const countSql = `
    SELECT COUNT(*)::int as total
    FROM plant_diseases d
    JOIN crops c ON d.crop_id = c.id
    ${whereClauses}
  `;
  const countRes = await db.query<{ total: number }>(countSql, params);
  const total = Number(countRes.rows[0]?.total || 0);

  // Fetch paginated
  const fetchSql = `
    SELECT 
      d.*,
      c.name as crop_name,
      c.category as crop_category,
      p.full_name as verified_by_name
    FROM plant_diseases d
    JOIN crops c ON d.crop_id = c.id
    LEFT JOIN profiles p ON d.verified_by = p.id
    ${whereClauses}
    ORDER BY d.created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const fetchParams = [...params, pageSize, offset];
  const dataRes = await db.query<PlantDisease>(fetchSql, fetchParams);

  return {
    data: dataRes.rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1
  };
}

export async function getDiseaseById(id: string): Promise<PlantDisease | null> {
  const db = await getDb();
  const res = await db.query<PlantDisease>(
    `SELECT d.*, c.name as crop_name, c.category as crop_category, p.full_name as verified_by_name
     FROM plant_diseases d
     JOIN crops c ON d.crop_id = c.id
     LEFT JOIN profiles p ON d.verified_by = p.id
     WHERE d.id = $1`,
    [id]
  );
  return res.rows[0] || null;
}

export async function getDiseaseTreatments(diseaseId: string): Promise<any[]> {
  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM disease_treatments 
     WHERE disease_id = $1 AND verified = true
     ORDER BY 
       CASE treatment_type
         WHEN 'Biological' THEN 1
         WHEN 'Organic' THEN 2
         WHEN 'Cultural' THEN 3
         WHEN 'Mechanical' THEN 4
         WHEN 'Chemical' THEN 5
         ELSE 6
       END ASC, created_at ASC`,
    [diseaseId]
  );
  return res.rows;
}

export async function checkDiseaseDuplicate(cropId: string, diseaseName: string, excludeId?: string): Promise<boolean> {
  const db = await getDb();
  let sql = 'SELECT id FROM plant_diseases WHERE crop_id = $1 AND lower(trim(disease_name)) = lower(trim($2))';
  const params: unknown[] = [cropId, diseaseName];

  if (excludeId) {
    sql += ' AND id != $3';
    params.push(excludeId);
  }

  const res = await db.query(sql, params);
  return res.rows.length > 0;
}

export async function createDisease(
  data: Partial<PlantDisease>,
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<PlantDisease> {
  const db = await getDb();

  if (!data.crop_id || !data.disease_name) {
    throw new Error('Crop ID and Disease Name are mandatory.');
  }

  // Pre-check duplicate
  const isDup = await checkDiseaseDuplicate(data.crop_id, data.disease_name);
  if (isDup) {
    throw new Error(`A disease named "${data.disease_name.trim()}" already exists for this crop.`);
  }

  const res = await db.query<PlantDisease>(
    `INSERT INTO plant_diseases (
      crop_id, disease_name, scientific_name, category, severity,
      symptoms_early, symptoms_advanced, causes, prevention,
      organic_treatment, ipm_methods, chemical_treatment, verified
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      data.crop_id,
      data.disease_name.trim(),
      data.scientific_name || null,
      data.category || 'Fungal',
      data.severity || 'Medium',
      data.symptoms_early || null,
      data.symptoms_advanced || null,
      data.causes || null,
      data.prevention || null,
      data.organic_treatment || null,
      data.ipm_methods || null,
      data.chemical_treatment || null,
      data.verified === true
    ]
  );

  const disease = res.rows[0];
  await logAudit(db, actorId, 'INSERT', 'plant_diseases', disease.id, null, disease);
  return disease;
}

export async function updateDisease(
  id: string,
  data: Partial<PlantDisease>,
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<PlantDisease> {
  const db = await getDb();
  const old = await getDiseaseById(id);
  if (!old) throw new Error('Disease not found');

  if (data.disease_name && data.crop_id) {
    const isDup = await checkDiseaseDuplicate(data.crop_id, data.disease_name, id);
    if (isDup) {
      throw new Error(`Another disease named "${data.disease_name.trim()}" already exists for this crop.`);
    }
  }

  const fields: string[] = [];
  const params: unknown[] = [id];

  const allowed = [
    'disease_name', 'scientific_name', 'category', 'severity',
    'symptoms_early', 'symptoms_advanced', 'causes', 'prevention',
    'organic_treatment', 'ipm_methods', 'chemical_treatment'
  ];

  for (const key of allowed) {
    if (key in data) {
      params.push((data as Record<string, unknown>)[key] || null);
      fields.push(`${key} = $${params.length}`);
    }
  }

  if (fields.length === 0) return old;

  fields.push('updated_at = NOW()');

  const sql = `UPDATE plant_diseases SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
  const res = await db.query<PlantDisease>(sql, params);
  const updated = res.rows[0];

  await logAudit(db, actorId, 'UPDATE', 'plant_diseases', id, old, updated);
  return updated;
}

export async function verifyDisease(
  id: string,
  verified: boolean,
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<PlantDisease> {
  const db = await getDb();
  const old = await getDiseaseById(id);
  if (!old) throw new Error('Disease not found');

  const verifiedAt = verified ? new Date().toISOString() : null;
  const verifiedBy = verified ? actorId : null;

  const res = await db.query<PlantDisease>(
    `UPDATE plant_diseases 
     SET verified = $1, verified_by = $2, verified_at = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [verified, verifiedBy, verifiedAt, id]
  );

  const updated = res.rows[0];
  const action = verified ? 'VERIFY' : 'UNVERIFY';
  await logAudit(db, actorId, action, 'plant_diseases', id, { verified: old.verified }, { verified });
  return updated;
}

export async function deleteDisease(
  id: string,
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<void> {
  const db = await getDb();
  const old = await getDiseaseById(id);
  if (!old) throw new Error('Disease not found');

  await db.query('DELETE FROM plant_diseases WHERE id = $1', [id]);
  await logAudit(db, actorId, 'DELETE', 'plant_diseases', id, old, null);
}

// AUDIT LOGGING
export async function logAudit(
  db: PGlite,
  actorId: string | null,
  action: AuditLog['action'],
  tableName: string,
  recordId: string,
  oldValues: unknown,
  newValues: unknown
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO audit_logs (actor_id, action, table_name, record_id, old_values, new_values)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        actorId,
        action,
        tableName,
        recordId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null
      ]
    );
  } catch (e) {
    console.warn('Audit log write error:', e);
  }
}

export async function getAuditLogs(limit = 50): Promise<AuditLog[]> {
  const db = await getDb();
  const res = await db.query<AuditLog>(
    `SELECT a.*, p.full_name as actor_name
     FROM audit_logs a
     LEFT JOIN profiles p ON a.actor_id = p.id
     ORDER BY a.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return res.rows;
}

// BULK IMPORT
export async function bulkImportDiseases(
  records: Array<{ crop_name: string; disease_name: string; category?: string; severity?: string }>,
  actorId = '00000000-0000-0000-0000-000000000001'
): Promise<{ inserted: number; skippedDuplicates: number; errors: string[] }> {
  const db = await getDb();
  const crops = await getCrops();
  const cropMap = new Map(crops.map(c => [c.name.toLowerCase().trim(), c.id]));

  let inserted = 0;
  let skippedDuplicates = 0;
  const errors: string[] = [];

  for (const row of records) {
    const cropId = cropMap.get(row.crop_name?.toLowerCase().trim());
    if (!cropId) {
      errors.push(`Crop not found: "${row.crop_name}"`);
      continue;
    }

    if (!row.disease_name?.trim()) {
      errors.push(`Disease name empty for crop: "${row.crop_name}"`);
      continue;
    }

    const isDup = await checkDiseaseDuplicate(cropId, row.disease_name);
    if (isDup) {
      skippedDuplicates++;
      continue;
    }

    try {
      await createDisease({
        crop_id: cropId,
        disease_name: row.disease_name.trim(),
        category: (row.category as any) || 'Fungal',
        severity: (row.severity as any) || 'Medium',
        verified: false
      }, actorId);
      inserted++;
    } catch (err: unknown) {
      errors.push(`Error inserting "${row.disease_name}": ${(err as Error).message}`);
    }
  }

  await logAudit(db, actorId, 'BULK_IMPORT', 'plant_diseases', 'batch', null, { inserted, skippedDuplicates });
  return { inserted, skippedDuplicates, errors };
}

// PHASE 4: CROP WEATHER RISK RULES
export async function getCropWeatherRiskRules(cropName?: string, alertType?: string): Promise<any[]> {
  const db = await getDb();
  let sql = 'SELECT * FROM crop_weather_risk_rules WHERE 1=1';
  const params: unknown[] = [];

  if (cropName) {
    params.push(cropName.trim());
    sql += ` AND lower(crop_name) = lower($${params.length})`;
  }

  if (alertType) {
    params.push(alertType);
    sql += ` AND alert_type = $${params.length}`;
  }

  sql += ' ORDER BY created_at ASC';
  const res = await db.query(sql, params);
  return res.rows;
}

export async function findMatchingRiskRule(
  cropName: string,
  alertType: string,
  growthStage: string,
  soilType: string
): Promise<any | null> {
  const db = await getDb();
  
  // Strict crop match: crop + alert + (stage or ALL) + (soil or ANY)
  const res = await db.query(
    `SELECT * FROM crop_weather_risk_rules 
     WHERE lower(crop_name) = lower($1)
       AND alert_type = $2
       AND (growth_stage = $3 OR growth_stage = 'ALL_STAGES')
       AND (soil_type = $4 OR soil_type = 'ANY')
     ORDER BY 
       CASE WHEN soil_type = $4 THEN 1 ELSE 2 END,
       CASE WHEN growth_stage = $3 THEN 1 ELSE 2 END
     LIMIT 1`,
    [cropName.trim(), alertType, growthStage, soilType]
  );

  if (res.rows.length > 0) return res.rows[0];

  return null;
}

