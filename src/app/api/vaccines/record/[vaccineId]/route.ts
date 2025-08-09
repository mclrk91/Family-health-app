import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ vaccineId: string }> }
) {
  try {
    const { vaccineId } = await params;
    const body = await request.json();
    const { name, date, nextDueDate, notes } = body as {
      name?: string;
      date?: string;
      nextDueDate?: string | null;
      notes?: string | null;
    };

    const updated = await prisma.vaccine.update({
      where: { id: vaccineId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(date !== undefined ? { date: new Date(date) } : {}),
        ...(nextDueDate !== undefined
          ? { nextDueDate: nextDueDate ? new Date(nextDueDate) : null }
          : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating vaccine:', error);
    return NextResponse.json(
      { error: 'Failed to update vaccine' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ vaccineId: string }> }
) {
  try {
    const { vaccineId } = await params;

    await prisma.vaccine.delete({ where: { id: vaccineId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vaccine:', error);
    return NextResponse.json(
      { error: 'Failed to delete vaccine' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


