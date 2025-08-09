import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const vaccines = await prisma.vaccine.findMany({
      where: {
        personId: id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vaccines' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, date, nextDueDate, notes } = body as {
      name: string;
      date: string;
      nextDueDate?: string;
      notes?: string;
    };

    if (!name || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: name and date' },
        { status: 400 }
      );
    }

    const created = await prisma.vaccine.create({
      data: {
        name,
        date: new Date(date),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
        notes,
        personId: id,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating vaccine:', error);
    return NextResponse.json(
      { error: 'Failed to create vaccine' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

