import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Heart, Star, ChevronDown, Check, Phone, Mail, MapPin, Calendar, ShoppingBag, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../services/db';

export default function Home({ triggerNotification, toggleWishlist, wishlist, addToCart }) {
  const navigate = useNavigate();
  const [featuredPets, setFeaturedPets] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pets = await db.getPets();
    setFeaturedPets(pets.filter(p => p.status === 'Approved').slice(0, 4));

    const prods = await db.getProducts();
    setFeaturedProducts(prods.slice(0, 4));

    const tests = await db.getTestimonials();
    setTestimonials(tests);

    const qas = await db.getFAQs();
    setFaqs(qas);
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="font-sans overflow-x-hidden">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-pet-sky-50 via-white to-pet-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-pet-orange-100 dark:bg-pet-orange-950 text-pet-orange-600 dark:text-pet-orange-300 tracking-wide uppercase">
              🐶 Your Premier Pet Sanctuary
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Your Trusted Home for <br/>
              <span className="bg-gradient-to-r from-pet-orange-500 via-pet-sky-500 to-pet-green-500 bg-clip-text text-transparent">
                Happy Dogs & Cats.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              At Pet Montessori, we provide a clean, loving, and educational environment for your furry friends. Explore our boutique market, adoptable rescues, safe boarding check-ins, and vet-approved nutrition.
            </p>
            
            {/* CTA Grid */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/adopt" className="bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:from-pet-orange-600 hover:to-pet-orange-700 transform hover:-translate-y-0.5 transition-all">
                Adopt a Pet
              </Link>
              <Link to="/buy" className="bg-pet-sky-500 hover:bg-pet-sky-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                Buy Pets
              </Link>
              <Link to="/sell" className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transform hover:-translate-y-0.5 transition-all">
                Sell Pets
              </Link>
              <Link to="/donate" className="bg-pet-green-500 hover:bg-pet-green-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                Donate Pets
              </Link>
              <Link to="/booking" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                <Calendar size={16} />
                Book Pet Care
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex justify-center"
          >
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-gradient-to-tr from-pet-sky-100 to-pet-orange-100 dark:from-pet-sky-950/20 dark:to-pet-orange-950/20 blur-3xl -z-10"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 w-full max-w-[480px]">
              <img 
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800" 
                alt="happy retriever dog" 
                className="w-full h-[300px] sm:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-pet-green-100 flex items-center justify-center text-pet-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">100% Certified Care</p>
                    <p className="text-[10px] text-slate-400">Veterinary Approved</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* 2. ABOUT PET MONTESSORI */}
      <section className="py-20 bg-white dark:bg-slate-800/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-pet-green-100 dark:bg-pet-green-950/20 rounded-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800" 
              alt="sleeping cute cat" 
              className="rounded-3xl shadow-xl object-cover w-full h-[300px] sm:h-[400px]"
            />
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <span className="text-xs font-extrabold tracking-wider text-pet-green-500 uppercase">🐾 Who We Are</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
              A Safe, Holistic Haven Built For Your Companion
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Pet Montessori is not just a marketplace; we are a holistic service ecosystem founded in Nepal. We combine professional pet boarding with strict hygienic procedures, dietary guidance, veterinary diagnostics, and a verified market to buy, sell, or adopt pets.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                "Cage-free clean resting areas",
                "Qualified dedicated pet handlers",
                "Strict vaccine checks for safety",
                "Daily updates with photo logs"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 font-semibold">
                  <div className="bg-pet-green-50 dark:bg-slate-700 p-1 rounded-full text-pet-green-500">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <Link to="/about" className="inline-flex items-center space-x-1.5 text-pet-orange-500 font-bold hover:text-pet-orange-600 pt-4 text-sm transition">
              <span>Read Our Full Story</span>
              <span>&rarr;</span>
            </Link>
          </div>
          
        </div>
      </section>

      {/* 3. FEATURED PETS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest">🐶 Meet Our Residents</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Featured Pets</h2>
            </div>
            <Link to="/adopt" className="text-sm font-bold text-pet-sky-500 hover:text-pet-sky-600 flex items-center gap-1.5 mt-4 sm:mt-0 transition">
              <span>View All Adoptable Pets</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map((pet) => {
              const isWish = wishlist.some(w => w.id === pet.id);
              return (
                <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full border border-slate-100 dark:border-slate-700">
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img 
                      src={pet.images[0]} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-pet-orange-600 uppercase shadow-sm">
                      {pet.purpose}
                    </div>
                    <button 
                      onClick={() => toggleWishlist(pet)}
                      className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition-all"
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={isWish ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{pet.name}</h3>
                        <p className="text-xs text-slate-400 font-semibold">{pet.breed}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pet.gender === 'Male' ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/20' : 'bg-pink-50 text-pink-500 dark:bg-pink-950/20'}`}>
                        {pet.gender}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
                      <span>Age: <strong>{pet.age}</strong></span>
                      <span className="text-pet-green-600 font-bold">{pet.vaccination}</span>
                    </div>

                    <div className="pt-2 mt-auto">
                      <Link 
                        to={pet.purpose === 'sale' ? '/buy' : '/adopt'}
                        className="block w-full text-center bg-slate-100 hover:bg-pet-sky-500 dark:bg-slate-700 hover:text-white py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-150"
                      >
                        {pet.purpose === 'sale' ? `Buy Now (Rs. ${pet.price})` : 'Adopt Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PET BOARDING SERVICES */}
      <section className="py-20 bg-white dark:bg-slate-800/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-pet-green-500 tracking-wider uppercase">✨ Safe & Professional Boarding</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Our Boarding Features</h2>
            <p className="text-sm text-slate-400">Leave your pets in our safe care while you are traveling, working, or on vacation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Safe & Clean Environment", desc: "Our quarantine and sleeping areas are sanitised multiple times daily with chemical-free disinfectants.", icon: <ShieldCheck className="text-pet-sky-500" size={28} /> },
              { title: "Grooming & Health Logs", desc: "Every companion undergoes rapid check-ups and custom cleaning grooming baths during checkout.", icon: <PawPrint className="text-pet-green-500" size={28} /> },
              { title: "Live Daily Photo Updates", desc: "Receive automated chat updates and photo log notifications directly through your profile booking card.", icon: <Mail className="text-pet-orange-500" size={28} /> }
            ].map((srv, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl hover:shadow-premium transform hover:-translate-y-1 transition duration-300 space-y-4 border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm">
                  {srv.icon}
                </div>
                <h3 className="font-extrabold text-base text-slate-950 dark:text-white">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-2">
            <Link to="/booking" className="bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 transform active:scale-95 transition-all">
              <Calendar size={18} />
              Book Pet Care Now (Rs. 500 / Day)
            </Link>
          </div>
        </div>
      </section>

      {/* 5. ADOPTION BANNER */}
      <section className="mx-4 sm:mx-8 lg:mx-16 bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white py-12 px-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between max-w-7xl lg:mx-auto">
        <div className="space-y-3 mb-6 md:mb-0 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Give a Rescue Pet a Second Chance at Life</h2>
          <p className="text-xs sm:text-sm text-pet-sky-50 opacity-90 leading-relaxed">
            Hundreds of puppies, kittens, and senior companions are looking for their forever homes. Every adoption from Pet Montessori includes a veterinary wellness certificate.
          </p>
        </div>
        <div className="shrink-0 flex gap-3">
          <Link to="/adopt" className="bg-white text-pet-sky-600 px-6 py-3 rounded-full font-extrabold text-sm hover:bg-slate-100 transition-colors shadow-md">
            Adopt Now
          </Link>
          <Link to="/donate" className="bg-pet-sky-700 text-white px-6 py-3 rounded-full font-extrabold text-sm hover:bg-pet-sky-800 transition-colors">
            Donate Pet
          </Link>
        </div>
      </section>

      {/* 6. FEATURED ACCESSORIES */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-pet-orange-500 uppercase tracking-widest">🛒 Marketplace Essentials</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Featured Accessories</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-pet-orange-500 hover:text-pet-orange-600 flex items-center gap-1.5 mt-4 sm:mt-0 transition">
              <span>Visit Shop</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full border border-slate-100 dark:border-slate-700">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-pet-green-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-sm">
                    In Stock
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{prod.type} • {prod.category}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">{prod.name}</h3>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{prod.rating}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 mt-auto border-t border-slate-50 dark:border-slate-700">
                    <span className="text-sm font-extrabold text-pet-orange-500">Rs. {prod.price}</span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="bg-pet-orange-500 hover:bg-pet-orange-600 text-white p-2 rounded-xl transition shadow-sm hover:shadow-md"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 bg-white dark:bg-slate-800/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-pet-sky-500 tracking-wider uppercase">💬 Happy Families</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">What Pet Parents Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl space-y-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{test.content}"
                </p>
                <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                  <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">{test.name}</h4>
                    <p className="text-[10px] text-slate-400">{test.role}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-pet-orange-500 tracking-wider uppercase">❓ Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition">
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180 text-pet-orange-500' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-700/50 pt-3 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
    </div>
  );
}
