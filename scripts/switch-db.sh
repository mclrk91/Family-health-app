#!/bin/bash

# Script to switch between local SQLite and production PostgreSQL databases

LOCAL_SCHEMA="prisma/schema.local.prisma"
PROD_SCHEMA="prisma/schema.prisma"
BACKUP_SCHEMA="prisma/schema.backup.prisma"

echo "🔄 Database Configuration Switcher"
echo "=================================="

if [ "$1" = "local" ]; then
    echo "📱 Switching to LOCAL SQLite database..."
    
    # Backup current schema
    if [ -f "$PROD_SCHEMA" ]; then
        cp "$PROD_SCHEMA" "$BACKUP_SCHEMA"
        echo "✅ Backed up current schema to $BACKUP_SCHEMA"
    fi
    
    # Copy local schema
    cp "$LOCAL_SCHEMA" "$PROD_SCHEMA"
    echo "✅ Switched to local SQLite schema"
    
    # Update environment
    echo "DATABASE_URL=\"file:./dev.db\"" > .env.local
    echo "DIRECT_URL=\"file:./dev.db\"" >> .env.local
    echo "✅ Updated .env.local for local development"
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push schema to local database
    echo "🗄️  Pushing schema to local database..."
    npx prisma db push
    
    # Seed the database
    echo "🌱 Seeding local database..."
    npx tsx prisma/seed.local.ts
    
    echo "✅ Successfully switched to LOCAL database!"
    echo "🚀 Run 'npm run dev' to start the app"
    
elif [ "$1" = "prod" ]; then
    echo "🌐 Switching to PRODUCTION PostgreSQL database..."
    
    # Restore production schema
    if [ -f "$BACKUP_SCHEMA" ]; then
        cp "$BACKUP_SCHEMA" "$PROD_SCHEMA"
        echo "✅ Restored production schema"
    else
        echo "⚠️  No backup schema found. Please restore manually."
        exit 1
    fi
    
    # Update environment
    echo "DATABASE_URL=\"postgresql://postgres:Johnnyshouse1991!@db.fpckhbiwzdgegqpwzdgegqpwuvlm.supabase.co:5432/postgres?sslmode=require\"" > .env.local
    echo "DIRECT_URL=\"postgresql://postgres:Johnnyshouse1991!@db.fpckhbiwzdgegqpwzdgegqpwuvlm.supabase.co:5432/postgres?sslmode=require\"" >> .env.local
    echo "✅ Updated .env.local for production"
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    echo "✅ Successfully switched to PRODUCTION database!"
    
elif [ "$1" = "status" ]; then
    echo "📊 Current Database Status:"
    echo "============================"
    
    if grep -q "file:./dev.db" .env.local 2>/dev/null; then
        echo "📍 Database: LOCAL (SQLite)"
        echo "🗄️  Schema: $LOCAL_SCHEMA"
    elif grep -q "postgresql://" .env.local 2>/dev/null; then
        echo "📍 Database: PRODUCTION (PostgreSQL)"
        echo "🗄️  Schema: $PROD_SCHEMA"
    else
        echo "❓ Database: UNKNOWN"
    fi
    
    echo ""
    echo "📁 Schema files:"
    ls -la prisma/schema*.prisma 2>/dev/null || echo "No schema files found"
    
else
    echo "Usage: $0 {local|prod|status}"
    echo ""
    echo "Commands:"
    echo "  local   - Switch to local SQLite database"
    echo "  prod    - Switch to production PostgreSQL database"
    echo "  status  - Show current database configuration"
    echo ""
    echo "Examples:"
    echo "  $0 local    # Switch to local development"
    echo "  $0 prod     # Switch to production"
    echo "  $0 status   # Check current status"
fi
