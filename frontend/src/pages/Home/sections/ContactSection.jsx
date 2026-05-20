import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { FadeUp, RevealText } from '../../../components/animations';

const CONTACT_INFO = [
  { icon: <MapPin className="w-5 h-5" />, label: 'Location', val: '123 Serenity Ave\nBeverly Hills, CA' },
  { icon: <Phone className="w-5 h-5" />, label: 'Phone', val: '+1 (555) 123-4567\nMon–Sat: 9AM–8PM' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email', val: 'hello@moonlit.studio\nbookings@moonlit.studio' },
];

const ContactSection = ({ formData, setFormData, onSubmit, loading }) => (
  <section id="contact" className="w-full bg-[var(--color-accent)] py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="mb-20 flex flex-col items-start">
        <FadeUp><span className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-400 block mb-4">Get In Touch</span></FadeUp>
        <RevealText as="h2" text="Connect With Us" className="font-serif text-[var(--color-primary)] uppercase tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <FadeUp>
          <form onSubmit={onSubmit} className="bg-white rounded-3xl p-10 md:p-14 shadow-sm space-y-8">
            <h3 className="font-serif text-2xl text-[var(--color-primary)] mb-2">Send an Inquiry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Your Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Subject</label>
              <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Appointment Request" className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-3">Message</label>
              <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help..." className="w-full pb-3 border-b border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] focus:border-[#3AA89B] outline-none font-light text-base transition-colors resize-none" />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-4 bg-[var(--color-primary)] text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl hover:bg-[#3AA89B] transition-all duration-500 flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-[#3AA89B]/20 ${loading ? 'opacity-50' : ''}`}>
              {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
            </button>
          </form>
        </FadeUp>

        <FadeUp delay={0.2} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONTACT_INFO.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-[#3AA89B]/10 flex items-center justify-center text-[#3AA89B]">{item.icon}</div>
                <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">{item.label}</p>
                <p className="text-[var(--color-primary)] font-light text-sm leading-relaxed whitespace-pre-line">{item.val}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: '300px' }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.341490226344!2d-118.403487384784!3d34.08636498059632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1655000000000!5m2!1sen!2sus" width="100%" height="100%" style={{ border: 0, minHeight: '300px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Moonlit Studios Location" />
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
);

export default ContactSection;
