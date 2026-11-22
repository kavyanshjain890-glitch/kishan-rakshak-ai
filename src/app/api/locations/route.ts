import { NextRequest, NextResponse } from 'next/server';
import { indianStatesData } from '@/lib/locations';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: indianStatesData
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
