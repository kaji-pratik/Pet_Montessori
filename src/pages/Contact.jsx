import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, MessageSquare } from 'lucide-react';

export default function Contact({ triggerNotification }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      triggerNotification('Please fill in all form inputs.', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      triggerNotification('Thank you! Your message has been sent successfully. 🐾');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest font-mono">📞 Keep In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Contact Us</h1>
        <p className="text-sm text-slate-400">Have questions about listings, bookings, or shelter support? Drop us a line.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Contact Coordinates & Map */}
        <div className="space-y-6">
          
          {/* Details Card */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="font-extrabold text-base border-b pb-2">Office Headquarters</h3>
            
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-pet-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Location:</p>
                  <p className="text-slate-400 mt-0.5">Bakhundole, Ward-3, Lalitpur, 44700, Nepal</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-pet-sky-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Phone Support:</p>
                  <p className="text-slate-400 mt-0.5">+977-1-5544332 / +977-9801234567</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-pet-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Support Email:</p>
                  <p className="text-slate-400 mt-0.5">info@petmontessori.com</p>
                </div>
              </li>
            </ul>

            {/* Socials */}
            <div className="border-t pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Connect With Us</p>
              <div className="flex space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-pet-sky-500 hover:text-white flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-pet-orange-500 hover:text-white flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors font-bold text-xs">
                  W
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-pet-sky-600 hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Mock Google Map */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 border-b font-extrabold text-xs text-slate-850 dark:text-white">
              📍 Bakhundole Lalitpur Location
            </div>
            
            {/* Styled Map Container Mockup */}
            <div className="h-52 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-4">
              {/* Map Graphics */}
              <div className="absolute inset-0 opacity-40 dark:opacity-20 flex flex-col justify-between p-2 pointer-events-none">
                <div className="border-b-2 border-dashed border-slate-300 w-full h-0"></div>
                <div className="border-r-2 border-dashed border-slate-300 h-full w-0 mx-auto"></div>
                <div className="border-b-2 border-dashed border-slate-300 w-full h-0"></div>
              </div>

              {/* Pin Indicator */}
              <div className="text-center relative z-10 space-y-1">
                <div className="w-10 h-10 bg-pet-orange-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce-slow">
                  <MapPin size={22} />
                </div>
                <p className="text-[10px] font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full shadow border">
                  Pet Montessori Headquarters
                </p>
              </div>

              {/* Map coordinates label */}
              <span className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-mono">27.6791° N, 85.3135° E</span>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <MessageSquare className="text-pet-sky-500" size={20} />
              <span>Leave A Message</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Booking assistance / breeder partnership"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Your Message *</label>
              <textarea
                required
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you need help with..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Send size={16} />
              <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
