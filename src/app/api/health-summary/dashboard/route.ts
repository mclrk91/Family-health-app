import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get total family members
    const totalMembers = await prisma.person.count();
    const humans = await prisma.person.count({ where: { species: 'HUMAN' } });
    const pets = await prisma.person.count({ where: { species: 'CANINE' } });

    // Get upcoming appointments (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: new Date(),
          lte: thirtyDaysFromNow,
        },
      },
    });

    // Get overdue reminders
    const overdueReminders = await prisma.reminder.count({
      where: {
        dueDate: {
          lt: new Date(),
        },
        status: 'PENDING',
      },
    });

    // Get recent vaccines (this month)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const recentVaccines = await prisma.vaccine.count({
      where: {
        date: {
          gte: thisMonth,
        },
      },
    });

    // Get active medications
    const activeMedications = await prisma.medication.count({
      where: {
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });

    const stats = {
      totalMembers,
      humans,
      pets,
      upcomingAppointments,
      overdueReminders,
      recentVaccines,
      activeMedications,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching health dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
