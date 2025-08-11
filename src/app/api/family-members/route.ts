export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Attempting to fetch family members...');
    console.log('📡 Database URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');
    
    // For now, return mock data to prevent crashes
    // TODO: Set up proper database migrations
    const mockFamilyMembers = [
      {
        id: 'marissa',
        name: 'Marissa',
        species: 'HUMAN',
        dateOfBirth: new Date('1991-09-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'jack',
        name: 'Jack',
        species: 'HUMAN',
        dateOfBirth: new Date('1989-05-22'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mike',
        name: 'Mike',
        species: 'HUMAN',
        dateOfBirth: new Date('1959-09-21'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tonya',
        name: 'Tonya',
        species: 'HUMAN',
        dateOfBirth: new Date('1959-11-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'brandon',
        name: 'Brandon',
        species: 'HUMAN',
        dateOfBirth: new Date('1994-04-19'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bentley',
        name: 'Bentley',
        species: 'CANINE',
        dateOfBirth: new Date('2020-11-23'),
        breed: 'English Cream Golden Retriever',
        microchipId: '985141009123456',
        weight: 83.9,
        weightUnit: 'lbs',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    console.log('✅ Successfully fetched', mockFamilyMembers.length, 'family members (mock data)');
    return NextResponse.json(mockFamilyMembers);
    
  } catch (error) {
    console.error('❌ Error in family members API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch family members',
      message: 'API error occurred'
    }, { status: 500 });
  }
}
