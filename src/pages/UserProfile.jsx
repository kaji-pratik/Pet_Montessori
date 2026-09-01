import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, ShoppingBag, Heart, FileText, CheckCircle, Clock, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { auth } from '../services/auth';
import { db } from '../services/db';

export default function UserProfile({ user, setUser, wishlist, toggleWishlist, addToCart, triggerNotification }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // History states
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    loadUserHistory();
  }, [user]);

  // Handle URL tab changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loadUserHistory = async () => {
    if (!user) return;
    setLoading(true);

    const bks = await db.getBookings();
    setBookings(bks.filter(b => b.ownerEmail?.toLowerCase() === user.email?.toLowerCase()));

    const ords = await db.getOrders();
    setOrders(ords.filter(o => o.buyerEmail?.toLowerCase() === user.email?.toLowerCase()));

    const adps = await db.getAdoptionRequests();
    setAdoptions(adps.filter(a => a.applicantEmail?.toLowerCase() === user.email?.toLowerCase()));

    setLoading(false);
  };

  const handleUpdateTab = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name) return;
    
    setIsSaving(true);
    try {
      const updatedUser = await auth.updateProfile({ name, phone, address });
      setUser(updatedUser);
      triggerNotification('Profile updated successfully! 🐾');
      setIsEditing(false);
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10">
      
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
            alt="avatar" 
            className="w-20 h-20 rounded-full border-4 border-pet-sky-100 dark:border-slate-600 object-cover shadow-sm"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pet-sky-50 dark:bg-slate-700/60 text-pet-sky-600 dark:text-pet-sky-300">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2 justify-center">
          <button 
            onClick={() => handleUpdateTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'profile' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
          >
            Profile Details
          </button>
          <button 
            onClick={() => handleUpdateTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'bookings' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
          >
            Boardings ({bookings.length})
          </button>
          <button 
            onClick={() => handleUpdateTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'orders' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => handleUpdateTab('adoptions')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'adoptions' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
          >
            Adoptions ({adoptions.length})
          </button>
          <button 
            onClick={() => handleUpdateTab('wishlist')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'wishlist' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
          >
            Wishlist ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Main Tab Details */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        
        {activeTab === 'profile' && (
          /* Profile Edit Tab */
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <User className="text-pet-orange-500" />
                <span>Personal Settings</span>
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-pet-orange-500 hover:text-pet-orange-600 flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Phone Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white disabled:opacity-75"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Default Delivery Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white disabled:opacity-75"
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-2 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setName(user?.name || ''); setPhone(user?.phone || ''); setAddress(user?.address || ''); }}
                    className="px-4 py-2 border rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-pet-orange-500 hover:bg-pet-orange-600 text-white rounded-xl text-xs font-bold shadow"
                  >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'bookings' && (
          /* Boardings Tab */
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4">
              <Calendar className="text-pet-green-500" />
              <span>Boarding Booking Logs</span>
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400">Loading bookings history...</p>
            ) : bookings.length === 0 ? (
              <p className="text-xs text-slate-400">You haven't booked any pet care sessions yet. 🐾</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(bk => (
                  <div key={bk.id} className="border border-slate-100 dark:border-slate-700 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 font-mono text-xs">
                      <p className="font-bold text-slate-950 dark:text-white text-sm">Receipt: {bk.id}</p>
                      <p>Pet: <strong className="text-slate-700 dark:text-slate-300">{bk.petName} ({bk.petType})</strong></p>
                      <p>Dates: <strong className="text-slate-700 dark:text-slate-300">{bk.checkIn} to {bk.checkOut} ({bk.daysCount} Days)</strong></p>
                      <p>Total Paid: <strong className="text-pet-orange-500">Rs. {bk.totalCost}</strong></p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${bk.status === 'Confirmed' ? 'bg-pet-green-50 text-pet-green-600' : 'bg-amber-50 text-amber-500'}`}>
                        {bk.status === 'Confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        <span>{bk.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          /* Orders Tab */
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4">
              <ShoppingBag className="text-pet-sky-500" />
              <span>Purchase Order Logs</span>
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-slate-400">No purchase records found. 🐾</p>
            ) : (
              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord.txnId} className="border border-slate-100 dark:border-slate-700 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 font-mono text-xs">
                      <p className="font-bold text-slate-950 dark:text-white text-sm">Receipt: {ord.txnId}</p>
                      {ord.type === 'pet' ? (
                        <p>Pet Purchased: <strong className="text-slate-700 dark:text-slate-300">{ord.petName}</strong></p>
                      ) : (
                        <p>Items: <strong className="text-slate-700 dark:text-slate-300">{ord.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}</strong></p>
                      )}
                      <p>Date: <strong className="text-slate-700 dark:text-slate-300">{new Date(ord.date).toLocaleDateString()}</strong></p>
                      <p>Paid Amount: <strong className="text-pet-orange-500">Rs. {ord.totalAmount || ord.price}</strong> ({ord.paymentGateway})</p>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${ord.status === 'Completed' || ord.status === 'Processing' ? 'bg-pet-green-50 text-pet-green-600' : 'bg-amber-50 text-amber-500'}`}>
                        <CheckCircle size={12} />
                        <span>{ord.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'adoptions' && (
          /* Adoptions Tab */
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4">
              <FileText className="text-pet-orange-500" />
              <span>Adoption Request statuses</span>
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400">Loading requests...</p>
            ) : adoptions.length === 0 ? (
              <p className="text-xs text-slate-400">You haven't submitted any adoption requests. 🐾</p>
            ) : (
              <div className="space-y-4">
                {adoptions.map(req => (
                  <div key={req.id} className="border border-slate-100 dark:border-slate-700 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center space-x-3.5">
                      <img src={req.petImage} alt="pet" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm text-slate-950 dark:text-white">Request ID: {req.id}</p>
                        <p className="text-xs text-slate-400">Target Companion: <strong>{req.petName}</strong></p>
                        <p className="text-[10px] text-slate-400">Applied: {new Date(req.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${req.status === 'Approved' ? 'bg-pet-green-50 text-pet-green-600' : req.status === 'Denied' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        {req.status === 'Approved' ? <CheckCircle size={12} /> : req.status === 'Denied' ? <Trash2 size={12} /> : <Clock size={12} />}
                        <span>{req.status}</span>
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          /* Wishlist Tab */
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b pb-4">
              <Heart className="text-red-500" />
              <span>My Saved Companions & Accessories</span>
            </h3>

            {wishlist.length === 0 ? (
              <p className="text-xs text-slate-400">Your wishlist is empty. Browse the shop or adoption list to save items. 🐾</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(item => {
                  const isProduct = item.id.startsWith('prod-');
                  const image = isProduct ? item.image : item.images[0];
                  const title = isProduct ? item.name : item.name;
                  const subtitle = isProduct ? item.category : item.breed;
                  const price = isProduct ? `Rs. ${item.price}` : item.purpose === 'sale' ? `Rs. ${item.price}` : 'Adoptable';

                  return (
                    <div key={item.id} className="bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm flex flex-col group relative">
                      <img src={image} alt="wish" className="h-44 w-full object-cover" />
                      
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="absolute top-2.5 right-2.5 bg-white dark:bg-slate-800 p-2 rounded-full text-red-500 shadow hover:scale-105 active:scale-95"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="p-4 flex flex-col flex-grow space-y-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{subtitle}</p>
                          <h4 className="font-bold text-sm text-slate-950 dark:text-white line-clamp-1 mt-0.5">{title}</h4>
                        </div>

                        <p className="text-xs font-bold text-pet-orange-500">{price}</p>
                        
                        <div className="pt-2 mt-auto">
                          {isProduct ? (
                            <button
                              onClick={() => addToCart(item)}
                              className="w-full text-center py-2 bg-pet-orange-500 hover:bg-pet-orange-600 text-white rounded-xl text-xs font-bold transition"
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateTab(item.purpose === 'sale' ? 'orders' : 'adoptions')}
                              className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold transition"
                            >
                              View Actions
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
