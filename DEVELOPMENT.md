# Family Health App - Development Guide

## Current Status ✅

The Family Health App is now running with a **local SQLite database** for development. This resolves the previous PostgreSQL connection issues and allows you to work on the app locally.

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### 2. Database Management

#### Switch to Local Database (Current)
```bash
npm run db:local
```
- Uses SQLite database (`./dev.db`)
- Includes sample data for 6 family members
- Perfect for development and testing

#### Switch to Production Database
```bash
npm run db:prod
```
- Uses PostgreSQL (Supabase)
- Requires working database connection
- Use when ready to deploy

#### Check Database Status
```bash
npm run db:status
```

### 3. Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## 🏗️ Current Features

### ✅ Working
- **Family Member Grid**: Beautiful card-based interface
- **Individual Family Pages**: Detailed health information tabs
- **Health Dashboard**: Overview statistics and metrics
- **AI Q&A System**: Ask health-related questions
- **Admin Panel**: System management (`/admin` with password: `admin123`)
- **Responsive Design**: Mobile-first interface
- **Local Database**: SQLite with sample data

### 🔧 Components
- `SimpleFamilyGrid`: Main family member selection
- `SimpleFamilyMemberPage`: Individual member details
- `HealthDashboard`: Family health overview
- `QuestionAnswerBox`: AI-powered health Q&A
- `Header`: Navigation component

### 📊 Sample Data
The local database includes:
- **5 Humans**: Marissa, Jack, Mike, Tonya, Brandon
- **1 Canine**: Bentley (Golden Retriever)
- Sample allergies, medications, vaccines, vitals, and lab results

## 🐛 Known Issues & Solutions

### 1. Database Connection
- **Issue**: PostgreSQL connection failing
- **Solution**: Using local SQLite for development
- **Fix**: Update `.env` file when ready for production

### 2. Image Paths
- **Issue**: Case sensitivity in image filenames
- **Solution**: Fixed image paths in components
- **Status**: ✅ Resolved

### 3. Environment Variables
- **Issue**: Malformed `.env` file
- **Solution**: Use `npm run db:local` to set up local environment
- **Status**: ✅ Resolved

## 🚧 Development Workflow

### 1. Making Changes
1. Edit components in `src/components/`
2. Update API routes in `src/app/api/`
3. Modify database schema in `prisma/schema.prisma`
4. Test changes locally

### 2. Database Changes
1. Update schema in `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Update seed data if needed
4. Test with `npm run db:studio`

### 3. Adding New Features
1. Create component in `src/components/`
2. Add API endpoint if needed
3. Update routing in `src/app/`
4. Test thoroughly

## 🔐 Environment Setup

### Required Variables
```bash
# Database
DATABASE_URL="file:./dev.db"  # Local development
DIRECT_URL="file:./dev.db"    # Local development

# OpenAI (for AI Q&A)
OPENAI_API_KEY="your-openai-key"

# Admin
ADMIN_TOKEN="admin123"
```

### Optional Variables
```bash
# Production database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase (for production)
SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE="..."
SUPABASE_STORAGE_BUCKET="documents"
```

## 📱 Testing

### Manual Testing
1. **Home Page**: Check family grid and health dashboard
2. **Family Pages**: Navigate to individual member pages
3. **AI Q&A**: Test health-related questions
4. **Admin Panel**: Access `/admin` with password `admin123`
5. **Responsiveness**: Test on mobile and desktop

### Database Testing
1. **Prisma Studio**: `npm run db:studio`
2. **Sample Queries**: Test API endpoints
3. **Data Integrity**: Verify sample data is loaded

## 🚀 Next Steps

### Immediate Improvements
- [ ] Add form validation to health inputs
- [ ] Implement real-time notifications
- [ ] Add search functionality
- [ ] Improve mobile navigation

### Future Features
- [ ] Document upload system
- [ ] Calendar integration
- [ ] Health reminders
- [ ] Family sharing
- [ ] Mobile app

### Production Readiness
- [ ] Fix PostgreSQL connection
- [ ] Add proper authentication
- [ ] Implement security measures
- [ ] Add error logging
- [ ] Performance optimization

## 🆘 Troubleshooting

### Common Issues

#### App Won't Start
```bash
# Check if database is set up
npm run db:status

# Reset to local database
npm run db:local

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Database Errors
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database
rm prisma/dev.db
npm run db:local
```

#### Build Errors
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📞 Support

For development issues:
1. Check this guide first
2. Review console errors
3. Check database status
4. Verify environment variables

The app is now fully functional for local development! 🎉
