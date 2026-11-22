import { NextRequest, NextResponse } from 'next/server';
import { getDiseases, createDisease, checkDiseaseDuplicate } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const crop_id = searchParams.get('crop_id') || undefined;
    const crop_category = searchParams.get('crop_category') || undefined;
    const category = (searchParams.get('category') as any) || undefined;
    const severity = (searchParams.get('severity') as any) || undefined;
    const verified = searchParams.get('verified') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const result = await getDiseases({
      query,
      crop_id,
      crop_category,
      category,
      severity,
      verified,
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check for duplicate check flag or create
    if (body.check_only) {
      const isDup = await checkDiseaseDuplicate(body.crop_id, body.disease_name);
      return NextResponse.json({ success: true, is_duplicate: isDup });
    }

    const disease = await createDisease(body);
    return NextResponse.json({ success: true, data: disease }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
