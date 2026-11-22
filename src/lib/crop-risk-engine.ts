import { 
  CropGrowthStage, 
  SoilType, 
  WeatherAlertType, 
  CropRiskEvaluationInput, 
  CropRiskEvaluationResult 
} from './types';
import { findMatchingRiskRule, getDb } from './db';

// Infer alert type from weather metrics or warning color
export function inferWeatherAlertType(
  alertColor?: string,
  weather?: {
    temperature: number;
    relative_humidity: number;
    precipitation_probability: number;
    wind_speed: number;
  }
): WeatherAlertType {
  if (alertColor === 'RED' || alertColor === 'ORANGE') {
    // If high wind is prominent
    if (weather && weather.wind_speed >= 35) {
      return 'THUNDERSTORM_WIND';
    }
    // If freezing temperatures
    if (weather && weather.temperature <= 5) {
      return 'COLD_WAVE_FROST';
    }
    // If scorching temperatures
    if (weather && weather.temperature >= 38) {
      return 'HEATWAVE';
    }
    // Default severe/high alert is heavy rainfall
    return 'HEAVY_RAINFALL';
  }

  if (weather) {
    if (weather.precipitation_probability >= 60) return 'HEAVY_RAINFALL';
    if (weather.temperature >= 38) return 'HEATWAVE';
    if (weather.temperature <= 6) return 'COLD_WAVE_FROST';
    if (weather.wind_speed >= 35) return 'THUNDERSTORM_WIND';
  }

  return 'MODERATE_NORMAL';
}

// Core evaluation function
export async function evaluateCropRisk(
  input: CropRiskEvaluationInput
): Promise<CropRiskEvaluationResult> {
  const { crop_name, growth_stage, soil_type, alert_color, weather } = input;

  const alertType = inferWeatherAlertType(alert_color, weather);

  // 1. Fetch matching rule from database
  const rule = await findMatchingRiskRule(crop_name, alertType, growth_stage, soil_type);

  // 2. Cross-reference plant_diseases table for favourable disease incubation
  let associatedDiseases: Array<{
    name: string;
    scientific_name?: string;
    favourable_conditions?: string;
    url?: string;
  }> = [];

  try {
    const db = await getDb();
    const diseaseQuery = await db.query(
      `SELECT d.id, d.disease_name, d.scientific_name, d.favourable_weather
       FROM plant_diseases d
       JOIN crops c ON d.crop_id = c.id
       WHERE lower(c.name) = lower($1)
       LIMIT 4`,
      [crop_name.trim()]
    );

    if (diseaseQuery.rows.length > 0) {
      const ruleDiseases = new Set((rule?.favourable_disease_names || []).map((n: string) => n.toLowerCase()));
      associatedDiseases = diseaseQuery.rows
        .filter((row: any) => {
          if (ruleDiseases.size === 0) return true;
          return ruleDiseases.has(row.disease_name.toLowerCase());
        })
        .map((row: any) => ({
          name: row.disease_name,
          scientific_name: row.scientific_name || undefined,
          favourable_conditions: typeof row.favourable_weather === 'object' && row.favourable_weather !== null
            ? JSON.stringify(row.favourable_weather)
            : 'High humidity (>85%) and temperature between 18-28°C',
          url: `/diseases/${row.id}`
        }));
    }
  } catch (err) {
    console.warn('Disease lookup warning:', err);
  }

  // If a verified rule was found in DB
  if (rule) {
    return {
      badge: 'AI-generated advisory, not an official warning',
      crop_name,
      growth_stage,
      soil_type,
      alert_type_inferred: alertType,
      risk_level: rule.risk_level,
      primary_risk: rule.primary_risk,
      precautions: rule.precautions,
      associated_diseases: associatedDiseases.length > 0 ? associatedDiseases : (rule.favourable_disease_names || []).map((name: string) => ({ name })),
      source_provenance: rule.source,
      is_verified_source: rule.verified === true
    };
  }

  // Fallback for unseeded combinations: marked as advisory_unverified
  return {
    badge: 'AI-generated advisory, not an official warning',
    crop_name,
    growth_stage,
    soil_type,
    alert_type_inferred: alertType,
    risk_level: alertType === 'MODERATE_NORMAL' ? 'Low' : 'Moderate',
    primary_risk: `Potential agronomic microclimate impact on standing ${crop_name} during ${growth_stage.replace('_', ' ').toLowerCase()} in ${soil_type.replace('_', ' ').toLowerCase()} soil.`,
    precautions: [
      'Inspect field drainage channels and monitor soil moisture levels regularly.',
      'Consult the local Krishi Vigyan Kendra (KVK) for district-specific advisories.',
      'Refrain from excessive irrigation or foliar fertilizer spraying until weather normalizes.'
    ],
    associated_diseases: associatedDiseases,
    source_provenance: 'advisory_unverified',
    is_verified_source: false
  };
}
