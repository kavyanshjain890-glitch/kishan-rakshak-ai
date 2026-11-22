-- Supabase Migration: 20261120000001_initial_schema.sql
-- KISHAN RAKSHAK AI Database Foundation Schema

-- 1. EXTENSIONS & AUTH SCHEMA MOCK (PostgreSQL 13+ includes gen_random_uuid() built-in)
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
    SELECT coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'),
        '00000000-0000-0000-0000-000000000001'
    )::uuid;
$$;

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'expert', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disease_severity AS ENUM ('Low', 'Medium', 'High', 'Severe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE warning_color_code AS ENUM ('Green', 'Yellow', 'Orange', 'Red');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE treatment_type AS ENUM ('Cultural', 'Mechanical', 'Biological', 'Organic', 'Chemical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES & GEOGRAPHY
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_state_district UNIQUE (state_id, name)
);

CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    state_id INTEGER REFERENCES states(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    village_id INTEGER REFERENCES villages(id) ON DELETE SET NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CROPS & VARIETIES
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    scientific_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('Cereals', 'Pulses', 'Oilseeds', 'Fruits', 'Vegetables', 'Cash crops', 'Other')),
    region TEXT NOT NULL DEFAULT 'All-India',
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_varieties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    variety_name TEXT NOT NULL,
    duration_days INTEGER,
    suitable_regions TEXT[] DEFAULT '{}',
    characteristics TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_crop_variety UNIQUE (crop_id, variety_name)
);

CREATE TABLE IF NOT EXISTS regional_crop_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    region TEXT NOT NULL,
    sowing_season TEXT,
    major_soils TEXT[] DEFAULT '{}',
    special_advisories TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PLANT DISEASES & SYMPTOMS
CREATE TABLE IF NOT EXISTS plant_diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    disease_name TEXT NOT NULL,
    scientific_name TEXT,
    category TEXT NOT NULL DEFAULT 'Fungal' CHECK (category IN ('Fungal', 'Bacterial', 'Viral', 'Nematode', 'Physiological', 'Other')),
    symptoms_early TEXT,
    symptoms_advanced TEXT,
    causes TEXT,
    favourable_weather JSONB DEFAULT '{}'::jsonb,
    spread TEXT,
    prevention TEXT,
    organic_treatment TEXT,
    ipm_methods TEXT,
    chemical_treatment TEXT, -- Nullable, official sourced only
    monitoring_recovery TEXT,
    severity disease_severity NOT NULL DEFAULT 'Medium',
    reference_images JSONB DEFAULT '[]'::jsonb,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    translations JSONB DEFAULT '{}'::jsonb,
    verified_sources JSONB DEFAULT '[]'::jsonb,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UNIQUE CONSTRAINT: (crop_id, normalised disease_name)
CREATE UNIQUE INDEX IF NOT EXISTS uq_crop_disease_normalised
    ON plant_diseases (crop_id, lower(trim(disease_name)));

CREATE TABLE IF NOT EXISTS disease_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID NOT NULL REFERENCES plant_diseases(id) ON DELETE CASCADE,
    affected_part TEXT NOT NULL CHECK (affected_part IN ('leaf', 'stem', 'root', 'fruit', 'flower', 'whole_plant')),
    symptom_description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disease_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID NOT NULL REFERENCES plant_diseases(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    dataset_source TEXT CHECK (dataset_source IN ('PlantDoc', 'PlantVillage', 'Paddy Doctor', 'Field Upload', 'Official Bulletin')),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TREATMENTS & ORGANIC SOLUTIONS
CREATE TABLE IF NOT EXISTS disease_treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID NOT NULL REFERENCES plant_diseases(id) ON DELETE CASCADE,
    treatment_type treatment_type NOT NULL,
    method_name TEXT NOT NULL,
    dosage TEXT,
    application_method TEXT,
    safety_interval_days INTEGER,
    cibr_reg_no TEXT,
    source_url TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organic_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    preparation_steps TEXT NOT NULL,
    shelf_life_days INTEGER,
    target_pests_diseases TEXT[] DEFAULT '{}',
    source_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PESTS
CREATE TABLE IF NOT EXISTS pests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    pest_name TEXT NOT NULL,
    scientific_name TEXT,
    pest_type TEXT NOT NULL CHECK (pest_type IN ('Insect', 'Mite', 'Nematode', 'Rodent', 'Weed')),
    symptoms TEXT,
    etl_threshold TEXT, -- Economic Threshold Level
    cultural_control TEXT,
    biological_control TEXT,
    chemical_control TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_crop_pest UNIQUE (crop_id, pest_name)
);

