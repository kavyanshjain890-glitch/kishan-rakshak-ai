import { NextRequest, NextResponse } from 'next/server';
import { getCrops, createCrop } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const region = searchParams.get('region') || undefined;

    const crops = await getCrops(category, region);
    return NextResponse.json({ success: true, data: crops });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, error: 'Name and category are required' }, { status: 400 });
    }

    const crop = await createCrop(body);
    return NextResponse.json({ success: true, data: crop }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
