'use client';

import { useState } from 'react';


import Navigation from '@/components/Navigation';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="solid" />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center mt-[90px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-white/70 text-[11px] tracking-[0.4em] uppercase mb-6 font-medium">Get In Touch</p>
          <h1 className="text-[56px] md:text-[72px] leading-[0.95] font-serif mb-8 text-white">
            Contact Us
          </h1>
          <p className="text-[18px] text-white/70 max-w-2xl mx-auto leading-[1.7] font-light">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <p className="text-[#873260] text-[11px] tracking-[0.4em] uppercase mb-4 font-medium">Information</p>
              <h2 className="text-[32px] md:text-[40px] leading-[1.2] font-serif mb-8 text-[#111111]">
                How to Reach Us
              </h2>
              <p className="text-[17px] text-[#32373c] leading-[1.8] font-light mb-10">
                Whether you have questions about our rooms, need help with a reservation, or just want to say hello, our team is ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Address</p>
                    <p className="text-[#32373c] text-[15px] font-light">Parku Rinia, Elbasan, Albania</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Phone</p>
                    <p className="text-[#32373c] text-[15px] font-light">+355 69 966 2622</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Email</p>
                    <p className="text-[#32373c] text-[15px] font-light">boutiquehotelgarden@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#873260] mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-[#111111] text-[15px] mb-1">Hours</p>
                    <p className="text-[#32373c] text-[15px] font-light">Reception open 07:00 – 23:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-sm border border-[#e5e5e5] p-8">
                <h3 className="text-[20px] font-serif text-[#111111] mb-6">Send a Message</h3>

                {showSuccess && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-[14px] text-green-700">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                      Full Name <span className="text-[#991b1b]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                      Email Address <span className="text-[#991b1b]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111]"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                      Subject <span className="text-[#991b1b]">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111] bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Reservation">Reservation</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">
                      Message <span className="text-[#991b1b]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#873260] transition-colors text-[14px] text-[#111111] resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#111111] hover:bg-[#333333] disabled:bg-[#ccc] text-white py-4 rounded-sm transition-colors text-[12px] font-medium tracking-[0.15em] uppercase disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
