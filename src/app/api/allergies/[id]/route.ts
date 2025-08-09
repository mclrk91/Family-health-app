import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const allergies = await prisma.allergy.findMany({
      where: {
        personId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(allergies);
  } catch (error) {
    console.error('Error fetching allergies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch allergies' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

