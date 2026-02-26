# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database

You need PostgreSQL running. Choose one:

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL if needed
# Create database: hotel_booking
# Update .env.local with your connection string
```

**Option B: Free Cloud Database (Recommended)**

Use [Neon](https://neon.tech) or [Supabase](https://supabase.com):

1. Create free account
2. Create new project
3. Copy connection string
4. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```

### Step 3: Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Test the Application

**Visit**: http://localhost:3000

**Admin Login**:
- Email: `admin@gardenboutiquehotel.com`
- Password: `admin123`
- URL: http://localhost:3000/auth/signin

## ✅ Verify Installation

### Check Database
```bash
npx prisma studio
```
Should show:
- 1 user (admin)
- 3 rooms
- 1 blog post

### Check API
Visit in browser or use curl:
```bash
# Get rooms (public)
curl http://localhost:3000/api/rooms

# Get blog posts (public)
curl http://localhost:3000/api/blog
```

### Check Admin Access
1. Go to http://localhost:3000/auth/signin
2. Login with credentials above
3. Should redirect to /admin dashboard
4. Sidebar should show: Dashboard, Bookings, Rooms, Blog Posts, Contact Messages

## 📝 What's Working Right Now

### ✅ Fully Functional
- **Admin Authentication** - Login/logout works
- **All API Endpoints** - 10+ routes ready
- **Database** - Complete schema with sample data
- **Type Safety** - Full TypeScript coverage
- **Validation** - Zod schemas on all inputs

### 🚧 Needs UI Development
- Booking form
- Rooms listing/detail
- Admin CRUD interfaces
- Blog pages
- Contact form

## 🔧 Common Issues

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- Ensure database exists
- Check firewall/network

### Prisma Client Not Found
```bash
npx prisma generate
```

### Module Not Found Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Development Steps

### 1. Build Booking Form (Most Important)
Create: `src/app/booking/page.tsx`
- Date range picker
- Room selection
- Guest details form
- Connects to POST /api/bookings

### 2. Implement Rooms Listing
Update: `src/app/rooms/page.tsx`
- Fetch from GET /api/rooms
- Display room cards
- Link to room details

### 3. Complete Admin Bookings
Update: `src/app/admin/bookings/page.tsx`
- Fetch from GET /api/bookings
- Display table with filters
- Status update buttons
- Connects to PATCH /api/bookings/[id]

## 🎯 Recommended Development Order

1. **Week 1**: Booking system
   - Booking form UI
   - Date picker integration
   - Room selection flow
   - Confirmation page

2. **Week 2**: Rooms & Admin
   - Rooms listing page
   - Room detail pages
   - Admin bookings management
   - Admin rooms CRUD

3. **Week 3**: Content & Contact
   - Blog listing/detail
   - Contact form
   - Admin blog management
   - Admin contact inbox

4. **Week 4**: Polish & Deploy
   - Email integration
   - Error handling
   - Responsive design
   - Production deployment

## 💻 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:push         # Push schema changes
npm run db:seed         # Re-seed database
npm run db:studio       # Open Prisma Studio GUI

# Code Quality
npm run lint            # Run ESLint
npx prisma format       # Format schema file
npx prisma validate     # Validate schema
```

## 📖 File Locations

**Config**: `.env.local`, `next.config.ts`, `tailwind.config.ts`
**Database**: `prisma/schema.prisma`, `prisma/seed.ts`
**API**: `src/app/api/**/*.ts`
**Pages**: `src/app/**/page.tsx`
**Types**: `src/types/*.ts`
**Utils**: `src/lib/*.ts`
**Validators**: `src/lib/validators/*.ts`

## 🆘 Getting Help

1. Check README.md for full documentation
2. Review PROJECT_STATUS.md for current state
3. Look at implementation plan
4. Examine API route files for usage examples

## 🎉 You're All Set!

Your backend is 100% complete and ready.
Start building UI components and connect them to the API endpoints.

**Happy coding! 🚀**
