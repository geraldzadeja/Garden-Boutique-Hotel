'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Header */}
      <section className="mt-[90px] py-16 md:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">Legal</p>
          <h1 className="text-[40px] md:text-[52px] leading-[1] font-serif text-white">
            Terms & Conditions
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
            {/* Section 1 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">1. General</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                These Terms and Conditions govern your use of the Garden Boutique Hotel website and all reservations made through our platform. By accessing this website or making a booking, you agree to be bound by these terms in their entirety. Garden Boutique Hotel reserves the right to update these terms at any time without prior notice. Continued use of the website constitutes acceptance of any changes.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">2. Reservations & Booking</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                All reservations are subject to availability and confirmation by Garden Boutique Hotel. A booking is considered confirmed only after you receive a written confirmation via email. We reserve the right to decline any reservation at our discretion.
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li>Guests must be at least 18 years of age to make a reservation.</li>
                <li>A valid ID document is required upon check-in to confirm your booking.</li>
                <li>Room rates are quoted in EUR and are inclusive of applicable taxes unless otherwise stated.</li>
                <li>Special requests (early check-in, late check-out, extra bedding) are subject to availability and cannot be guaranteed.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">3. Check-In & Check-Out</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Standard check-in time is from 14:00 onwards and check-out time is by 11:00. Early check-in and late check-out may be arranged upon request and are subject to availability and additional charges. Guests are required to present a valid photo ID or passport upon check-in. The lead guest name must match the name on the reservation.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">4. Payment</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Payment is accepted in cash at the hotel reception upon check-in. Full payment is due at check-in. Any outstanding balance must be settled at check-out. No online or card payments are required to secure your booking.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">5. Guest Conduct</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Guests are expected to conduct themselves in a respectful manner and to comply with all hotel policies. Garden Boutique Hotel reserves the right to refuse service or remove any guest whose behaviour is deemed disruptive, offensive, or in violation of these terms. Quiet hours are observed from 22:00 to 07:00. Smoking is strictly prohibited in all indoor areas of the hotel.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">6. Damages & Liability</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Guests are responsible for any damage caused to hotel property during their stay. The cost of repair or replacement will be charged to the guest&apos;s account. Garden Boutique Hotel is not liable for the loss, theft, or damage of personal belongings. We recommend that guests use the in-room safe for valuables and arrange appropriate travel insurance.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">7. Children & Extra Guests</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Children of all ages are welcome at Garden Boutique Hotel. Children under 2 years stay free of charge when using existing bedding. Extra beds and cots are available upon request and may incur an additional charge. The maximum occupancy of each room must be respected as stated in the room description.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">8. Pets</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Pets are not permitted at Garden Boutique Hotel, with the exception of certified service animals. If you require accommodation for a service animal, please notify us at the time of booking so that appropriate arrangements can be made.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">9. Force Majeure</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Garden Boutique Hotel shall not be held liable for any failure to perform its obligations due to circumstances beyond its reasonable control, including but not limited to natural disasters, acts of government, pandemics, civil unrest, or severe weather conditions. In such events, we will work with affected guests to reschedule or refund their bookings.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">10. Governing Law</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Albania. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Elbasan, Albania.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">Questions?</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                If you have any questions about these terms, please contact us at{' '}
                <a href="mailto:boutiquehotelgarden@gmail.com" className="text-[#873260] hover:underline">
                  boutiquehotelgarden@gmail.com
                </a>{' '}
                or call us at +355 69 966 2622.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
