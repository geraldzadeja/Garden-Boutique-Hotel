'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Header */}
      <section className="mt-[70px] sm:mt-[90px] py-16 md:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-4 font-medium">Legal</p>
          <h1 className="text-[40px] md:text-[52px] leading-[1] font-serif text-white">
            Privacy Policy
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
                At Garden Boutique Hotel, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website, make a reservation, or stay with us.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">1. Information We Collect</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                We may collect the following types of personal information:
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li><strong className="font-medium">Identity Information:</strong> Full name, date of birth, nationality, and passport or ID details provided at check-in.</li>
                <li><strong className="font-medium">Contact Information:</strong> Email address, phone number, and postal address.</li>
                <li><strong className="font-medium">Booking Information:</strong> Dates of stay, room preferences, special requests, and payment details.</li>
                <li><strong className="font-medium">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring sources.</li>
                <li><strong className="font-medium">Communication Data:</strong> Any correspondence between you and the hotel, including emails, feedback, and enquiries.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">2. How We Use Your Information</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                We use the information collected for the following purposes:
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li>Processing and managing your reservations.</li>
                <li>Communicating with you about your booking, including confirmations and reminders.</li>
                <li>Personalising your stay and fulfilling special requests.</li>
                <li>Sending promotional offers and newsletters, where you have opted in.</li>
                <li>Improving our website, services, and guest experience.</li>
                <li>Complying with legal obligations and local regulations.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">3. Legal Basis for Processing</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                We process your personal data based on one or more of the following legal grounds: performance of a contract (when you make a reservation), your consent (for marketing communications), compliance with legal obligations (identity verification under Albanian law), and our legitimate interests (improving services and ensuring security).
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">4. Data Sharing</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                We do not sell your personal information. We may share your data with trusted third parties only in the following circumstances:
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li><strong className="font-medium">Booking Management:</strong> To manage and confirm your reservation details.</li>
                <li><strong className="font-medium">Legal Authorities:</strong> When required by Albanian law or regulation, such as guest registration with local police.</li>
                <li><strong className="font-medium">Service Providers:</strong> Third-party vendors who assist in website hosting, email delivery, and analytics, bound by confidentiality agreements.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">5. Cookies & Tracking</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and personalise content. You can manage your cookie preferences through your browser settings. Essential cookies required for the functioning of the website cannot be disabled.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">6. Data Retention</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Booking records are retained for a minimum of 5 years in accordance with Albanian fiscal and hospitality regulations. You may request deletion of your data at any time, subject to legal retention requirements.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">7. Data Security</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. This includes encrypted data transmission (SSL/TLS), secure server infrastructure, and restricted access to personal information on a need-to-know basis.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">8. Your Rights</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mb-4">
                Under applicable data protection laws, you have the following rights:
              </p>
              <ul className="space-y-3 text-[15px] text-[#32373c] leading-[1.8] font-light list-disc pl-5">
                <li><strong className="font-medium">Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="font-medium">Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="font-medium">Erasure:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                <li><strong className="font-medium">Restriction:</strong> Request that we limit the processing of your data.</li>
                <li><strong className="font-medium">Portability:</strong> Request your data in a structured, machine-readable format.</li>
                <li><strong className="font-medium">Objection:</strong> Object to the processing of your data for marketing purposes.</li>
              </ul>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light mt-4">
                To exercise any of these rights, please contact us using the details below.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">9. Third-Party Links</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                Our website may contain links to external websites such as social media platforms and travel review sites. We are not responsible for the privacy practices or content of these third-party websites. We encourage you to review their privacy policies before sharing any personal information.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">10. Changes to This Policy</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
              </p>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-[24px] font-serif text-[#111111] mb-4">Contact Us</h2>
              <p className="text-[15px] text-[#32373c] leading-[1.8] font-light">
                If you have questions or concerns about this Privacy Policy or wish to exercise your data rights, please contact us at{' '}
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
