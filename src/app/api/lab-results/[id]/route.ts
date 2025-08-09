import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const labResults = await prisma.labResult.findMany({
      where: {
        personId: id,
      },
      include: {
        components: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(labResults);
  } catch (error) {
    console.error('Error fetching lab results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab results' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

