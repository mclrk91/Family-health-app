import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const medications = await prisma.medication.findMany({
      where: {
        personId: id,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

