import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const logs = await getAuditLogs(limit);
    return NextResponse.json({ success: true, data: logs });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
