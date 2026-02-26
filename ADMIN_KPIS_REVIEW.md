# Admin Section KPIs - Comprehensive Review

## 1. Dashboard Page (`/admin`)

### KPI Cards:
1. **Today's Occupancy**
   - Shows: `occupied / total` rooms
   - Logic: Counts individual bookings (rooms) with status CONFIRMED or COMPLETED where checkIn ≤ today < checkOut
   - ✓ Correct: Uses individual booking count (actual rooms occupied)

2. **Today's Arrivals**
   - Shows: Number of reservations checking in today
   - Logic: Groups bookings by reservationGroupId, counts groups with checkIn = today and status CONFIRMED or PENDING
   - ✓ Correct: Uses grouped reservations

3. **Pending Reservations**
   - Shows: Number of pending reservations
   - Logic: Groups bookings by reservationGroupId, counts groups with status = PENDING
   - ✓ Correct: Uses grouped reservations

4. **Total Bookings (This Month)**
   - Shows: Number of reservations created this month
   - Logic: Groups bookings by reservationGroupId, counts groups created in current month
   - ✓ Correct: Uses grouped reservations

### Other Displays:
- **Total Revenue**: Sum of all booking prices excluding CANCELLED and NO_SHOW ✓
- **Recent Bookings Table**: Shows last 5 grouped reservations with combined room names ✓
- **Today's Bookings Cards**: Shows grouped reservations checking in today ✓
- **Revenue Chart**: Groups reservations, excludes CANCELLED and NO_SHOW ✓
- **Bookings Chart**: Counts grouped reservations per day ✓

---

## 2. Bookings Management Page (`/admin/bookings`)

### KPI Cards:
1. **Total Reservations**
   - Shows: Total number of grouped reservations
   - Logic: Groups bookings by reservationGroupId, counts groups
   - ✓ Correct: Uses grouped reservations

2. **Pending**
   - Shows: Number of pending reservations
   - Logic: Groups bookings, counts with status = PENDING
   - ✓ Correct: Uses grouped reservations

3. **Confirmed**
   - Shows: Number of confirmed reservations
   - Logic: Groups bookings, counts with status = CONFIRMED
   - ✓ Correct: Uses grouped reservations

4. **Completed**
   - Shows: Number of completed reservations
   - Logic: Groups bookings, counts with status = COMPLETED
   - ✓ Correct: Uses grouped reservations

5. **Cancelled**
   - Shows: Number of cancelled reservations
   - Logic: Groups bookings, counts with status = CANCELLED
   - ✓ Correct: Uses grouped reservations

6. **No Show**
   - Shows: Number of no-show reservations
   - Logic: Groups bookings, counts with status = NO_SHOW
   - ✓ Correct: Uses grouped reservations

### Other Displays:
- **Reservation Cards**: Show grouped reservations with all room names combined ✓
- **Status Change Buttons**: Update ALL bookings in a reservation group ✓ (FIXED)
- **Filters**: Work with grouped reservations ✓

---

## 3. Guests Page (`/admin/guests`)

### KPI Cards:
1. **Total Guests**
   - Shows: Number of unique guests (by email)
   - Logic: Counts unique guest emails
   - ✓ Correct

2. **Total Reservations**
   - Shows: Total number of grouped reservations across all guests
   - Logic: Sums up totalReservations for each guest (which counts grouped reservations)
   - ✓ Correct: Uses grouped reservations

3. **Total Revenue**
   - Shows: Total spent by all guests
   - Logic: Sums up totalSpent for each guest (which excludes CANCELLED and NO_SHOW)
   - ✓ Correct: Excludes CANCELLED and NO_SHOW

### Guest Table:
- **Total Reservations Column**: Shows grouped reservation count per guest ✓
- **Total Spent Column**: Excludes CANCELLED and NO_SHOW ✓

### Guest Details Modal:
- **Total Reservations**: Shows grouped reservation count ✓
- **Total Spent**: Excludes CANCELLED and NO_SHOW ✓
- **Reservation History**: Shows grouped reservations with all rooms combined ✓

---

## 4. Rooms Management Page (`/admin/rooms`)

### KPI Cards:
1. **Total Room Units**
   - Shows: Sum of all room units across all room types
   - Logic: Sums totalUnits for all rooms
   - ✓ Correct: Shows actual physical room count (10 rooms)

