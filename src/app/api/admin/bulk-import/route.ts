import { NextRequest, NextResponse } from 'next/server';
import { bulkImportDiseases } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json({ success: false, error: 'Records array is required' }, { status: 400 });
    }

    const result = await bulkImportDiseases(body.records);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
