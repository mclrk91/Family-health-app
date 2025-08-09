import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.document.deleteMany()
  await prisma.reminder.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.vital.deleteMany()
  await prisma.labComponent.deleteMany()
  await prisma.labResult.deleteMany()
  await prisma.vaccine.deleteMany()
  await prisma.procedure.deleteMany()
  await prisma.diagnosis.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.allergy.deleteMany()
  await prisma.person.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.clinic.deleteMany()

  // Create family members in specified order
  const marissa = await prisma.person.create({
    data: {
      name: 'Marissa',
      species: 'HUMAN',
      dateOfBirth: new Date('1991-09-01'),
      bloodType: 'O+',
    },
  })

  const jack = await prisma.person.create({
    data: {
      name: 'Jack',
      species: 'HUMAN',
      dateOfBirth: new Date('1989-05-22'),
      bloodType: 'A+',
    },
  })

  const mike = await prisma.person.create({
    data: {
      name: 'Mike',
      species: 'HUMAN',
      dateOfBirth: new Date('1959-09-21'),
      bloodType: 'O-',
    },
  })

  const tonya = await prisma.person.create({
    data: {
      name: 'Tonya',
      species: 'HUMAN',
      dateOfBirth: new Date('1959-11-05'),
      bloodType: 'B+',
    },
  })

  const brandon = await prisma.person.create({
    data: {
      name: 'Brandon',
      species: 'HUMAN',
      dateOfBirth: new Date('1994-04-19'),
      bloodType: 'AB+',
    },
  })

            const bentley = await prisma.person.create({
            data: {
              name: 'Bentley',
              species: 'CANINE',
              dateOfBirth: new Date('2020-08-14'),
              breed: 'English Cream Golden Retriever',
              microchipId: '981020031240389',
              weight: 83.9,
              weightUnit: 'lbs',
            },
          })

  // Create some sample clinics
  const primaryCare = await prisma.clinic.create({
    data: {
      name: 'Primary Care Clinic',
      address: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
      email: 'info@primarycare.com',
      website: 'https://primarycare.com',
    },
  })

  const vetClinic = await prisma.clinic.create({
    data: {
      name: 'Edgewood Animal Clinic',
      address: '1708 East Edgewood Drive, Lakeland, FL 33803',
      phone: '863-688-8301',
      email: 'info@edgewoodanimalclinic.com',
      website: 'https://edgewoodanimalclinic.net',
    },
  })

  // Create some sample doctors
  const drSmith = await prisma.doctor.create({
    data: {
      name: 'Dr. Sarah Smith',
      specialty: 'Family Medicine',
      phone: '(555) 111-2222',
      email: 'dr.smith@primarycare.com',
      clinicId: primaryCare.id,
    },
  })

  const drJohnson = await prisma.doctor.create({
    data: {
      name: 'Dr. Michael Johnson',
      specialty: 'Veterinary Medicine',
      phone: '(555) 333-4444',
      email: 'dr.johnson@animalcarevet.com',
      clinicId: vetClinic.id,
    },
  })

  const drLee = await prisma.doctor.create({
    data: {
      name: 'Dr. Lee Edgewood',
      specialty: 'Veterinary Medicine',
      phone: '863-838-7929',
      email: 'dr.lee@edgewoodanimalclinic.com',
      clinicId: vetClinic.id,
    },
  })

  // Create Bentley's medical records
  const bentleyAllergy = await prisma.allergy.create({
    data: {
      name: 'Skin Allergy Post Surgery',
      severity: 'moderate',
      reaction: 'Skin irritation from cleansers',
      notes: 'Skin allergy post surgery - cleanser related. Requires special attention to cleaning products.',
      personId: bentley.id,
    },
  })

  // Create comprehensive vaccine records for Bentley
  const bentleyVaccines = await Promise.all([
    // Bordetella Vaccine
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2020-10-15'),
        nextDueDate: new Date('2021-10-15'),
        notes: 'Kennel cough prevention - initial vaccination',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2020-12-23'),
        nextDueDate: new Date('2021-12-23'),
        notes: 'Kennel cough prevention - booster',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2021-11-15'),
        nextDueDate: new Date('2022-11-15'),
        notes: 'Kennel cough prevention - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2022-11-15'),
        nextDueDate: new Date('2023-11-15'),
        notes: 'Kennel cough prevention - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2023-11-21'),
        nextDueDate: new Date('2024-11-21'),
        notes: 'Kennel cough prevention - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Bordetella Vaccine',
        date: new Date('2024-11-26'),
        nextDueDate: new Date('2025-11-26'),
        notes: 'Kennel cough prevention - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),

    // Canine Influenza Vaccine (Yearly)
    prisma.vaccine.create({
      data: {
        name: 'Canine Influenza Vaccine',
        date: new Date('2020-12-23'),
        nextDueDate: new Date('2021-12-23'),
        notes: 'Yearly vaccination - #1 of 2 initial series',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Canine Influenza Vaccine',
        date: new Date('2021-01-13'),
        nextDueDate: new Date('2022-01-13'),
        notes: 'Yearly vaccination - #2 of 2 initial series',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Canine Influenza Vaccine',
        date: new Date('2022-01-13'),
        nextDueDate: new Date('2023-01-13'),
        notes: 'Yearly vaccination - annual booster',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Canine Influenza Vaccine',
        date: new Date('2023-01-24'),
        nextDueDate: new Date('2024-01-24'),
        notes: 'Yearly vaccination - annual booster',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Canine Influenza Vaccine',
        date: new Date('2024-11-26'),
        nextDueDate: new Date('2025-11-26'),
        notes: 'Yearly vaccination - annual booster',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),

    // DA2PP Vaccine
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2020-11-23'),
        nextDueDate: new Date('2021-11-23'),
        notes: 'Core vaccination - initial',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2020-12-23'),
        nextDueDate: new Date('2021-12-23'),
        notes: 'Core vaccination - booster',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2021-11-15'),
        nextDueDate: new Date('2022-11-15'),
        notes: 'Core vaccination - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2022-11-15'),
        nextDueDate: new Date('2023-11-15'),
        notes: 'Core vaccination - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2023-11-21'),
        nextDueDate: new Date('2024-11-21'),
        notes: 'Core vaccination - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'DA2PP Vaccine',
        date: new Date('2024-11-26'),
        nextDueDate: new Date('2025-11-26'),
        notes: 'Core vaccination - annual',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),

    // Rabies Vaccine
    prisma.vaccine.create({
      data: {
        name: 'Rabies Vaccine',
        date: new Date('2020-12-23'),
        nextDueDate: new Date('2021-12-23'),
        notes: '1 Year Rabies Vaccine',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Rabies Vaccine',
        date: new Date('2021-11-15'),
        nextDueDate: new Date('2024-11-14'),
        notes: '3 Year Rabies Vaccine',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Rabies Vaccine',
        date: new Date('2024-11-26'),
        nextDueDate: new Date('2027-11-26'),
        notes: '3 Year Rabies Vaccine',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
  ])

  // Create multiple weight vitals for Bentley
  const bentleyWeightVitals = await Promise.all([
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 15.0,
        unit: 'lbs',
        date: new Date('2020-10-15'),
        notes: 'Puppy weight',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 32.6,
        unit: 'lbs',
        date: new Date('2020-11-23'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 43.0,
        unit: 'lbs',
        date: new Date('2020-12-23'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 43.0,
        unit: 'lbs',
        date: new Date('2021-01-13'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 43.0,
        unit: 'lbs',
        date: new Date('2021-06-29'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 72.0,
        unit: 'lbs',
        date: new Date('2021-07-06'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 79.0,
        unit: 'lbs',
        date: new Date('2021-11-15'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 79.8,
        unit: 'lbs',
        date: new Date('2021-12-14'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 83.2,
        unit: 'lbs',
        date: new Date('2022-01-13'),
        notes: 'Weight recorded during veterinary visit at Edgewood Animal Clinic',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 83.2,
        unit: 'lbs',
        date: new Date('2022-11-15'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 75.6,
        unit: 'lbs',
        date: new Date('2022-11-21'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 76.5,
        unit: 'lbs',
        date: new Date('2023-02-13'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 79.4,
        unit: 'lbs',
        date: new Date('2023-06-20'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 83.2,
        unit: 'lbs',
        date: new Date('2023-02-21'),
        notes: 'Growth milestone',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
    prisma.vital.create({
      data: {
        type: 'weight',
        value: 83.9,
        unit: 'lbs',
        date: new Date('2024-11-26'),
        notes: 'Current weight',
        personId: bentley.id,
        doctorId: drLee.id,
        clinicId: vetClinic.id,
      },
    }),
  ])

  const bentleyReminder1 = await prisma.reminder.create({
    data: {
      title: 'Heartworm Test',
      description: 'Annual heartworm test due',
      dueDate: new Date('2022-11-15'),
      frequency: 'ANNUALLY',
      status: 'OVERDUE',
      notes: 'Next due: 11-15-22',
      personId: bentley.id,
      doctorId: drLee.id,
      clinicId: vetClinic.id,
    },
  })

  const bentleyReminder2 = await prisma.reminder.create({
    data: {
      title: 'Wellness Exam',
      description: 'Pre-vaccination wellness exam',
      dueDate: new Date('2022-11-15'),
      frequency: 'ANNUALLY',
      status: 'OVERDUE',
      notes: 'Next due: 11-15-22',
      personId: bentley.id,
      doctorId: drLee.id,
      clinicId: vetClinic.id,
    },
  })

  const bentleyReminder3 = await prisma.reminder.create({
    data: {
      title: 'Parasite Examination',
      description: 'Annual parasite examination',
      dueDate: new Date('2022-11-15'),
      frequency: 'ANNUALLY',
      status: 'OVERDUE',
      notes: 'Next due: 11-15-22',
      personId: bentley.id,
      doctorId: drLee.id,
      clinicId: vetClinic.id,
    },
  })

  console.log('Seed data created successfully!')
  console.log('Family members:', { marissa, jack, mike, tonya, brandon, bentley })
  console.log('Clinics:', { primaryCare, vetClinic })
  console.log('Doctors:', { drSmith, drJohnson, drLee })
  console.log('Bentley medical records:', { 
    allergy: bentleyAllergy, 
    vaccines: bentleyVaccines,
    weightVitals: bentleyWeightVitals,
    reminders: [bentleyReminder1, bentleyReminder2, bentleyReminder3]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

