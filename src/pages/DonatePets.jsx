import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Upload, Check, ClipboardList, Stethoscope, Home, Heart } from 'lucide-react';
import { db } from '../services/db';

export default function DonatePets({ user, triggerNotification }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [description, setDescription] = useState('');
  const [vaccination, setVaccination] = useState('Not Vaccinated');
  const [images, setImages] = useState([]);

  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || '');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    triggerNotification(`${files.length} images queued.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !breed || !age || !ownerName || !ownerPhone || !ownerEmail) {
      triggerNotification('Please fill in required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      let finalImages = images;
      if (images.length === 0) {
        finalImages = [
          type === 'dog' 
            ? "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800"
            : "https://images.unsplash.com/photo-1574158622643-69d34d72650a?auto=format&fit=crop&q=80&w=800"
        ];
      }

      const donationItem = {
        name,
        type,
        breed,
        age,
        gender,
        fee: 0, // Donation means free adoption!
        price: 0,
        description,
        vaccination,
        images: finalImages,
        ownerName,
        ownerPhone,
        ownerEmail,
        purpose: 'adoption', // Listed directly for adoption!
        status: 'Pending' // Admin review required
      };

      await db.savePet(donationItem);

      await db.createNotification({
        userId: user.id,
        title: 'Donation Post Submitted',
        message: `Your pet donation request for "${name}" has been received. Our caretakers will schedule a diagnostic visit.`
      });

      triggerNotification(`Donation listing for ${name} submitted. Thank you! 🐾`);
      navigate('/adopt');
    } catch (err) {
      triggerNotification('Failed to submit donation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const successStories = [
    {
      id: 1,
      petName: 'Bella',
      type: 'cat',
      story: 'Bella, a beautiful white Persian, was donated when her owner had to relocate abroad. Within 3 days of shelter care, Priya Adhikari adopted her. Bella now enjoys a spacious backyard and a loving family in Lalitpur.',
      image: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&q=80&w=800',
      adopter: 'Priya A.'
    },
    {
      id: 2,
      petName: 'Milo',
      type: 'dog',
      story: 'Milo was found abandoned on the streets with minor skin issues. A kind citizen listed him on our Donate portal. Following diagnostic care and baths, Milo was adopted by the Shrestha family and is now a certified therapy dog!',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
      adopter: 'Rohan S.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="mx-auto h-12 w-12 bg-pet-green-100 dark:bg-slate-700 text-pet-green-500 rounded-full flex items-center justify-center shadow-sm">
          <HeartHandshake size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Donate Pets</h1>
        <p className="text-sm text-slate-400">Can't take care of your pet anymore? List them for donation. We ensure they undergo veterinary diagnostics and find safe families.</p>
      </div>

      {/* 3 Steps Donation Process */}
      <section className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-base sm:text-lg text-center mb-8">Our Safe Donation Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pet-orange-50 dark:bg-slate-700 text-pet-orange-500 flex items-center justify-center font-bold">
              <ClipboardList size={22} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Online Details Submission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Fill out the detailed health, breed, and habits profile forms below to upload photos for approval.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pet-sky-50 dark:bg-slate-700 text-pet-sky-500 flex items-center justify-center font-bold">
              <Stethoscope size={22} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Health Diagnostic Checking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Our rescue partner arranges a veterinary evaluation to conduct basic health diagnostics, vaccinations, and grooming baths.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pet-green-50 dark:bg-slate-700 text-pet-green-500 flex items-center justify-center font-bold">
              <Home size={22} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Loving Family Adoption</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Once certified, the companion is showcased on our public Adoption board to match verified adopters.</p>
          </div>

        </div>
      </section>

      {/* Main Form and Success Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Donation Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <Heart className="text-pet-green-500" size={20} />
              <span>Pet Donation Profile</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bella"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pet Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Breed *</label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Mixed / Spitz"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Age *</label>
                <input
                  type="text"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 5 Months / 2 Years"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Vaccination Status</label>
                <select
                  value={vaccination}
                  onChange={(e) => setVaccination(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                >
                  <option value="Not Vaccinated">Not Vaccinated</option>
                  <option value="First Dose Administered">First Dose Administered</option>
                  <option value="Fully Vaccinated">Fully Vaccinated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Images</label>
              <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-500 dark:text-slate-300 w-full">
                <Upload size={16} />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <span className="text-[10px] text-pet-green-500 font-semibold block mt-1">{images.length} photos ready.</span>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reason for Donation & Behavior Profile *</label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe why you are donating, and provide details about the pet behavior, habits, and preferences..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white resize-none"
              />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pt-4 pb-3">
              <Check size={20} className="text-pet-green-500" />
              <span>Your Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pet-green-500 to-pet-green-600 hover:from-pet-green-600 hover:to-pet-green-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting request...' : 'Submit Donation Request'}
            </button>

          </form>
        </div>

        {/* Heartwarming Success Stories */}
        <div className="space-y-6">
          <h3 className="font-extrabold text-base border-b pb-2 flex items-center gap-2">
            <span>💖 Success Stories</span>
          </h3>

          {successStories.map(story => (
            <div key={story.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
              <img src={story.image} alt={story.petName} className="h-44 w-full object-cover" />
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{story.petName} is home!</h4>
                  <span className="text-[10px] bg-pet-green-50 text-pet-green-500 dark:bg-green-950/20 px-2.5 py-0.5 rounded-full font-bold">Adopted by {story.adopter}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{story.story}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
