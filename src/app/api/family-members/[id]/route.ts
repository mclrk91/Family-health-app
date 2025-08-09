export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // one more ../ from [id] folder

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = params;

    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        allergies: true,
        medications: true,
        diagnoses: true,
        procedures: true,
        vaccines: true,
        labResults: { include: { components: true } },
        vitals: true,
        documents: true,
        reminders: true,
        appointments: true,
        healthSummaries: true,
      },
    });

    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(person);
  } catch (error) {
    console.error('Error fetching family member by id:', error);
    return NextResponse.json({ error: 'Failed to fetch family member' }, { status: 500 });
  }
}
