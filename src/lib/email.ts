import { Booking, Room } from '@prisma/client';

type BookingWithRoom = Booking & { room: Room };

export async function sendBookingConfirmationEmail(
  booking: BookingWithRoom
): Promise<void> {
  // TODO: Implement email sending
  // - Use service like Resend, SendGrid, or AWS SES
  // - Template: Booking confirmation with details
  // - Include: booking number, dates, room, guest info, total price
  console.log('TODO: Send booking confirmation email to', booking.guestEmail);
}

export async function sendBookingStatusUpdateEmail(
  booking: BookingWithRoom,
  newStatus: string
): Promise<void> {
  // TODO: Implement email sending
  // - Notify guest of status change
  // - Different templates for confirmed/cancelled/completed
  console.log(
    'TODO: Send status update email to',
    booking.guestEmail,
    newStatus
  );
}

export async function sendAdminBookingNotification(
  booking: BookingWithRoom
): Promise<void> {
  // TODO: Implement email sending
  // - Notify admin of new booking
  // - Include guest details and booking summary
  console.log(
    'TODO: Send admin notification for booking',
    booking.bookingNumber
  );
}

export async function sendContactFormNotification(contactMessage: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<void> {
  // TODO: Implement email sending
  // - Notify admin of new contact message
  console.log('TODO: Send contact form notification');
}
