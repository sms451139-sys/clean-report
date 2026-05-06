#!/bin/bash

echo "🔧 Setting up PostgreSQL for CleanReport..."

# Create PostgreSQL user and database
createuser clean_report_user || true
createdb -O clean_report_user clean_report || true

# Set password for the user
psql -U postgres -c "ALTER USER clean_report_user WITH PASSWORD 'clean_report_password';" || true

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm run prisma:migrate -- --name init"
echo "3. npm run dev"
echo ""
echo "In another terminal:"
echo "1. cd frontend"
echo "2. npm run dev"
