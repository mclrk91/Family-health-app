import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // For now, we'll return mock data since we don't have a test_results table
    // In a real application, you would query the actual test_results table
    const mockTestResults = [
      {
        id: '1',
        type: 'Blood Test',
        value: 120,
        unit: 'mg/dL',
        date: new Date().toISOString(),
        notes: 'Routine blood work - all values within normal range',
        status: 'normal'
      },
      {
        id: '2',
        type: 'X-Ray',
        value: 0,
        unit: '',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Chest X-ray - no abnormalities detected',
        status: 'normal'
      }
    ];

    return NextResponse.json(mockTestResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


