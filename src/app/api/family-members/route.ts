export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const familyMembers = await prisma.person.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(familyMembers);
  } catch (error) {
    console.error('Error fetching family members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