2. **Room Types**
   - Shows: Number of different room types
   - Logic: Counts number of room records
   - ✓ Correct: Shows 4 room types

3. **Active Units**
   - Shows: Sum of units for active room types
   - Logic: Sums totalUnits for rooms where isActive = true
   - ✓ Correct: Shows how many rooms are available for booking (FIXED - was showing count of active types, now shows count of active units)

4. **Avg. Price**
   - Shows: Average price per night across all room types
   - Logic: Sum of all pricePerNight / number of room types
   - ✓ Correct

---

## Critical Fixes Applied:

1. **✓ Fixed Rooms KPIs**: Changed from confusing "Active" (count of types) to clear "Room Types", "Total Room Units", and "Active Units"

2. **✓ Fixed Status Change Bug**: Card buttons now update ALL bookings in a reservation group (not just the first one)

3. **✓ Fixed Data Inconsistency**: Created script to synchronize booking statuses within reservation groups

4. **✓ Fixed Calendar Availability Timezone Bug**: Changed date parsing from local time to UTC in availability API
   - Changed from: `const date = new Date(dateStr); date.setUTCHours(0, 0, 0, 0);`
   - To: `const date = new Date(dateStr + 'T00:00:00.000Z');`
   - Fixed in 4 locations in [route.ts](src/app/api/rooms/availability/route.ts)
   - Calendar now correctly reflects booked rooms in real-time

5. **✓ Fixed Dashboard Timezone Bug**: Fixed "Today's Arrivals" KPI showing 0 due to timezone mismatch
   - Changed from: `today.setHours(0, 0, 0, 0)` (local time)
   - To: `new Date(todayStr + 'T00:00:00.000Z')` (UTC midnight)
   - Fixed in [page.tsx](src/app/admin/page.tsx)
   - Today's Arrivals KPI now correctly counts arrivals

6. **✓ Fixed Calendar Plus/Minus Controls**: Plus/minus buttons now properly adjust available units relative to occupied units
   - Display changed to show `actuallyAvailable` instead of `availableUnits`
   - Buttons now correctly account for occupied units
   - Fixed in [AvailabilityCalendar.tsx](src/components/admin/AvailabilityCalendar.tsx)

7. **✓ All Revenue Calculations**: Verified to exclude CANCELLED and NO_SHOW across all pages

8. **✓ All Counts**: Verified to use grouped reservations (not individual bookings) where appropriate

---

## Consistency Rules:

### When to Count Individual Bookings:
- Today's Occupancy (actual physical rooms occupied)
- Any metric about physical room usage

### When to Count Grouped Reservations:
- All reservation-related metrics
- Pending/Confirmed/Completed/Cancelled/No-Show counts
- Guest booking history
- Charts and statistics

### Revenue Calculations:
- ALWAYS exclude CANCELLED and NO_SHOW
- Sum individual booking prices (not grouped prices, since groups already sum their bookings)

### Status Management:
- ALL bookings in a reservation group MUST have the same status
- Status changes MUST update all bookings in the group simultaneously

### Date Handling:
- ALWAYS use UTC midnight for date comparisons: `new Date(dateStr + 'T00:00:00.000Z')`
- NEVER use local time for midnight: `setHours(0, 0, 0, 0)` causes timezone bugs
- This ensures dates match exactly with database dates stored at UTC midnight

---

## Utility Scripts Created:

1. **[scripts/fix-booking-statuses.ts](scripts/fix-booking-statuses.ts)**
   - Detects and fixes inconsistent booking statuses within reservation groups
   - Synchronizes all bookings in a group to the most advanced status
   - Run periodically to maintain data integrity

2. **[scripts/check-availability.ts](scripts/check-availability.ts)**
   - Tests availability calculation logic
   - Debugging tool for timezone and date handling issues
   - Shows occupied vs available units for all room types

3. **[scripts/check-bookings.ts](scripts/check-bookings.ts)**
   - Quick overview of booking counts by status
   - Shows total grouped reservations
   - Useful for data verification

4. **[scripts/clear-bookings.ts](scripts/clear-bookings.ts)**
   - Clears all bookings from database
   - Use for testing or resetting system
