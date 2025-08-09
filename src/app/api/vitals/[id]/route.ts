import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const vitals = await prisma.vital.findMany({
      where: {
        personId: id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(vitals);
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vitals' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

