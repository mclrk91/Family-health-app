# Family Health App

A comprehensive health management application for families, built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

### 🏥 Family Health Management
- **Family Member Hub**: Beautiful card-based interface to select and manage family members
- **Health Tabs**: Comprehensive health information organized into tabs:
  - **Summary**: Overview of health metrics and recent activity
  - **Lab Results**: Blood work, tests, and medical results
  - **Vaccines**: Vaccination history and upcoming due dates
  - **Medications**: Current and past medications
  - **Allergies**: Known allergies and reactions
  - **Vitals**: Blood pressure, heart rate, temperature, weight
  - **Documents**: Medical documents and records

### 🐕 Multi-Species Support
- Support for both human and canine family members
- Species-specific fields (breed, microchip ID for pets)
- Tailored health tracking for different species

### 📱 Mobile-First Design
- Responsive design that works on all devices
- Touch-friendly interface
- Mobile navigation with hamburger menu

### 🔐 Admin System
- Secure admin dashboard
- System status monitoring
- Family member management
- Document management

### 📄 Document Management
- Drag-and-drop file upload
- Support for PDF, images, and text documents
- File size display and progress tracking
- Document organization by family member

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family-health-app
   ```

2. **Install dependencies**
   ```bash
  npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses a comprehensive Prisma schema with the following main models:

- **Person**: Family members (humans and pets)
- **Doctor**: Healthcare providers
- **Clinic**: Medical facilities
- **Allergy**: Known allergies
- **Medication**: Current and past medications
- **Diagnosis**: Medical diagnoses
- **Procedure**: Medical procedures
- **Vaccine**: Vaccination records
- **LabResult**: Laboratory test results
- **Vital**: Vital signs
- **Document**: Medical documents
- **Appointment**: Scheduled appointments
- **Reminder**: Health reminders

## Sample Data

The application comes pre-seeded with 6 family members:

### Humans
- **Marissa** (1991) - Female, O+ blood type
- **Jack** (1990) - Male, A+ blood type
- **Tonya** (1965) - Female, B+ blood type
- **Mike** (1960) - Male, O- blood type
- **Brandon** (1985) - Male, AB+ blood type

### Canine
- **Bentley** (2020) - English Cream Golden Retriever, 75 lbs

## Admin Access

To access the admin dashboard:

1. Navigate to `/admin`
2. Use the password: `admin123`

**Note**: This is a simple authentication system for development. In production, implement proper authentication and authorization.

## API Routes

The application includes comprehensive API routes:

- `GET /api/family-members` - List all family members
- `GET /api/family-members/[id]` - Get specific family member
- `GET /api/health-summary/[id]` - Get health summary
- `GET /api/lab-results/[id]` - Get lab results
- `GET /api/vaccines/[id]` - Get vaccines
- `GET /api/medications/[id]` - Get medications
- `GET /api/allergies/[id]` - Get allergies
- `GET /api/vitals/[id]` - Get vitals
- `GET /api/documents/[id]` - Get documents

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed the database

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── family/            # Family member pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
└── lib/                  # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.
