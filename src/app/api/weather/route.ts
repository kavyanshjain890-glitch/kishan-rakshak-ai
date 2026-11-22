import { NextRequest, NextResponse } from 'next/server';
import { getCompleteWeatherData, AlertColor } from '@/lib/weather-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district_id = searchParams.get('district_id') || undefined;
    const mock_alert = (searchParams.get('mock_alert')?.toUpperCase() as AlertColor) || undefined;

    const data = await getCompleteWeatherData(district_id, mock_alert);
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
