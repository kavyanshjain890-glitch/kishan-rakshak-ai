import { NextRequest, NextResponse } from 'next/server';
import { getDiseaseById, getDiseaseTreatments } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const disease = await getDiseaseById(params.id);
    if (!disease) {
      return NextResponse.json({ success: false, error: 'Disease not found' }, { status: 404 });
    }

    const treatments = await getDiseaseTreatments(params.id);

    return NextResponse.json({
      success: true,
      data: {
        ...disease,
        treatments,
      }
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