-- 8. WEATHER ALERTS & RISKS
CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    alert_source TEXT NOT NULL CHECK (alert_source IN ('Official IMD', 'State Agromet')),
    warning_color warning_color_code NOT NULL,
    hazard_type TEXT NOT NULL,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ NOT NULL,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_weather_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    disease_id UUID REFERENCES plant_diseases(id) ON DELETE CASCADE,
    pest_id UUID REFERENCES pests(id) ON DELETE CASCADE,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Severe')),
    weather_condition_trigger JSONB NOT NULL,
    advisory_text TEXT NOT NULL,
    badge_type TEXT NOT NULL DEFAULT 'AI-generated advisory, not an official warning',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADVISORIES, REFERENCES & AI HISTORY
CREATE TABLE IF NOT EXISTS agricultural_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    advisory_body TEXT NOT NULL,
    bulletin_date DATE NOT NULL,
    source TEXT NOT NULL DEFAULT 'GKMS / IMD Agromet',
    bulletin_pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS government_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    publication_year INTEGER,
    document_type TEXT,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_diagnosis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    detected_crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
    detected_disease_id UUID REFERENCES plant_diseases(id) ON DELETE SET NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'uncertain_under_threshold', 'feedback_submitted')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_table VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL CHECK (language_code IN ('en', 'hi', 'hi-RJ')),
    field_name VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_translation_field UNIQUE (entity_table, entity_id, language_code, field_name)
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'VERIFY', 'UNVERIFY', 'BULK_IMPORT')),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FULL-TEXT SEARCH AND PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_plant_diseases_crop_id ON plant_diseases(crop_id);
CREATE INDEX IF NOT EXISTS idx_plant_diseases_category ON plant_diseases(category);
CREATE INDEX IF NOT EXISTS idx_plant_diseases_severity ON plant_diseases(severity);
CREATE INDEX IF NOT EXISTS idx_plant_diseases_verified ON plant_diseases(verified);

-- GIN Full Text Search on plant_diseases
CREATE INDEX IF NOT EXISTS idx_plant_diseases_fts ON plant_diseases USING gin(
    to_tsvector('english', 
        coalesce(disease_name, '') || ' ' || 
        coalesce(scientific_name, '') || ' ' || 
        coalesce(symptoms_early, '') || ' ' || 
        coalesce(symptoms_advanced, '') || ' ' ||
        coalesce(causes, '')
    )
);

CREATE INDEX IF NOT EXISTS idx_crops_category ON crops(category);
CREATE INDEX IF NOT EXISTS idx_crops_region ON crops(region);
CREATE INDEX IF NOT EXISTS idx_disease_treatments_disease_id ON disease_treatments(disease_id);
CREATE INDEX IF NOT EXISTS idx_disease_treatments_verified ON disease_treatments(verified);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_district_date ON weather_alerts(district_id, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 13. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_crop_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE organic_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_weather_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agricultural_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_diagnosis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Crops & Varieties: Public readable
CREATE POLICY "Public crops read" ON crops FOR SELECT USING (true);
CREATE POLICY "Admin crops write" ON crops FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Public varieties read" ON crop_varieties FOR SELECT USING (true);
CREATE POLICY "Admin varieties write" ON crop_varieties FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Plant Diseases:
-- Rule 6 & 8: Unverified records MUST be hidden from farmers by default.
CREATE POLICY "Farmer diseases read verified" ON plant_diseases FOR SELECT USING (
    verified = TRUE 
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin diseases write" ON plant_diseases FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Disease Treatments:
-- Unverified treatments hidden from farmers
CREATE POLICY "Farmer treatments read verified" ON disease_treatments FOR SELECT USING (
    verified = TRUE 
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin treatments write" ON disease_treatments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Organic Solutions & References: Public read
CREATE POLICY "Public organic solutions read" ON organic_solutions FOR SELECT USING (verified = TRUE);
CREATE POLICY "Admin organic solutions write" ON organic_solutions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Public references read" ON government_references FOR SELECT USING (true);
CREATE POLICY "Admin references write" ON government_references FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Audit Logs: Admin only read/write
CREATE POLICY "Admin audit logs read" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "System audit logs insert" ON audit_logs FOR INSERT WITH CHECK (true);
