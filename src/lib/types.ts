export type UserRole = 'farmer' | 'expert' | 'admin';
export type DiseaseSeverity = 'Low' | 'Medium' | 'High' | 'Severe';
export type DiseaseCategory = 'Fungal' | 'Bacterial' | 'Viral' | 'Nematode' | 'Physiological' | 'Other';
export type CropCategory = 'Cereals' | 'Pulses' | 'Oilseeds' | 'Fruits' | 'Vegetables' | 'Cash crops' | 'Other';
export type TreatmentType = 'Cultural' | 'Mechanical' | 'Biological' | 'Organic' | 'Chemical';

export interface Crop {
  id: string;
  name: string;
  scientific_name: string | null;
  category: CropCategory;
  region: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CropVariety {
  id: string;
  crop_id: string;
  variety_name: string;
  duration_days: number | null;
  suitable_regions: string[];
  characteristics: string | null;
  created_at: string;
}

export interface PlantDisease {
  id: string;
  crop_id: string;
  crop_name?: string;
  crop_category?: string;
  disease_name: string;
  scientific_name: string | null;
  category: DiseaseCategory;
  symptoms_early: string | null;
  symptoms_advanced: string | null;
  causes: string | null;
  favourable_weather: Record<string, unknown>;
  spread: string | null;
  prevention: string | null;
  organic_treatment: string | null;
  ipm_methods: string | null;
  chemical_treatment: string | null;
  monitoring_recovery: string | null;
  severity: DiseaseSeverity;
  reference_images: string[];
  language: string;
  translations?: Record<string, any>;
  verified_sources: Array<{ title: string; url: string; cibr_code?: string }>;
  verified: boolean;
  verified_by: string | null;
  verified_by_name?: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiseaseTreatment {
  id: string;
  disease_id: string;
  treatment_type: TreatmentType;
  method_name: string;
  dosage: string | null;
  application_method: string | null;
  safety_interval_days: number | null;
  cibr_reg_no: string | null;
  source_url: string;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_name?: string | null;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'UNVERIFY' | 'BULK_IMPORT';
  table_name: string;
  record_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface DiseaseFilters {
  query?: string;
  crop_id?: string;
  crop_category?: string;
  category?: DiseaseCategory | 'All';
  severity?: DiseaseSeverity | 'All';
  verified?: boolean | string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// PHASE 4: WEATHER-TO-CROP RISK ENGINE TYPES
export type WeatherAlertType = 
  | 'HEAVY_RAINFALL' 
  | 'HEATWAVE' 
  | 'THUNDERSTORM_WIND' 
  | 'COLD_WAVE_FROST' 
  | 'MODERATE_NORMAL';

export type CropGrowthStage = 
  | 'SOWING_GERMINATION' 
  | 'VEGETATIVE' 
  | 'FLOWERING' 
  | 'GRAIN_FRUIT_FILLING' 
  | 'MATURITY_HARVEST' 
  | 'ALL_STAGES';

export type SoilType = 
  | 'CLAY_HEAVY' 
  | 'SANDY_LIGHT' 
  | 'LOAM_ALLUVIAL' 
  | 'ANY';

export interface CropWeatherRiskRule {
  id: string;
  crop_name: string;
  alert_type: WeatherAlertType;
  growth_stage: CropGrowthStage;
  soil_type: SoilType;
  risk_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  primary_risk: string;
  precautions: string[];
  favourable_disease_names: string[];
  source: string;
  verified: boolean;
  created_at: string;
}

export interface CropRiskEvaluationInput {
  crop_name: string;
  growth_stage: CropGrowthStage;
  soil_type: SoilType;
  alert_color?: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'UNAVAILABLE';
  weather?: {
    temperature: number;
    relative_humidity: number;
    precipitation_probability: number;
    wind_speed: number;
  };
}

export interface CropRiskEvaluationResult {
  badge: 'AI-generated advisory, not an official warning';
  crop_name: string;
  growth_stage: CropGrowthStage;
  soil_type: SoilType;
  alert_type_inferred: WeatherAlertType;
  risk_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  primary_risk: string;
  precautions: string[];
  associated_diseases: Array<{
    name: string;
    scientific_name?: string;
    favourable_conditions?: string;
    url?: string;
  }>;
  source_provenance: string;
  is_verified_source: boolean;
}

