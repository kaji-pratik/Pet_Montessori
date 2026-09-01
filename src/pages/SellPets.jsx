import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronRight, CheckCircle, HelpCircle, FileText } from 'lucide-react';
import { db } from '../services/db';

export default function SellPets({ user, triggerNotification }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [vaccination, setVaccination] = useState('Not Vaccinated');
  const [images, setImages] = useState([]);
  
  // Owner info (pre-fill with user state)
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || '');

  // File picker handler converting to mock base64
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    triggerNotification(`${files.length} images queued for upload.`);
  };

  const handleClearImages = () => {
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !breed || !age || !price || !ownerName || !ownerPhone || !ownerEmail) {
      triggerNotification('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      // Fallback images if user didn't upload any
      let finalImages = images;
      if (images.length === 0) {
        finalImages = [
          type === 'dog' 
            ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
            : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800"
        ];
      }

      const petListing = {
        name,
        type,
        breed,
        age,
        gender,
        price: parseFloat(price),
        description,
        vaccination,
        images: finalImages,
        ownerName,
        ownerPhone,
        ownerEmail,
        purpose: 'sale',
        status: 'Pending' // Requires admin approval
      };

      await db.savePet(petListing);
      
      // Save notification
      await db.createNotification({
        userId: user.id,
        title: 'Listing Submitted',
        message: `Your pet selling request for "${name}" has been submitted for admin approval.`
      });

      triggerNotification(`Listing for ${name} submitted. Waiting for admin approval! 🐾`);
      navigate('/buy');
    } catch (err) {
      triggerNotification('Failed to submit listing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-orange-500 uppercase tracking-widest font-mono">📢 Seller Portal</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">List Your Pet For Sale</h1>
        <p className="text-sm text-slate-400">Fill out this secure form to showcase your puppies or kittens. All submissions are vetted by our support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Info Box / Steps */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6 h-fit">
          <h3 className="font-extrabold text-base border-b pb-2">Listing Regulations</h3>
          
          <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <div className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-pet-green-500 shrink-0 mt-0.5" />
              <span>Provide certified proof of vaccination (if applicable) for breeder listings.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-pet-green-500 shrink-0 mt-0.5" />
              <span>Accurate description of age, health records and social habits are required.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle size={16} className="text-pet-green-500 shrink-0 mt-0.5" />
              <span>Pending listings are reviewed and usually approved within 12 - 24 hours.</span>
            </div>
          </div>

          <div className="bg-pet-sky-50 dark:bg-slate-700/60 p-4 border border-pet-sky-100 dark:border-slate-600 rounded-2xl">
            <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1">
              <HelpCircle size={14} className="text-pet-sky-500" />
              Need Assistance?
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">If you are a commercial kennel owner wishing to integrate API feeds, contact our merchant team at vendors@petmontessori.com.</p>
          </div>
        </div>

        {/* Listing Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <FileText className="text-pet-orange-500" size={20} />
              <span>Pet Specifications</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Charlie"
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
                  placeholder="e.g. Beagle / Siamese"
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
                  placeholder="e.g. 3 Months / 1 Year"
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
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Price (NPR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 25000"
                  min={1}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Multiple Images Upload Handler */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Upload Images</label>
                <div className="flex gap-2">
                  <label className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer text-xs font-bold text-slate-500 dark:text-slate-300 w-full">
                    <Upload size={16} />
                    <span>Choose Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearImages}
                      className="px-3 border border-red-200 dark:border-red-950 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {images.length > 0 && (
                  <span className="text-[10px] text-pet-green-500 font-semibold block mt-1.5">{images.length} images ready to upload.</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Detailed Description *</label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail temperament, social habits, parent breed history, dietary behavior..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white resize-none"
              />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pt-4 pb-3">
              <CheckCircle className="text-pet-green-500" size={20} />
              <span>Owner Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Seller Name *</label>
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
              className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Listing for Review'}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
