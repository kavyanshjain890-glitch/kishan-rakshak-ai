import { NextRequest, NextResponse } from 'next/server';
import { importDiseaseRecord } from '../../../../../../scripts/import-disease';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.crop_name || !body.disease_name) {
      return NextResponse.json({ success: false, error: 'Crop Name and Disease Name are required.' }, { status: 400 });
    }

    if (!body.source_url || !body.source_url.startsWith('http')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mandatory Rule 8 Violation: Every draft record must cite an official government/university source_url.' 
      }, { status: 400 });
    }

    // Structure treatments array
    const treatments: any[] = [];
    if (body.organic_treatment && body.organic_treatment.trim()) {
      treatments.push({
        treatment_type: 'Biological',
        method_name: body.organic_method_name || 'Bio-Control / Organic Solution',
        dosage: body.organic_dosage || 'As prescribed by ICAR PoP',
        application_method: 'Foliar or seed treatment',
        source_url: body.source_url
      });
    }

    if (body.chemical_treatment && body.chemical_treatment.trim()) {
      if (!body.chemical_dosage || !body.chemical_dosage.trim()) {
        return NextResponse.json({
          success: false,
          error: 'Rule Violation: Chemical treatments must specify exact dosage from CIB&RC registered labels.'
        }, { status: 400 });
      }

      treatments.push({
        treatment_type: 'Chemical',
        method_name: body.chemical_name || 'Approved Fungicide / Insecticide',
        dosage: body.chemical_dosage,
        application_method: 'Targeted spray',
        safety_interval_days: body.safety_interval_days ? Number(body.safety_interval_days) : null,
        source_url: body.source_url
      });
    }

    const payload = {
      crop_name: body.crop_name,
      disease_name: body.disease_name,
      scientific_name: body.scientific_name || '',
      category: body.category || 'Fungal',
      severity: body.severity || 'Medium',
      symptoms_early: body.symptoms_early || null,
      symptoms_advanced: body.symptoms_advanced || null,
      causes: body.causes || null,
      favourable_weather: body.favourable_weather || { rainfall_relation: body.favourable_weather_text || '' },
      spread: body.spread || null,
      prevention: body.prevention || null,
      organic_treatment: body.organic_treatment || null,
      ipm_methods: body.ipm_methods || null,
      chemical_treatment: body.chemical_treatment || null,
      monitoring_recovery: body.monitoring_recovery || null,
      reference_images: body.image_url ? [{
        url: body.image_url,
        caption: body.image_caption || `${body.disease_name} on ${body.crop_name}`,
        license: body.image_license || 'PlantDoc / CC BY 4.0',
        credit: body.source_name || 'Official Sourced'
      }] : [],
      verified_sources: [{
        title: body.source_title || 'Official Agricultural Extension Package',
        url: body.source_url,
        authority: body.source_name || 'DPPQ&S / ICAR / State Agriculture University',
        publication_year: new Date().getFullYear()
      }],
      translations: {
        hi: {
          disease_name: body.disease_name_hi || body.disease_name,
          symptoms_early: body.symptoms_early_hi || '',
          symptoms_advanced: body.symptoms_advanced_hi || '',
          causes: body.causes_hi || '',
          favourable_weather_text: '',
          prevention: body.prevention_hi || '',
          organic_treatment: body.organic_treatment_hi || '',
          ipm_methods: '',
          chemical_treatment: body.chemical_treatment_hi || '',
          monitoring_recovery: ''
        },
        'hi-RJ': {
          disease_name: body.disease_name_rj || body.disease_name,
          symptoms_early: '',
          symptoms_advanced: '',
          organic_treatment: '',
          prevention: '',
          chemical_treatment: ''
        }
      },
      treatments
    };

    const diseaseId = await importDiseaseRecord(payload as any);
    return NextResponse.json({ success: true, disease_id: diseaseId });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 400 });
  }
}
