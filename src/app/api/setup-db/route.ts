export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST() {
  try {
    console.log('🔧 Setting up database schema...');
    
    const prisma = new PrismaClient();
    
    // Try to create a simple table to test connection
    const result = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Test table created successfully');
    
    // Now try to push the full schema
    const { execSync } = require('child_process');
    const output = execSync('npx prisma db push --force-reset', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Database schema updated:', output);
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed',
      output: output
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
