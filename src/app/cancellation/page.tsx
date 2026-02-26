'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Header */}
      <section className="mt-[90px] py-16 md:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">Legal</p>
          <h1 className="text-[40px] md:text-[52px] leading-[1] font-serif text-white">
            Cancellation Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-[14px] text-gray-400 mb-10 font-light">
            Last updated: February 2026
          </p>

          <div className="space-y-10">
            {/* Introduction */}
            <div>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                We understand that plans can change. Our cancellation policy is designed to be fair and transparent while allowing us to maintain the quality of service our guests expect. Please review the following terms carefully when making your reservation.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">1. Standard Cancellation</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                For standard room bookings, the following cancellation terms apply:
              </p>
              <div className="bg-[#fafafa] rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#873260] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[15px] text-[#111111] font-medium mb-1">More than 7 days before arrival</p>
                    <p className="text-[14px] text-[#32373c] font-light">Full refund. No cancellation fee applies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#873260] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[15px] text-[#111111] font-medium mb-1">3 to 7 days before arrival</p>
                    <p className="text-[14px] text-[#32373c] font-light">50% of the total booking amount will be charged.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#873260] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[15px] text-[#111111] font-medium mb-1">Less than 3 days before arrival</p>
                    <p className="text-[14px] text-[#32373c] font-light">100% of the total booking amount will be charged.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#873260] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[15px] text-[#111111] font-medium mb-1">No-show</p>
                    <p className="text-[14px] text-[#32373c] font-light">Full charge applies. No refund will be issued.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">2. Non-Refundable Rates</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Bookings made under non-refundable or promotional rates are fully prepaid and cannot be cancelled, amended, or refunded. These rates are clearly marked at the time of booking. If you are unsure whether your rate is refundable, please check your confirmation email or contact us directly.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">3. Group Bookings</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Reservations for 3 or more rooms are considered group bookings and are subject to separate cancellation terms. Group cancellations must be made at least 14 days prior to the arrival date. Cancellations within 14 days may incur charges of up to 100% of the total booking value. Please contact our reservations team for group-specific terms.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">4. Modifications</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Changes to your reservation, such as altering dates or room type, are subject to availability and may result in a rate adjustment. Modifications to non-refundable bookings are not permitted. We recommend contacting us as early as possible if you need to make changes to your booking.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">5. Early Departure</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                If you choose to check out before the end of your reserved stay, the remaining nights will be charged at the full rate. No refund will be provided for unused nights. We kindly ask that you notify the front desk as early as possible if your plans change during your stay.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">6. Force Majeure</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                In the event of extraordinary circumstances beyond our control — including natural disasters, government restrictions, pandemics, or severe weather — Garden Boutique Hotel will offer guests the option to reschedule their stay or receive a full credit for future use. Refunds in force majeure situations will be assessed on a case-by-case basis.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">7. Refund Processing</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Approved refunds are processed at the hotel reception. If you have already made a payment at check-in, please visit the reception desk to arrange your refund in person. Refunds are typically processed within 5 to 10 business days.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">8. How to Cancel</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                To cancel or modify your reservation, please use one of the following methods:
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li>Email us at <a href="mailto:boutiquehotelgarden@gmail.com" className="text-[#873260] hover:underline">boutiquehotelgarden@gmail.com</a> with your booking reference number.</li>
                <li>Call us directly at +355 69 966 2622 during reception hours (07:00 – 23:00).</li>
              </ul>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mt-4">
                Please include your full name and booking confirmation number in all cancellation requests.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">Need Assistance?</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Our team is here to help. If you have any questions about our cancellation policy, please reach out to us at{' '}
                <a href="mailto:boutiquehotelgarden@gmail.com" className="text-[#873260] hover:underline">
                  boutiquehotelgarden@gmail.com
                </a>{' '}
                and we will be happy to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
