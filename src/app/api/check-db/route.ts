export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    console.log('🔍 Checking database tables...');
    
    const prisma = new PrismaClient();
    
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Found tables:', tables);
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true, 
      tables: tables,
      message: 'Database tables checked successfully'
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
