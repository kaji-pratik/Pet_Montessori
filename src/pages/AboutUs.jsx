import React from 'react';
import { ShieldCheck, Heart, Users, Compass, Eye } from 'lucide-react';

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Rohan Pandey",
      role: "Co-Founder & General Manager",
      bio: "Feline behavioral enthusiast and former shelter coordinator with over 8 years in pet care management.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Dr. Nabina Thapa",
      role: "Chief Veterinary Consultant",
      bio: "Doctor of Veterinary Medicine (DVM) specializing in canine skeletal health, pet diagnostics, and nutrition.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Suman Adhikari",
      role: "Lead Pet Caretaker & Groomer",
      bio: "Certified professional pet groomer and animal care practitioner who treats every guest like family.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-16">
      
      {/* 1. Page Header / Hero Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-pet-orange-500 uppercase tracking-widest font-mono">🏠 Our Roots</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white leading-tight">
            Connecting Hearts & Paws Across Nepal
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Founded in Lalitpur, Nepal, Pet Montessori emerged from a simple realization: pet parents needed a single, trustworthy ecosystem that could handle specialized dietary plans, verified adoptions, premium marketplace retail, and absolute peace of mind during travel boarding.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Over the years, we have transitioned from a localized rescue assistance group to a modern, fully-fledged digital sanctuary, uniting rescue shelters, certified dog/cat breeders, accessory vendors, and veterinarians on a unified premium portal.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-pet-sky-100 dark:bg-pet-sky-950/20 blur-3xl -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800" 
            alt="dog groomer bathing golden retriever" 
            className="rounded-3xl shadow-xl w-full h-[320px] object-cover"
          />
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm hover:shadow transition duration-200">
          <div className="w-12 h-12 bg-pet-sky-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-pet-sky-500">
            <Compass size={24} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            To provide safe, loving, and veterinary-vetted care services alongside a verified pet marketplace, ensuring that every dog and cat in Nepal receives proper shelter, active nutrition, and a happy home.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm hover:shadow transition duration-200">
          <div className="w-12 h-12 bg-pet-green-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-pet-green-500">
            <Eye size={24} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            To build the leading digital and physical pet care service framework in South Asia, promoting strict anti-abuse rescue programs, breeder certifications, and community pet-parent education.
          </p>
        </div>

      </section>

      {/* 3. Why Choose Pet Montessori */}
      <section className="bg-slate-50 dark:bg-slate-800/40 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">Why Pet Montessori?</h2>
          <p className="text-xs sm:text-sm text-slate-400">Our core pillars of dedication and safety sets us apart.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="text-pet-green-500 shrink-0" size={18} />
              <span>Veterinary Vetted Listings</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">Every pet posted for sale or donation must undergo basic clinical check-ups and vaccine updates before they go live on our public boards.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Heart className="text-pet-orange-500 shrink-0" size={18} />
              <span>Cage-Free Boarding Rooms</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">We strictly prohibit metal caging. Our boarding guest suites feature spacious resting areas, warm wooden floors, and custom memory foam beds.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="text-pet-sky-500 shrink-0" size={18} />
              <span>Community Support</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">We allocate 10% of all marketplace sales and accessory shop revenues to fund rescue center diagnostics and street dog neutering drives.</p>
          </div>

        </div>
      </section>

      {/* 4. Our Team */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest font-mono">👥 Care Experts</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">Meet Our Specialists</h2>
          <p className="text-xs sm:text-sm text-slate-400">The experienced veterinary consultants and animal caretakers backing our portal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 text-center space-y-4 shadow-sm">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-slate-55 shadow" />
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{member.name}</h4>
                <p className="text-xs text-pet-orange-500 font-semibold">{member.role}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
