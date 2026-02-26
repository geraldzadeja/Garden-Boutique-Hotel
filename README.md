# Garden Boutique Hotel - Booking System

A production-ready hotel booking website built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

### Public Website
- ✅ Home page with navigation
- ✅ Rooms listing and detail pages (structure ready)
- ⏳ Booking request system (API ready, UI pending)
- ⏳ Amenities page (stub created)
- ⏳ Gallery (stub created)
- ⏳ Location page (stub created)
- ⏳ Contact form (API ready, UI pending)
- ⏳ Blog system (API ready, UI pending)

### Admin Dashboard
- ✅ Secure admin authentication (NextAuth.js)
- ✅ Dashboard layout with sidebar navigation
- ⏳ Bookings management (API ready, UI pending)
- ⏳ Rooms CRUD (API ready, UI pending)
- ⏳ Blog posts CRUD (API ready, UI pending)
- ⏳ Contact messages inbox (API ready, UI pending)

### Backend & API
- ✅ Complete REST API structure
- ✅ Prisma ORM with PostgreSQL
- ✅ Type-safe database access
- ✅ Zod validation on all endpoints
- ✅ NextAuth.js authentication
- ✅ Route protection middleware
- ✅ Email hooks (TODO stubs for future implementation)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## Project Structure

```
Garden Boutique Hotel/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── bookings/      # Booking CRUD + availability
│   │   │   ├── rooms/         # Room CRUD
│   │   │   ├── blog/          # Blog CRUD
│   │   │   └── contact/       # Contact form
│   │   ├── admin/             # Admin dashboard (protected)
│   │   ├── auth/              # Login page
│   │   ├── rooms/             # Public rooms pages
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components (to be built)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── booking-utils.ts   # Booking logic
│   │   ├── date-utils.ts      # Date helpers
│   │   ├── email.ts           # Email stubs
│   │   ├── constants.ts       # App constants
│   │   └── validators/        # Zod schemas
│   └── types/                 # TypeScript definitions
├── .env.local                 # Environment variables
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**

   Update `.env.local` with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_booking"
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Run database migrations:**
   ```bash
   npx prisma db push
   ```

5. **Seed the database:**
   ```bash
   npm run db:seed
   ```

   This creates:
   - Admin user (email: admin@gardenboutiquehotel.com, password: admin123)
   - 3 sample rooms
   - 1 sample blog post

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Default Admin Credentials

- **Email**: admin@gardenboutiquehotel.com
- **Password**: admin123

⚠️ **Change these in production!**

## Database Schema

### Models

**User** - Admin authentication
- id, email, name, passwordHash, role, timestamps

**Room** - Hotel room inventory
- id, name, slug, description, capacity, bedType, size, pricePerNight
- amenities[], images[], isActive, displayOrder, timestamps

**Booking** - Reservation requests
- id, bookingNumber, roomId, checkInDate, checkOutDate
- numberOfNights, numberOfGuests, guestName, guestEmail, guestPhone
- pricePerNight (snapshot), totalPrice, status, statusHistory
- adminNotes, timestamps

**BlogPost** - Content management
- id, title, slug, excerpt, content, coverImage, tags[]
- isPublished, publishedAt, timestamps

**ContactMessage** - Contact form submissions
- id, name, email, phone, subject, message
- isRead, respondedAt, createdAt

## API Endpoints

### Public Endpoints

**Bookings**
- `POST /api/bookings` - Create booking request
- `POST /api/bookings/check-availability` - Check room availability

**Rooms**
- `GET /api/rooms` - List all active rooms
- `GET /api/rooms/:id` - Get room details

**Blog**
- `GET /api/blog` - List published posts
- `GET /api/blog/:id` - Get post details

**Contact**
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Authentication Required)

**Bookings**
- `GET /api/bookings` - List all bookings with filters
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

**Rooms**
- `POST /api/rooms` - Create room
- `PATCH /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

**Blog**
- `POST /api/blog` - Create post
- `PATCH /api/blog/:id` - Update post
- `DELETE /api/blog/:id` - Delete post

**Contact**
- `GET /api/contact` - List all messages
- `GET /api/contact/:id` - Get message details
- `PATCH /api/contact/:id` - Mark as read

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database scripts
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create migration
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## Environment Variables

Required variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_booking"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Admin User (for seeding)
ADMIN_EMAIL="admin@gardenboutiquehotel.com"
ADMIN_PASSWORD="admin123"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Development Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Project setup
- [x] Database schema
- [x] API routes structure
- [x] Authentication
- [x] Type definitions
- [x] Validation schemas

### Phase 2: Core Features (Next Steps)
- [ ] Complete booking form UI
- [ ] Room detail pages with booking integration
- [ ] Admin bookings management UI
- [ ] Admin rooms management UI
- [ ] Availability calendar

### Phase 3: Content & Communication
- [ ] Blog listing and detail pages
- [ ] Contact form UI
- [ ] Admin blog management UI
- [ ] Admin contact inbox UI

### Phase 4: Enhancement
- [ ] Email notifications (implement email.ts stubs)
- [ ] Image upload functionality
- [ ] Advanced filtering and search
- [ ] Analytics dashboard

### Phase 5: Production
- [ ] Production database setup
- [ ] Environment configuration
- [ ] Deploy to Vercel
- [ ] SSL and domain setup

## Key Features

### Booking System Logic

**Availability Checking** ([src/lib/booking-utils.ts:6](src/lib/booking-utils.ts#L6))
- Checks for overlapping bookings
- Only PENDING and CONFIRMED bookings block availability
- Prevents double-booking

**Price Snapshot** ([prisma/schema.prisma:62](prisma/schema.prisma#L62))
- Stores price at booking time
- Historical accuracy preserved
- Room prices can change without affecting past bookings

**Booking Number Generation** ([src/lib/booking-utils.ts:58](src/lib/booking-utils.ts#L58))
- Format: BK{YY}{MM}{SEQUENCE}
- Example: BK250100001
- Unique sequential numbers per month

**Status Workflow**
- PENDING → CONFIRMED → COMPLETED
- PENDING → CANCELLED
- Status history tracked in JSON field

### Security

- ✅ Admin routes protected by middleware
- ✅ API endpoints validate sessions
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Type-safe database queries

## TODO: Email Implementation

Email sending is currently stubbed in [src/lib/email.ts](src/lib/email.ts). To implement:

1. Choose email service (Resend, SendGrid, AWS SES)
2. Add API keys to `.env.local`
3. Implement the TODO functions:
   - `sendBookingConfirmationEmail()`
   - `sendBookingStatusUpdateEmail()`
   - `sendAdminBookingNotification()`
   - `sendContactFormNotification()`

## Deployment (Vercel)

1. **Create Vercel project:**
   ```bash
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Set up production database** (Vercel Postgres recommended)

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed production data:**
   ```bash
   npm run db:seed
   ```

## Support

For issues or questions:
- Check the [implementation plan](C:\Users\User\.claude\plans\floofy-herding-pillow.md)
- Review API route files for endpoint documentation
- Check Prisma schema for data structure

## License

Private project for Garden Boutique Hotel.

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
