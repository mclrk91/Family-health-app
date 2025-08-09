import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [
      recentVaccines,
      upcomingAppointments,
      activeMedications,
      allergies,
      lastLabResult,
      lastVital,
      totalVaccines,
      overdueReminders
    ] = await Promise.all([
      // Recent vaccines (last year)
      prisma.vaccine.count({
        where: {
          personId: id,
          date: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Upcoming appointments
      prisma.appointment.count({
        where: {
          personId: id,
          date: {
            gte: new Date()
          }
        }
      }),
      // Active medications
      prisma.medication.count({
        where: {
          personId: id,
          endDate: null
        }
      }),
      // Allergies
      prisma.allergy.count({
        where: {
          personId: id
        }
      }),
      // Last lab result
      prisma.labResult.findFirst({
        where: {
          personId: id
        },
        orderBy: {
          date: 'desc'
        }
      }),
      // Last vital
      prisma.vital.findFirst({
        where: {
          personId: id
        },
        orderBy: {
          date: 'desc'
        }
      }),
      // Total vaccines
      prisma.vaccine.count({
        where: {
          personId: id
        }
      }),
      // Overdue reminders
      prisma.reminder.count({
        where: {
          personId: id,
          dueDate: {
            lt: new Date()
          },
          status: 'PENDING'
        }
      })
    ]);

    return NextResponse.json({
      recentVaccines,
      upcomingAppointments,
      activeMedications,
      allergies,
      lastLabDate: lastLabResult?.date?.toISOString(),
      lastVitalDate: lastVital?.date?.toISOString(),
      totalVaccines,
      overdueReminders
    });
  } catch (error) {
    console.error('Error fetching health summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health summary' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

