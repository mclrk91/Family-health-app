import { PrismaClient, Species } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding local database...');

  // Create family members
  const marissa = await prisma.person.upsert({
    where: { id: 'marissa' },
    update: {},
    create: {
      id: 'marissa',
      name: 'Marissa',
      species: Species.HUMAN,
      dateOfBirth: new Date('1992-03-15'),
      bloodType: 'O+',
    },
  });

  const jack = await prisma.person.upsert({
    where: { id: 'jack' },
    update: {},
    create: {
      id: 'jack',
      name: 'Jack',
      species: Species.HUMAN,
      dateOfBirth: new Date('1990-08-22'),
      bloodType: 'A+',
    },
  });

  const mike = await prisma.person.upsert({
    where: { id: 'mike' },
    update: {},
    create: {
      id: 'mike',
      name: 'Mike',
      species: Species.HUMAN,
      dateOfBirth: new Date('1960-12-03'),
      bloodType: 'O-',
    },
  });

  const tonya = await prisma.person.upsert({
    where: { id: 'tonya' },
    update: {},
    create: {
      id: 'tonya',
      name: 'Tonya',
      species: Species.HUMAN,
      dateOfBirth: new Date('1960-04-18'),
      bloodType: 'B+',
    },
  });

  const brandon = await prisma.person.upsert({
    where: { id: 'brandon' },
    update: {},
    create: {
      id: 'brandon',
      name: 'Brandon',
      species: Species.HUMAN,
      dateOfBirth: new Date('1995-11-07'),
      bloodType: 'AB+',
    },
  });

  const bentley = await prisma.person.upsert({
    where: { id: 'bentley' },
    update: {},
    create: {
      id: 'bentley',
      name: 'Bentley',
      species: Species.CANINE,
      dateOfBirth: new Date('2020-05-12'),
      breed: 'English Cream Golden Retriever',
      weight: 83.9,
      weightUnit: 'lbs',
    },
  });

  // Create sample allergies
  await prisma.allergy.upsert({
    where: { id: 'allergy-1' },
    update: {},
    create: {
      id: 'allergy-1',
      name: 'Peanuts',
      severity: 'Severe',
      reaction: 'Anaphylaxis',
      personId: marissa.id,
    },
  });

  // Create sample medications
  await prisma.medication.upsert({
    where: { id: 'med-1' },
    update: {},
    create: {
      id: 'med-1',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Daily',
      startDate: new Date('2024-01-01'),
      personId: marissa.id,
    },
  });

  // Create sample vaccines
  await prisma.vaccine.upsert({
    where: { id: 'vax-1' },
    update: {},
    create: {
      id: 'vax-1',
      name: 'COVID-19 Booster',
      date: new Date('2024-01-15'),
      nextDueDate: new Date('2025-01-15'),
      personId: marissa.id,
    },
  });

  await prisma.vaccine.upsert({
    where: { id: 'vax-2' },
    update: {},
    create: {
      id: 'vax-2',
      name: 'Rabies',
      date: new Date('2024-03-01'),
      nextDueDate: new Date('2027-03-01'),
      personId: bentley.id,
    },
  });

  // Create sample vitals
  await prisma.vital.upsert({
    where: { id: 'vital-1' },
    update: {},
    create: {
      id: 'vital-1',
      type: 'weight',
      value: '135',
      unit: 'lbs',
      date: new Date('2024-08-01'),
      personId: marissa.id,
    },
  });

  await prisma.vital.upsert({
    where: { id: 'vital-2' },
    update: {},
    create: {
      id: 'vital-2',
      type: 'weight',
      value: '83.9',
      unit: 'lbs',
      date: new Date('2024-08-01'),
      personId: bentley.id,
    },
  });

  // Create sample lab results
  const labResult = await prisma.labResult.upsert({
    where: { id: 'lab-1' },
    update: {},
    create: {
      id: 'lab-1',
      testName: 'Complete Blood Count',
      date: new Date('2024-07-15'),
      notes: 'Routine checkup',
      personId: marissa.id,
    },
  });

  await prisma.labComponent.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'Hemoglobin',
      value: '14.2',
      unit: 'g/dL',
      reference: '12.0-15.5',
      labResultId: labResult.id,
    },
  });

  // Create sample reminders
  await prisma.reminder.upsert({
    where: { id: 'reminder-1' },
    update: {},
    create: {
      id: 'reminder-1',
      title: 'Annual Physical',
      description: 'Schedule annual checkup',
      dueDate: new Date('2024-12-01'),
      frequency: 'ANNUALLY',
      personId: marissa.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👥 Created family members:', { marissa, jack, mike, tonya, brandon, bentley });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
