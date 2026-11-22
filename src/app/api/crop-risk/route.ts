import { NextRequest, NextResponse } from 'next/server';
import { evaluateCropRisk } from '@/lib/crop-risk-engine';
import { CropGrowthStage, SoilType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { crop_name, growth_stage, soil_type, alert_color, weather } = body;

    if (!crop_name) {
      return NextResponse.json({ success: false, error: 'crop_name is required' }, { status: 400 });
    }

    const result = await evaluateCropRisk({
      crop_name,
      growth_stage: (growth_stage as CropGrowthStage) || 'VEGETATIVE',
      soil_type: (soil_type as SoilType) || 'CLAY_HEAVY',
      alert_color,
      weather
    });

    return NextResponse.json({ success: true, advisory: result });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
