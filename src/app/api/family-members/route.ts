export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // ← relative import, no alias issues on Vercel

export async function GET() {
  try {
    console.log('🔍 Attempting to fetch family members...');
    console.log('📡 Database URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
    
    const familyMembers = await prisma.person.findMany({
      orderBy: { name: 'asc' },
    });
    
    console.log('✅ Successfully fetched', familyMembers.length, 'family members');
    return NextResponse.json(familyMembers);
  } catch (error) {
    console.error('❌ Error fetching family members:', error);
    console.error('🔧 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'NOT SET'
      }
    });
    return NextResponse.json({ error: 'Failed to fetch family members' }, { status: 500 });
  }
}
