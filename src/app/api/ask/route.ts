import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

type FamilyMember = {
  id: string;
  name: string;
  species: 'HUMAN' | 'CANINE';
};

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY on server' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { question, familyMembers } = body as {
      question: string;
      familyMembers?: FamilyMember[];
    };

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Build CONTEXT strictly from app database
    const people = await prisma.person.findMany({
      include: {
        allergies: true,
        medications: true,
        vaccines: true,
        vitals: true,
        reminders: true,
        appointments: true,
        labResults: {
          include: { components: true },
          orderBy: { date: 'desc' },
          take: 3,
        },
      },
      orderBy: { name: 'asc' },
    });

    const summarizeArray = (arr: any[], mapFn: (x: any) => string, limit = 10) =>
      arr.slice(0, limit).map(mapFn).join('\n');

    const context = people
      .map((p) => {
        const weights = p.vitals
          .filter((v) => v.type.toLowerCase() === 'weight')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latestWeights = summarizeArray(weights, (v) => `- Weight: ${v.value} ${v.unit ?? ''} on ${new Date(v.date).toISOString().split('T')[0]}`, 5);
        const vaccines = p.vaccines
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const vaccineLines = summarizeArray(vaccines, (v) => `- ${v.name} on ${new Date(v.date).toISOString().split('T')[0]}${v.nextDueDate ? ` (next due ${new Date(v.nextDueDate).toISOString().split('T')[0]})` : ''}${v.notes ? ` — ${v.notes}` : ''}`, 10);
        const meds = p.medications
          .sort((a, b) => new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime());
        const medLines = summarizeArray(meds, (m) => `- ${m.name}${m.dosage ? ` (${m.dosage})` : ''}${m.frequency ? `, ${m.frequency}` : ''}${m.startDate ? ` — start ${new Date(m.startDate).toISOString().split('T')[0]}` : ''}${m.endDate ? `, end ${new Date(m.endDate).toISOString().split('T')[0]}` : ''}`, 10);
        const allergyLines = summarizeArray(p.allergies, (a) => `- ${a.name}${a.severity ? ` (${a.severity})` : ''}${a.reaction ? ` — ${a.reaction}` : ''}`, 10);
        const reminderLines = summarizeArray(p.reminders.sort((a,b)=>new Date(a.dueDate).getTime()-new Date(b.dueDate).getTime()), (r) => `- ${r.title} due ${new Date(r.dueDate).toISOString().split('T')[0]} [${r.status}]`, 10);
        const apptLines = summarizeArray(p.appointments.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()), (a) => `- ${a.title} on ${new Date(a.date).toISOString().split('T')[0]}`, 10);
        const labLines = summarizeArray(p.labResults, (lr) => `- ${new Date(lr.date).toISOString().split('T')[0]}: ${lr.testName}${lr.components && lr.components.length ? ` — components: ${lr.components.map((c:any)=>`${c.name}${c.value!=null?`=${c.value}`:''}${c.unit?c.unit:''}`).join(', ')}` : ''}`, 5);
        return `Person: ${p.name} (${p.species})
Allergies:\n${allergyLines || '- none'}
Medications:\n${medLines || '- none'}
Vaccines:\n${vaccineLines || '- none'}
Vitals (latest weights):\n${latestWeights || '- none'}
Appointments:\n${apptLines || '- none'}
Reminders:\n${reminderLines || '- none'}
Lab Results:\n${labLines || '- none'}`;
      })
      .join('\n\n');

    const systemPrompt = `You are a family health app assistant. You MUST answer ONLY using the information in the CONTEXT below. If the answer is not in CONTEXT, reply: "I don't have that information in the app." Be concise.

CONTEXT START\n${context}\nCONTEXT END`;

    const userPrompt = `Question: ${question}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', errText);
      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer: string = data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate an answer.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in /api/ask:', error);
    return NextResponse.json(
      { error: 'Something went wrong processing your request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


