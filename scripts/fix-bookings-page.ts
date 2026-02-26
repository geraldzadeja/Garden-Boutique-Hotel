import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'src', 'app', 'admin', 'bookings', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all instances in the card rendering section
content = content.replace(/filteredBookings\.map\(\(booking\)/g, 'filteredReservations.map((reservation)');
content = content.replace(/key={booking\.id}/g, 'key={reservation.id}');
content = content.replace(/booking\.guestName/g, 'reservation.guestName');
content = content.replace(/booking\.status/g, 'reservation.status');
content = content.replace(/booking\.bookingNumber/g, 'reservation.bookings[0].bookingNumber');
content = content.replace(/booking\.guestEmail/g, 'reservation.guestEmail');
content = content.replace(/booking\.guestPhone/g, 'reservation.guestPhone');
content = content.replace(/booking\.room\.name/g, 'reservation.bookings.map(b => b.room.name).join(", ")');
content = content.replace(/booking\.checkInDate/g, 'reservation.checkInDate');
content = content.replace(/booking\.checkOutDate/g, 'reservation.checkOutDate');
content = content.replace(/booking\.numberOfNights/g, 'reservation.numberOfNights');
content = content.replace(/booking\.numberOfGuests/g, 'reservation.numberOfGuests');
content = content.replace(/booking\.totalPrice/g, 'reservation.totalPrice');
content = content.replace(/setSelectedBooking\(booking\)/g, 'setSelectedReservation(reservation)');
content = content.replace(/handleStatusChange\(booking\.id/g, 'handleStatusChange(reservation.bookings[0].id');

// Replace selectedBooking with selectedReservation in modal
content = content.replace(/selectedBooking &&/g, 'selectedReservation &&');
content = content.replace(/selectedBooking\./g, 'selectedReservation.');
content = content.replace(/selectedBooking\.room\.name/g, 'selectedReservation.bookings.map(b => b.room.name).join(", ")');
content = content.replace(/selectedBooking\.bookingNumber/g, 'selectedReservation.bookings[0].bookingNumber');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Fixed bookings page successfully');
