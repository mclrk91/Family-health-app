import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const reminders = await prisma.reminder.findMany({
      where: {
        personId: id,
      },
      orderBy: [
        { status: 'asc' }, // OVERDUE first, then PENDING, etc.
        { dueDate: 'asc' }
      ],
      include: {
        doctor: true,
        clinic: true,
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
