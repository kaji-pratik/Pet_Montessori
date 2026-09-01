import React, { useState, useEffect } from 'react';
import { ShieldCheck, CalendarCheck, Clock, User, Phone, Mail, FileText, Check, X, ShieldAlert, CreditCard } from 'lucide-react';
import { db } from '../services/db';

export default function Booking({ user, triggerNotification }) {
  // Form fields
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Owner fields pre-filled from active session
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(user?.email || '');

  // Computed states
  const [daysCount, setDaysCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Payment states
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState('esewa');
  const [walletPhone, setWalletPhone] = useState(user?.phone || '');
  const [walletPin, setWalletPin] = useState('');
  const [otp, setOtp] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Select Gateway & Summary, 2: Wallet Login, 3: OTP, 4: Receipt
  const [isPaying, setIsPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Calculate days difference
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDaysCount(diffDays);
        setTotalCost(diffDays * 500);
      } else {
        setDaysCount(0);
        setTotalCost(0);
      }
    } else {
      setDaysCount(0);
      setTotalCost(0);
    }
  }, [checkIn, checkOut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || !ownerEmail || !petName || !checkIn || !checkOut) {
      triggerNotification('Please complete required fields.', 'error');
      return;
    }
    if (daysCount <= 0) {
      triggerNotification('Check-out date must be after check-in date.', 'error');
      return;
    }

    setCheckoutStep(1);
    setShowCheckout(true);
  };

  const handleWalletPayment = () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!walletPhone || !walletPin) {
        triggerNotification('Please enter credentials.', 'error');
        return;
      }
      setIsPaying(true);
      setTimeout(() => {
        setIsPaying(false);
        setCheckoutStep(3); // Go to OTP
      }, 800);
    } else if (checkoutStep === 3) {
      if (!otp) {
        triggerNotification('Please enter verification OTP.', 'error');
        return;
      }
      setIsPaying(true);
      setTimeout(async () => {
        const rcptId = 'BK-' + Math.floor(Math.random() * 89999999 + 10000000);

        const newBooking = {
          id: rcptId,
          petName,
          petType,
          breed,
          age,
          checkIn,
          checkOut,
          daysCount,
          totalCost,
          ownerName,
          ownerPhone,
          ownerEmail,
          specialInstructions,
          paymentGateway,
          paymentStatus: 'Paid',
          status: 'Confirmed'
        };

        await db.saveBooking(newBooking);

        await db.createNotification({
          userId: user.id,
          title: 'Pet Care Booking Confirmed',
          message: `Your pet care booking ${rcptId} for ${petName} is confirmed from ${checkIn} to ${checkOut}.`
        });

        triggerNotification(`Boarding booking for ${petName} placed! 🐾`);
        setReceipt(newBooking);
        setIsPaying(false);
        setCheckoutStep(4);
      }, 1200);
    }
  };

  const boardingServices = [
    { title: "Safe & Hygienic", desc: "Chemical-free daily disinfection." },
    { title: "Daily Fresh Feeding", desc: "Premium dry kibble and pure water." },
    { title: "Playtime & Exercise", desc: "Active running sessions twice daily." },
    { title: "Cleaning & Grooming", desc: "Warm showers and nail clipping." },
    { title: "Health Monitoring", desc: "Daily temperature & pulse logs." },
    { title: "Live Photo Updates", desc: "Snaps sent straight to your dashboard." },
    { title: "Experienced Caretakers", desc: "Vetted veterinary assistants." },
    { title: "Comfortable Resting Area", desc: "Orthopedic memory foam beds." },
    { title: "24/7 Emergency Support", desc: "On-call veterinary ambulances." }
  ];

  // Get current date in YYYY-MM-DD format for min-date restrictions
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-green-500 uppercase tracking-widest font-mono">🏨 Premium Pet Boarding</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Pet Care Boarding</h1>
        <p className="text-sm text-slate-400">Leave your companion in our safe hands. We provide structured daily routines, grooming logs, and medical supervision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Services list */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
          <h3 className="font-extrabold text-base border-b pb-3 flex items-center gap-1.5">
            <ShieldCheck className="text-pet-green-500" />
            <span>Inclusive Care Packages</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {boardingServices.map((srv, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm">
                <div className="bg-pet-green-50 dark:bg-slate-700 p-1 rounded-lg text-pet-green-500 shrink-0">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{srv.title}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pet-sky-50 dark:bg-slate-700/60 p-4 border border-pet-sky-100 dark:border-slate-600 rounded-2xl">
            <h4 className="font-bold text-xs text-slate-800 dark:text-white">Structured Formula Pricing</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Boarding costs Rs. 500 per day. Pricing is computed automatically based on your check-in and check-out selections.</p>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <CalendarCheck className="text-pet-orange-500" size={20} />
              <span>Care Check-In Details</span>
            </h3>

            {/* Pet Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Milo"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pet Species</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
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
                  placeholder="e.g. Golden Retriever"
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
                  placeholder="e.g. 2 Years"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Checkin / Checkout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Check-in Date *</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Check-out Date *</label>
                <input
                  type="date"
                  required
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Special Instructions & Medical History</label>
              <textarea
                rows="3"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Mention allergies, food timing, vaccine details, separation anxiety patterns..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white resize-none"
              />
            </div>

            {/* Owner Details */}
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b pt-4 pb-2">
              <User size={18} className="text-pet-green-500" />
              <span>Owner Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Phone *</label>
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

            {/* Calculations Box */}
            {daysCount > 0 && (
              <div className="bg-pet-sky-50 dark:bg-slate-700/60 p-5 rounded-2xl border border-pet-sky-100 dark:border-slate-600 space-y-2 animate-fade-in text-xs sm:text-sm">
                <h4 className="font-bold text-slate-900 dark:text-white">Duration Summary</h4>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Boarding Duration:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{daysCount} Days</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Daily Rate:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Rs. 500 / Day</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-extrabold text-base text-slate-900 dark:text-white">
                  <span>Total Boarding Cost:</span>
                  <span>Rs. {totalCost}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow transition-all flex items-center justify-center gap-1.5"
            >
              <CalendarCheck size={18} />
              <span>Proceed to Booking Checkout</span>
            </button>

          </form>
        </div>

      </div>

      {/* PAYMENT MODAL (eSewa / Khalti) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Boarding Checkout</h3>
              {checkoutStep !== 4 && (
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {checkoutStep === 1 && (
                /* Step 1: Gateway and price summary */
                <div className="space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-2xl space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pet Name:</span>
                      <span className="font-bold">{petName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Days:</span>
                      <span className="font-bold">{daysCount} Days</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-slate-900 dark:text-white">
                      <span>Total Amount:</span>
                      <span>Rs. {totalCost}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Choose Payment Gateway</label>
                    <div className="grid grid-cols-2 gap-4">
                      
                      <button 
                        type="button"
                        onClick={() => setPaymentGateway('esewa')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${paymentGateway === 'esewa' ? 'border-pet-green-500 bg-pet-green-50/20 shadow-sm ring-1 ring-pet-green-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                      >
                        <span className="text-sm font-extrabold text-green-600">eSewa Wallet</span>
                        <span className="text-[10px] text-slate-400">Merchant Gateway</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setPaymentGateway('khalti')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-1.5 transition-all ${paymentGateway === 'khalti' ? 'border-purple-500 bg-purple-50/20 shadow-sm ring-1 ring-purple-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                      >
                        <span className="text-sm font-extrabold text-purple-600">Khalti Wallet</span>
                        <span className="text-[10px] text-slate-400">Merchant Gateway</span>
                      </button>

                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-slate-700/60 p-3.5 border border-amber-100 dark:border-slate-600 rounded-2xl flex items-start space-x-2 text-[11px] text-amber-800 dark:text-slate-400">
                    <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                    <span>Boarding service requires prepayment verification. COD is not supported.</span>
                  </div>

                  <button
                    onClick={handleWalletPayment}
                    className="w-full bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:from-pet-sky-600 hover:to-pet-sky-700"
                  >
                    Proceed to Wallet Payment
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                /* Step 2: Wallet Details */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h4 className={`text-base font-bold uppercase tracking-wider ${paymentGateway === 'esewa' ? 'text-green-600' : 'text-purple-600'}`}>
                      {paymentGateway === 'esewa' ? 'eSewa Merchant Checkout' : 'Khalti Payment Portal'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pay Rs. {totalCost} from your wallet</p>
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
                      onClick={() => setCheckoutStep(1)}
                      className="w-1/2 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleWalletPayment}
                      disabled={isPaying}
                      className="w-1/2 py-3 bg-gradient-to-r from-pet-sky-500 to-pet-sky-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-sky-600 hover:to-pet-sky-700 disabled:opacity-50"
                    >
                      {isPaying ? 'Authenticating...' : 'Send OTP Code'}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 3 && (
                /* Step 3: OTP Verification */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Security Verification</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Enter the 6-digit confirmation OTP sent to your phone</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">OTP Code</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white font-mono text-center tracking-widest text-lg font-bold"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-1/2 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl font-bold text-sm hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleWalletPayment}
                      disabled={isPaying}
                      className="w-1/2 py-3 bg-gradient-to-r from-pet-green-500 to-pet-green-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-green-600 hover:to-pet-green-700 disabled:opacity-50"
                    >
                      {isPaying ? 'Confirming...' : 'Verify & Pay'}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 4 && receipt && (
                /* Step 4: Receipt view */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-pet-green-100 rounded-full flex items-center justify-center text-pet-green-500 mx-auto">
                      <Check size={26} className="stroke-[3]" />
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Boarding Confirmed!</h4>
                    <p className="text-xs text-slate-400">Your boarding booking has been successfully processed.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800 space-y-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between font-bold border-b pb-2">
                      <span>Receipt ID:</span>
                      <span className="text-slate-900 dark:text-white">{receipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pet Name:</span>
                      <span>{receipt.petName} ({receipt.petType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-In:</span>
                      <span>{receipt.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-Out:</span>
                      <span>{receipt.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{receipt.daysCount} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gateway:</span>
                      <span className="capitalize">{receipt.paymentGateway} Wallet</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-slate-900 dark:text-white">
                      <span>Grand Total:</span>
                      <span>Rs. {receipt.totalCost}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowCheckout(false); setCheckoutStep(1); setReceipt(null); }}
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
