import React, { useState, useEffect } from 'react';
import { Search, Heart, ShieldAlert, Check, X, Filter } from 'lucide-react';
import { db } from '../services/db';

export default function PetAdoption({ wishlist, toggleWishlist, triggerNotification }) {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Adoption Form Modal State
  const [selectedPet, setSelectedPet] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [homeType, setHomeType] = useState('Apartment');
  const [hasPets, setHasPets] = useState('No');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
    const list = await db.getPets();
    // Filter only those whose purpose is adoption and status is Approved
    const adoptable = list.filter(p => p.purpose === 'adoption' && p.status === 'Approved');
    setPets(adoptable);
    setFilteredPets(adoptable);
    setLoading(false);
  };

  // Re-run filters whenever a query updates
  useEffect(() => {
    let result = pets;

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(p => p.type === selectedType);
    }

    if (selectedBreed !== 'all') {
      result = result.filter(p => p.breed === selectedBreed);
    }

    if (selectedAge !== 'all') {
      result = result.filter(p => {
        const ageLower = p.age.toLowerCase();
        if (selectedAge === 'baby') return ageLower.includes('month') || ageLower.includes('weeks');
        if (selectedAge === 'adult') return ageLower.includes('year') && parseInt(p.age) < 5;
        if (selectedAge === 'senior') return ageLower.includes('year') && parseInt(p.age) >= 5;
        return true;
      });
    }

    setFilteredPets(result);
    setCurrentPage(1); // Reset page on filter
  }, [searchTerm, selectedType, selectedBreed, selectedAge, pets]);

  // Pagination helpers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

  // List of breeds dynamically extracted
  const breeds = ['all', ...new Set(pets.map(p => p.breed))];

  const handleOpenAdoption = (pet) => {
    // Fill with active session user details if logged in
    const sessionUser = localStorage.getItem('pet_montessori_current_user');
    if (sessionUser) {
      const u = JSON.parse(sessionUser);
      setApplicantName(u.name || '');
      setApplicantEmail(u.email || '');
      setApplicantPhone(u.phone || '');
    }
    setSelectedPet(pet);
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !applicantEmail) {
      triggerNotification('Please fill in required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const adoptionRequest = {
        petId: selectedPet.id,
        petName: selectedPet.name,
        petImage: selectedPet.images[0],
        applicantName,
        applicantPhone,
        applicantEmail,
        homeType,
        hasPets,
        motivation,
        status: 'Pending'
      };

      await db.saveAdoptionRequest(adoptionRequest);
      
      // Send user a notification
      await db.createNotification({
        userId: JSON.parse(localStorage.getItem('pet_montessori_current_user'))?.id || 'all',
        title: 'Adoption Request Submitted',
        message: `Your request to adopt ${selectedPet.name} has been received. Our team will contact you shortly.`
      });

      triggerNotification(`Adoption request for ${selectedPet.name} submitted successfully! 🐾`);
      
      // Reset Modal State
      setSelectedPet(null);
      setMotivation('');
    } catch (err) {
      triggerNotification('Failed to submit adoption request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest font-mono">🏠 Find a Friend</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Adoptable Companions</h1>
        <p className="text-sm text-slate-400">Give a shelter dog or cat a warm home. Browse verified adoptions in your local neighborhood.</p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, breed..."
            className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-xs sm:text-sm outline-none dark:text-white"
          />
        </div>

        {/* Pet Type */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Types (Dogs & Cats)</option>
            <option value="dog">Dogs Only</option>
            <option value="cat">Cats Only</option>
          </select>
        </div>

        {/* Breed */}
        <div>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white capitalize font-semibold"
          >
            <option value="all">All Breeds</option>
            {breeds.filter(b => b !== 'all').map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>

        {/* Age Stage */}
        <div>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Ages</option>
            <option value="baby">Puppy/Kitten (Under 1 Year)</option>
            <option value="adult">Adult (1 - 5 Years)</option>
            <option value="senior">Senior (5+ Years)</option>
          </select>
        </div>

      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl p-4 space-y-4 animate-pulse border border-slate-100 dark:border-slate-700">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
          <p className="text-slate-400 text-sm font-semibold">No pets match your filter queries. 🐾</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.map((pet) => {
              const isWish = wishlist.some(w => w.id === pet.id);
              return (
                <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full border border-slate-100 dark:border-slate-700">
                  
                  {/* Image and Wishlist toggle */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img 
                      src={pet.images[0]} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                      onClick={() => toggleWishlist(pet)}
                      className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition-all"
                      aria-label="Wishlist"
                    >
                      <Heart size={16} fill={isWish ? "currentColor" : "none"} />
                    </button>
                    {pet.fee > 0 ? (
                      <div className="absolute bottom-3 left-3 bg-pet-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                        Shelter Fee: Rs. {pet.fee}
                      </div>
                    ) : (
                      <div className="absolute bottom-3 left-3 bg-pet-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                        Free Adoption
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
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

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{pet.description}</p>

                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
                      <span>Age: <strong>{pet.age}</strong></span>
                      <span className="text-pet-green-600 font-bold flex items-center gap-0.5">
                        <span className="text-[8px]">●</span> {pet.vaccination}
                      </span>
                    </div>

                    <div className="pt-2 mt-auto">
                      <button 
                        onClick={() => handleOpenAdoption(pet)}
                        className="w-full text-center bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white hover:from-pet-orange-600 hover:to-pet-orange-700 py-2.5 rounded-2xl text-xs font-bold shadow-sm hover:shadow transition-all"
                      >
                        Adopt Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-full text-xs font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition ${currentPage === idx + 1 ? 'bg-pet-orange-500 text-white shadow-md' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-full text-xs font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}

        </div>
      )}

      {/* ADOPTION APPLICATION MODAL */}
      {selectedPet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Adopt {selectedPet.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Please share your contact details and home suitability.</p>
              </div>
              <button 
                onClick={() => setSelectedPet(null)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleAdoptionSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Home Type</label>
                  <select
                    value={homeType}
                    onChange={(e) => setHomeType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House with Yard">House with Yard</option>
                    <option value="Villa">Villa / Farm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Other Pets?</label>
                  <select
                    value={hasPets}
                    onChange={(e) => setHasPets(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                  >
                    <option value="No">No other pets</option>
                    <option value="Yes (Dogs)">Yes, Dogs</option>
                    <option value="Yes (Cats)">Yes, Cats</option>
                    <option value="Yes (Both)">Yes, Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Why do you want to adopt {selectedPet.name}? *</label>
                <textarea
                  required
                  rows="3"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Tell us a little bit about your schedule, family, and preparation for this pet..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white resize-none"
                />
              </div>

              {selectedPet.fee > 0 && (
                <div className="bg-pet-orange-50 dark:bg-slate-700/60 p-3.5 rounded-2xl border border-pet-orange-100 dark:border-slate-600 flex items-start space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldAlert className="text-pet-orange-500 shrink-0 mt-0.5" size={16} />
                  <span>A nominal shelter adoption fee of <strong>Rs. {selectedPet.fee}</strong> applies on approval to cover rescue vaccinations and veterinary diets.</span>
                </div>
              )}

              <div className="flex gap-3 pt-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPet(null)}
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-3 bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-orange-600 hover:to-pet-orange-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
