import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Mail, Phone, MapPin, Facebook, Instagram, Send, Linkedin } from 'lucide-react';

export default function Footer({ triggerNotification }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API newsletter signup
    triggerNotification('Thank you for subscribing to our newsletter! 🐾');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand and Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-pet-orange-500 text-white p-2 rounded-full shadow-md">
                <PawPrint size={20} />
              </div>
              <span className="font-sans font-extrabold text-2xl tracking-tight text-white">
                Pet Montessori
              </span>
            </Link>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              "Your Trusted Home for Happy Dogs & Cats." Providing professional pet boarding, seamless adoptions, premium pet products, and veterinary-approved dietary guides.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pet-sky-500 hover:text-white flex items-center justify-center transition-all duration-150">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pet-orange-500 hover:text-white flex items-center justify-center transition-all duration-150">
                <Instagram size={16} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-150 font-bold text-sm">
                W
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pet-sky-600 hover:text-white flex items-center justify-center transition-all duration-150">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/" className="hover:text-pet-orange-500 transition-colors">Home</Link>
              <Link to="/nutrition" className="hover:text-pet-orange-500 transition-colors">Nutrition</Link>
              <Link to="/adopt" className="hover:text-pet-orange-500 transition-colors">Adoptions</Link>
              <Link to="/buy" className="hover:text-pet-orange-500 transition-colors">Buy Pets</Link>
              <Link to="/sell" className="hover:text-pet-orange-500 transition-colors">Sell Pets</Link>
              <Link to="/donate" className="hover:text-pet-orange-500 transition-colors">Donate</Link>
              <Link to="/shop" className="hover:text-pet-orange-500 transition-colors">Shop</Link>
              <Link to="/booking" className="hover:text-pet-orange-500 transition-colors">Pet Boarding</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-pet-orange-500 shrink-0 mt-0.5" />
                <span>Bakhundole, Lalitpur 44700, Nepal</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-pet-sky-500 shrink-0" />
                <span>+977-1-5544332 / +977-9801234567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-pet-green-500 shrink-0" />
                <span>info@petmontessori.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Newsletter</h4>
            <p className="text-sm text-slate-400">
              Subscribe to get the latest pet health guides, adoptable lists, and promotional offers directly.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-slate-800 border border-slate-700 text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pet-orange-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-pet-orange-500 hover:bg-pet-orange-600 text-white p-2.5 rounded-full flex items-center justify-center transition-colors shadow-md shrink-0"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Pet Montessori. All rights reserved. Made in Nepal.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="/support" className="hover:text-slate-400 transition-colors">Support center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
