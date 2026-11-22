import { NextRequest, NextResponse } from 'next/server';
import { verifyDisease } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const verified = Boolean(body.verified);
    const updated = await verifyDisease(params.id, verified);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
