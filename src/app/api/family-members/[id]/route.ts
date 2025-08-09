import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const member = await prisma.person.findUnique({
      where: {
        id: id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching family member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family member' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

