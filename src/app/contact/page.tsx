'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message sent! We\'ll reply within 24 hours 🍫');
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0500] pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h1 className="text-5xl font-bold text-[#FDF6EC] mb-4">
            Say <span className="gradient-text">Hello</span>
          </h1>
          <p className="text-[#FDF6EC]/50 max-w-lg mx-auto">
            Questions about orders, custom boxes, or bulk orders? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-[#FDF6EC] mb-6">Find Us</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#C8860A]" />
                  </div>
                  <div>
                    <div className="text-[#FDF6EC] font-medium">Location</div>
                    <div className="text-[#FDF6EC]/55 text-sm mt-0.5">Indiranagar, Bangalore<br />Karnataka 560038</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#C8860A]" />
                  </div>
                  <div>
                    <div className="text-[#FDF6EC] font-medium">WhatsApp / Call</div>
                    <div className="text-[#FDF6EC]/55 text-sm mt-0.5">+91 98765 43210</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#C8860A]" />
                  </div>
                  <div>
                    <div className="text-[#FDF6EC] font-medium">Email</div>
                    <div className="text-[#FDF6EC]/55 text-sm mt-0.5">hello@thebrownieclub.in</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#C8860A]" />
                  </div>
                  <div>
                    <div className="text-[#FDF6EC] font-medium">Order Hours</div>
                    <div className="text-[#FDF6EC]/55 text-sm mt-0.5">Mon–Sat: 9am – 8pm<br />Sunday: 10am – 6pm</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0 text-[#C8860A] font-bold text-sm">
                    IG
                  </div>
                  <div>
                    <div className="text-[#FDF6EC] font-medium">Instagram</div>
                    <div className="text-[#FDF6EC]/55 text-sm mt-0.5">@thebrownieclub.blr</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3B1F0E] to-[#1A0A00] border border-[#C8860A]/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-[#FDF6EC] mb-2">Fastest Response: WhatsApp</h3>
              <p className="text-[#FDF6EC]/60 text-sm mb-4">For quick order queries, WhatsApp us directly for same-day response.</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8 space-y-6 h-fit">
            <h2 className="text-xl font-bold text-[#FDF6EC]">Send a Message</h2>
            {[
              { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-[#FDF6EC]/60 text-sm mb-2">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-3 text-[#FDF6EC] outline-none transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-[#FDF6EC]/60 text-sm mb-2">Message</label>
              <textarea
                placeholder="Tell us about your order, custom request, or anything else..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-3 text-[#FDF6EC] outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8860A] hover:bg-[#E8A020] disabled:opacity-50 text-white py-3.5 rounded-full font-semibold transition-all hover:scale-105"
            >
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
