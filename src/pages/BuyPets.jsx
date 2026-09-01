import React, { useState, useEffect } from 'react';
import { Search, Heart, ChevronLeft, ChevronRight, Check, X, CreditCard, ShieldAlert } from 'lucide-react';
import { db } from '../services/db';

export default function BuyPets({ wishlist, toggleWishlist, user, triggerNotification }) {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Multi-image active slide tracking per pet card
  const [activeImageIndexes, setActiveImageIndexes] = useState({});

  // Checkout modal
  const [selectedPet, setSelectedPet] = useState(null);
  const [paymentGateway, setPaymentGateway] = useState('esewa');
  const [walletPhone, setWalletPhone] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [otp, setOtp] = useState('');
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select/Summary, 2: Wallet Details, 3: OTP Code, 4: Receipt
  const [isPaying, setIsPaying] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
    const list = await db.getPets();
    // Pets for sale that are Approved and not yet Sold
    const forSale = list.filter(p => p.purpose === 'sale' && p.status === 'Approved');
    setPets(forSale);
    setFilteredPets(forSale);
    setLoading(false);
  };

  useEffect(() => {
    let result = pets;

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.type === selectedCategory);
    }

    if (selectedBreed !== 'all') {
      result = result.filter(p => p.breed === selectedBreed);
    }

    if (priceRange !== 'all') {
      result = result.filter(p => {
        if (priceRange === 'low') return p.price < 25000;
        if (priceRange === 'mid') return p.price >= 25000 && p.price <= 35000;
        if (priceRange === 'high') return p.price > 35000;
        return true;
      });
    }

    setFilteredPets(result);
  }, [searchTerm, selectedCategory, selectedBreed, priceRange, pets]);

  const breeds = ['all', ...new Set(pets.map(p => p.breed))];

  // Carousel handlers
  const prevImage = (petId, imgCount, e) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({
      ...prev,
      [petId]: ((prev[petId] || 0) - 1 + imgCount) % imgCount
    }));
  };

  const nextImage = (petId, imgCount, e) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({
      ...prev,
      [petId]: ((prev[petId] || 0) + 1) % imgCount
    }));
  };

  // Checkout flows
  const handleOpenCheckout = (pet) => {
    if (!user) {
      triggerNotification('Please log in to purchase pets.', 'error');
      return;
    }
    setSelectedPet(pet);
    setPaymentStep(1);
    setWalletPhone(user.phone || '');
    setWalletPin('');
    setOtp('');
  };

  const handleProcessPayment = () => {
    if (paymentStep === 1) {
      setPaymentStep(2);
    } else if (paymentStep === 2) {
      if (!walletPhone || !walletPin) {
        triggerNotification('Please enter credentials.', 'error');
        return;
      }
      setIsPaying(true);
      setTimeout(() => {
        setIsPaying(false);
        setPaymentStep(3); // OTP code confirmation
      }, 1000);
    } else if (paymentStep === 3) {
      if (!otp) {
        triggerNotification('Please input the OTP sent to your phone.', 'error');
        return;
      }
      setIsPaying(true);
      setTimeout(async () => {
        const rcpt = 'TXN-' + Math.floor(Math.random() * 89999999 + 10000000);
        setReceiptId(rcpt);

        // Mark pet as sold in database
        const updatedPet = { ...selectedPet, status: 'Sold' };
        await db.savePet(updatedPet);

        // Save order receipt logs in DB
        await db.saveOrder({
          txnId: rcpt,
          petId: selectedPet.id,
          petName: selectedPet.name,
          price: selectedPet.price,
          type: 'pet',
          buyerEmail: user.email,
          buyerName: user.name,
          paymentGateway,
          paymentStatus: 'Paid',
          status: 'Completed'
        });

        // Trigger notification
        await db.createNotification({
          userId: user.id,
          title: 'Pet Purchase Confirmed',
          message: `Congratulations! Your purchase of ${selectedPet.name} is complete. Transcation ID: ${rcpt}.`
        });

        triggerNotification(`Payment successful! You bought ${selectedPet.name}. 🐾`);
        loadPets(); // Refresh lists
        setIsPaying(false);
        setPaymentStep(4); // Receipt View
      }, 1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-orange-500 uppercase tracking-widest font-mono">💰 Verified Marketplace</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Buy Pets</h1>
        <p className="text-sm text-slate-400">Purebred and certified dogs and cats listed by verified breeders and owners in Nepal.</p>
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
            placeholder="Search by breed or keyword..."
            className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-xs sm:text-sm outline-none dark:text-white"
          />
        </div>

        {/* Pet Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Categories</option>
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

        {/* Price Range */}
        <div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Prices</option>
            <option value="low">Under Rs. 25,000</option>
            <option value="mid">Rs. 25,000 - Rs. 35,000</option>
            <option value="high">Above Rs. 35,000</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl p-4 space-y-4 animate-pulse border border-slate-100 dark:border-slate-700">
              <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
          <p className="text-slate-400 text-sm font-semibold">No pets listed for sale match these filters. 🐾</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => {
            const isWish = wishlist.some(w => w.id === pet.id);
            const activeIdx = activeImageIndexes[pet.id] || 0;
            const images = pet.images && pet.images.length > 0 ? pet.images : ["/placeholder.jpg"];

            return (
              <div key={pet.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full border border-slate-100 dark:border-slate-700">
                
                {/* Images Carousel */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img 
                    src={images[activeIdx]} 
                    alt={pet.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => prevImage(pet.id, images.length, e)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-slate-850 dark:hover:bg-slate-800 p-1.5 rounded-full shadow-md text-slate-700 dark:text-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={(e) => nextImage(pet.id, images.length, e)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-slate-850 dark:hover:bg-slate-800 p-1.5 rounded-full shadow-md text-slate-700 dark:text-white"
                        aria-label="Next image"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <button 
                    onClick={() => toggleWishlist(pet)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition-all"
                    aria-label="Wishlist"
                  >
                    <Heart size={16} fill={isWish ? "currentColor" : "none"} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full text-[10px] font-bold text-pet-orange-500 shadow-sm uppercase tracking-wide">
                    Rs. {pet.price}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{pet.name || 'Unnamed'}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{pet.breed}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pet.gender === 'Male' ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/20' : 'bg-pink-50 text-pink-500 dark:bg-pink-950/20'}`}>
                      {pet.gender}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{pet.description}</p>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-3 text-[11px] text-slate-400 space-y-1.5">
                    <p>Age: <strong className="text-slate-700 dark:text-slate-300">{pet.age}</strong></p>
                    <p className="truncate">Seller: <strong className="text-slate-700 dark:text-slate-300">{pet.ownerName} ({pet.ownerPhone})</strong></p>
                  </div>

                  <div className="pt-2 mt-auto">
                    <button 
                      onClick={() => handleOpenCheckout(pet)}
                      className="w-full text-center bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white hover:from-pet-sky-600 hover:to-pet-sky-700 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* NEPAL DIGITAL WALLET CHECKOUT MODAL */}
      {selectedPet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Checkout: Purchase {selectedPet.name}</h3>
              {paymentStep !== 4 && (
                <button 
                  onClick={() => setSelectedPet(null)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  aria-label="Close Checkout"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {paymentStep === 1 && (
                /* Step 1: Summary */
                <div className="space-y-5">
                  <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-700/40 p-4 rounded-2xl">
                    <img src={selectedPet.images[0]} alt="pet" className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedPet.name}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{selectedPet.breed}</p>
                      <p className="text-xs text-pet-orange-500 font-extrabold mt-1">Amount: Rs. {selectedPet.price}</p>
                    </div>
                  </div>

                  {/* Payment selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Choose Payment Wallet</label>
                    <div className="grid grid-cols-2 gap-4">
                      
                      <button 
                        type="button"
                        onClick={() => setPaymentGateway('esewa')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${paymentGateway === 'esewa' ? 'border-pet-green-500 bg-pet-green-50/20 shadow-sm ring-1 ring-pet-green-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                      >
                        <span className="text-sm font-extrabold text-green-600">eSewa Wallet</span>
                        <span className="text-[10px] text-slate-400">Green Payment Gateway</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setPaymentGateway('khalti')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${paymentGateway === 'khalti' ? 'border-purple-500 bg-purple-50/20 shadow-sm ring-1 ring-purple-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                      >
                        <span className="text-sm font-extrabold text-purple-600">Khalti Wallet</span>
                        <span className="text-[10px] text-slate-400">Purple Payment Gateway</span>
                      </button>

                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-slate-700/60 p-3.5 border border-amber-100 dark:border-slate-600 rounded-2xl flex items-start space-x-2 text-[11px] text-amber-800 dark:text-slate-400">
                    <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                    <span>Live pets are not eligible for Cash on Delivery (COD) for security reasons.</span>
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:from-pet-sky-600 hover:to-pet-sky-700"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {paymentStep === 2 && (
                /* Step 2: Wallet Details */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h4 className={`text-base font-bold uppercase tracking-wider ${paymentGateway === 'esewa' ? 'text-green-600' : 'text-purple-600'}`}>
                      {paymentGateway === 'esewa' ? 'eSewa Merchant Checkout' : 'Khalti Payment Portal'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pay Rs. {selectedPet.price} from your wallet</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">eSewa/Khalti Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Wallet Web PIN</label>
                    <input
                      type="password"
                      required
                      value={walletPin}
                      onChange={(e) => setWalletPin(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPaymentStep(1)}
                      className="w-1/2 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isPaying}
                      className="w-1/2 py-3 bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-sky-600 hover:to-pet-sky-700 disabled:opacity-50"
                    >
                      {isPaying ? 'Authenticating...' : 'Send OTP Code'}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 3 && (
                /* Step 3: OTP Code */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Security Verification</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Please input the 6-digit confirmation OTP sent to your phone</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">One Time Password (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-mono text-center tracking-widest text-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPaymentStep(2)}
                      className="w-1/2 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isPaying}
                      className="w-1/2 py-3 bg-gradient-to-r from-pet-green-500 to-pet-green-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-green-600 hover:to-pet-green-700 disabled:opacity-50"
                    >
                      {isPaying ? 'Processing...' : 'Verify & Pay'}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 4 && (
                /* Step 4: Receipt */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-pet-green-100 rounded-full flex items-center justify-center text-pet-green-500 mx-auto">
                      <Check size={26} className="stroke-[3]" />
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Transaction Successful!</h4>
                    <p className="text-xs text-slate-400">Your order has been confirmed. Below is your booking receipt.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800 space-y-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between font-bold border-b pb-2">
                      <span>Receipt ID:</span>
                      <span className="text-slate-900 dark:text-white">{receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pet Name:</span>
                      <span>{selectedPet.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Breed:</span>
                      <span>{selectedPet.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gateway:</span>
                      <span className="capitalize">{paymentGateway} Wallet</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Buyer:</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-slate-900 dark:text-white">
                      <span>Total Paid:</span>
                      <span>Rs. {selectedPet.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedPet(null); setPaymentStep(1); }}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white py-3 rounded-2xl font-bold text-sm shadow-md"
                  >
                    Done & Close
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
