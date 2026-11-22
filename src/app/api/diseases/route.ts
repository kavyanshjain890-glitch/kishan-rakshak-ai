import { NextRequest, NextResponse } from 'next/server';
import { getDiseases } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const crop_id = searchParams.get('crop_id') || undefined;
    const crop_category = searchParams.get('crop_category') || undefined;
    const category = (searchParams.get('category') as any) || undefined;
    const severity = (searchParams.get('severity') as any) || undefined;
    // For public farmer library: default to verified only unless explicitly requested
    const verified = searchParams.get('verified') || 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

    const result = await getDiseases({
      query,
      crop_id,
      crop_category,
      category,
      severity,
      verified: verified === 'All' ? 'All' : verified === 'true',
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
