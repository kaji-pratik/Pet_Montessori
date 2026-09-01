import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, PawPrint, ShoppingBag, Calendar, Heart, MessageSquare, HelpCircle, Plus, Trash2, Check, X, ShieldAlert, Award } from 'lucide-react';
import { db } from '../services/db';

export default function AdminDashboard({ triggerNotification }) {
  const [activeTab, setActiveTab] = useState('analytics');

  // Database states
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [petsList, setPetsList] = useState([]);
  const [adoptionsList, setAdoptionsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [faqsList, setFaqsList] = useState([]);

  // Forms Toggle / Inputs
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', type: 'dog', breed: '', age: '', gender: 'Male', price: '', vaccination: 'Not Vaccinated', description: '', purpose: 'adoption', ownerName: 'Admin', ownerPhone: '+977-9801234567', ownerEmail: 'admin@petmontessori.com' });

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', type: 'dog', category: 'Food', price: '', stock: '', description: '' });

  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', content: '', rating: '5' });

  useEffect(() => {
    loadAllAdminData();
  }, [activeTab]);

  const loadAllAdminData = async () => {
    // Analytics
    const stats = await db.getAnalytics();
    setAnalytics(stats);

    // Users (from localStorage)
    const users = JSON.parse(localStorage.getItem('pet_montessori_users_db')) || [];
    setUsersList(users);

    // Pets
    const pets = await db.getPets();
    setPetsList(pets);

    // Adoptions
    const adoptions = await db.getAdoptionRequests();
    setAdoptionsList(adoptions);

    // Bookings
    const bookings = await db.getBookings();
    setBookingsList(bookings);

    // Orders
    const orders = await db.getOrders();
    setOrdersList(orders);

    // Accessories
    const products = await db.getProducts();
    setProductsList(products);

    // Testimonials
    const testimonials = await db.getTestimonials();
    setTestimonialsList(testimonials);

    // FAQs
    const faqs = await db.getFAQs();
    setFaqsList(faqs);
  };

  // Actions: Approval Logic
  const handleApprovePetListing = async (petId) => {
    const pet = petsList.find(p => p.id === petId);
    if (!pet) return;

    const updated = { ...pet, status: 'Approved' };
    await db.savePet(updated);
    
    // Create notifications for the seller
    const users = JSON.parse(localStorage.getItem('pet_montessori_users_db')) || [];
    const owner = users.find(u => u.email === pet.ownerEmail);
    if (owner) {
      await db.createNotification({
        userId: owner.id,
        title: 'Listing Approved',
        message: `Your pet listing for "${pet.name}" has been approved and is now live.`
      });
    }

    triggerNotification(`Approved pet listing for ${pet.name}!`);
    loadAllAdminData();
  };

  const handleApproveAdoption = async (reqId) => {
    const req = adoptionsList.find(r => r.id === reqId);
    if (!req) return;

    // Approve the request
    const updatedReq = { ...req, status: 'Approved' };
    await db.saveAdoptionRequest(updatedReq);

    // Mark the pet as Adopted
    const pet = petsList.find(p => p.id === req.petId);
    if (pet) {
      await db.savePet({ ...pet, status: 'Adopted' });
    }

    // Notify buyer
    const users = JSON.parse(localStorage.getItem('pet_montessori_users_db')) || [];
    const applicant = users.find(u => u.email === req.applicantEmail);
    if (applicant) {
      await db.createNotification({
        userId: applicant.id,
        title: 'Adoption Approved 🎉',
        message: `Congratulations! Your application to adopt ${req.petName} has been approved.`
      });
    }

    triggerNotification(`Adoption request approved for ${req.petName}!`);
    loadAllAdminData();
  };

  const handleRejectAdoption = async (reqId) => {
    const req = adoptionsList.find(r => r.id === reqId);
    if (!req) return;

    const updatedReq = { ...req, status: 'Denied' };
    await db.saveAdoptionRequest(updatedReq);

    triggerNotification('Adoption request rejected.', 'info');
    loadAllAdminData();
  };

  // Actions: Booking / Order completion
  const handleCompleteBooking = async (bkId) => {
    const bk = bookingsList.find(b => b.id === bkId);
    if (!bk) return;
    await db.saveBooking({ ...bk, status: 'Completed', paymentStatus: 'Paid' });
    triggerNotification(`Booking ${bkId} marked as Completed.`);
    loadAllAdminData();
  };

  const handleCompleteOrder = async (ordId) => {
    const ord = ordersList.find(o => o.txnId === ordId);
    if (!ord) return;
    await db.saveOrder({ ...ord, status: 'Completed', paymentStatus: 'Paid' });
    triggerNotification(`Order ${ordId} marked as Completed.`);
    loadAllAdminData();
  };

  // Actions: Add Listings CRUD
  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    const fallbackImage = newPet.type === 'dog' 
      ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
      : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800";

    const petItem = {
      ...newPet,
      price: newPet.purpose === 'sale' ? parseFloat(newPet.price || 0) : 0,
      images: [fallbackImage],
      status: 'Approved' // Admin lists are immediately approved
    };

    await db.savePet(petItem);
    triggerNotification(`Successfully added pet listing for ${newPet.name}`);
    setShowAddPet(false);
    setNewPet({ name: '', type: 'dog', breed: '', age: '', gender: 'Male', price: '', vaccination: 'Not Vaccinated', description: '', purpose: 'adoption', ownerName: 'Admin', ownerPhone: '+977-9801234567', ownerEmail: 'admin@petmontessori.com' });
    loadAllAdminData();
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const fallbackImage = newProduct.type === 'dog' 
      ? "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400"
      : "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&q=80&w=400";

    const prodItem = {
      name: newProduct.name,
      type: newProduct.type,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      description: newProduct.description,
      rating: 5,
      image: fallbackImage
    };

    await db.saveProduct(prodItem);
    triggerNotification(`Successfully added product: ${newProduct.name}`);
    setShowAddProduct(false);
    setNewProduct({ name: '', type: 'dog', category: 'Food', price: '', stock: '', description: '' });
    loadAllAdminData();
  };

  const handleAddFaqSubmit = async (e) => {
    e.preventDefault();
    await db.saveFAQ(newFaq);
    triggerNotification('Added new FAQ accordion.');
    setShowAddFaq(false);
    setNewFaq({ question: '', answer: '' });
    loadAllAdminData();
  };

  const handleAddTestimonialSubmit = async (e) => {
    e.preventDefault();
    await db.saveTestimonial({ ...newTestimonial, rating: parseInt(newTestimonial.rating) });
    triggerNotification('Added new Testimonial review.');
    setShowAddTestimonial(false);
    setNewTestimonial({ name: '', role: '', content: '', rating: '5' });
    loadAllAdminData();
  };

  // Actions: Deletion CRUD
  const handleDeletePet = async (petId) => {
    if (window.confirm('Delete this pet listing?')) {
      await db.deletePet(petId);
      triggerNotification('Pet listing deleted.', 'info');
      loadAllAdminData();
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Delete this accessory product?')) {
      await db.deleteProduct(prodId);
      triggerNotification('Accessory deleted.', 'info');
      loadAllAdminData();
    }
  };

  const handleDeleteFaq = async (id) => {
    await db.deleteFAQ(id);
    triggerNotification('FAQ deleted.', 'info');
    loadAllAdminData();
  };

  const handleDeleteTestimonial = async (id) => {
    await db.deleteTestimonial(id);
    triggerNotification('Testimonial deleted.', 'info');
    loadAllAdminData();
  };

  const handleDeleteUser = (userId) => {
    if (userId === 'user-admin') {
      triggerNotification('Cannot delete primary system Administrator!', 'error');
      return;
    }
    if (window.confirm('Delete this user account?')) {
      let users = JSON.parse(localStorage.getItem('pet_montessori_users_db')) || [];
      users = users.filter(u => u.id !== userId);
      localStorage.setItem('pet_montessori_users_db', JSON.stringify(users));
      triggerNotification('User account deleted.', 'info');
      loadAllAdminData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-pet-orange-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Configure database records, approve requests and review transaction logs.</p>
        </div>

        {/* Sidebar switcher buttons for desktop */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard size={14} /> },
            { id: 'users', label: 'Users', icon: <Users size={14} /> },
            { id: 'pets', label: 'Pets', icon: <PawPrint size={14} /> },
            { id: 'adoptions', label: 'Adoptions', icon: <Heart size={14} /> },
            { id: 'orders_bookings', label: 'Bookings & Orders', icon: <Calendar size={14} /> },
            { id: 'accessories', label: 'Shop Retail', icon: <ShoppingBag size={14} /> },
            { id: 'testimonials_faqs', label: 'Content', icon: <MessageSquare size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-pet-orange-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sections */}

      {activeTab === 'analytics' && analytics && (
        /* Analytics View */
        <div className="space-y-8 animate-fade-in">
          {/* Top Numbers Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Revenue", val: `Rs. ${analytics.totalRevenue}`, note: `Retail: Rs. ${analytics.productRevenue} | Care: Rs. ${analytics.bookingRevenue}`, color: "border-pet-green-500" },
              { title: "Active Boardings", val: analytics.totalBookingsCount, note: "Boarding Care Reservations", color: "border-pet-sky-500" },
              { title: "Accessories Orders", val: analytics.totalOrdersCount, note: "Shop Purchase Invoices", color: "border-pet-orange-500" },
              { title: "Adoptions Completed", val: analytics.adoptedPetsCount, note: "Rescue pets given home", color: "border-slate-400" }
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border-t-4 ${stat.color} shadow-sm space-y-2`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.val}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{stat.note}</p>
              </div>
            ))}
          </div>

          {/* Warnings / Pending counters */}
          {(analytics.pendingAdoptionsCount > 0 || analytics.pendingSellingCount > 0) && (
            <div className="bg-amber-50 dark:bg-slate-700/60 p-5 rounded-2xl border border-amber-200 dark:border-slate-600 flex items-start space-x-3 text-xs sm:text-sm text-amber-800 dark:text-slate-300">
              <ShieldAlert className="shrink-0 text-amber-500" />
              <div>
                <h4 className="font-bold">Pending Approvals Queue:</h4>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {analytics.pendingAdoptionsCount > 0 && <li><strong>{analytics.pendingAdoptionsCount}</strong> adoption requests are waiting for decision checks.</li>}
                  {analytics.pendingSellingCount > 0 && <li><strong>{analytics.pendingSellingCount}</strong> seller listings need review before going live.</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Visual CSS Chart Bar */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
            <h3 className="font-extrabold text-base border-b pb-2">Monthly Revenue Analytics (NPR)</h3>
            <div className="h-64 flex items-end justify-between gap-2.5 pt-6 relative border-b border-l border-slate-200 dark:border-slate-700 px-4">
              {analytics.monthlyRevenue.map((item, idx) => (
                <div key={idx} className="flex-grow flex flex-col items-center group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-2">Rs. {Math.round(item.revenue)}</span>
                  <div 
                    style={{ height: `${Math.max(10, (item.revenue / (analytics.totalRevenue || 1)) * 200)}px` }} 
                    className="w-8 sm:w-12 bg-gradient-to-t from-pet-sky-500 to-pet-sky-400 hover:from-pet-orange-500 hover:to-pet-orange-400 rounded-t-lg transition-all duration-300"
                  ></div>
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-300 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        /* Users List */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in shadow-sm">
          <div className="p-6 border-b font-extrabold text-slate-900 dark:text-white flex justify-between items-center bg-slate-50 dark:bg-slate-700/40">
            <span>Manage System Users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.phone || 'N/A'}</td>
                    <td className="p-4 capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.role === 'admin' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 truncate max-w-[150px]">{u.address || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pets' && (
        /* Pets & Listing Approvals */
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Active & Pending Pet Listings</h3>
            <button 
              onClick={() => setShowAddPet(!showAddPet)}
              className="bg-pet-orange-500 hover:bg-pet-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus size={16} />
              <span>Add Pet Listing</span>
            </button>
          </div>

          {/* Add Pet Form */}
          {showAddPet && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 animate-scale-up">
              <form onSubmit={handleAddPetSubmit} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-950 dark:text-white border-b pb-2">Add New Breeder/Shelter Pet</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Pet Name"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <select
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Breed"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Age (e.g. 3 Months)"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <select
                    value={newPet.gender}
                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select
                    value={newPet.purpose}
                    onChange={(e) => setNewPet({ ...newPet, purpose: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="adoption">Listed for Adoption</option>
                    <option value="sale">Listed for Sale</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price (NPR) - Only for Sale"
                    value={newPet.price}
                    onChange={(e) => setNewPet({ ...newPet, price: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <select
                    value={newPet.vaccination}
                    onChange={(e) => setNewPet({ ...newPet, vaccination: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="Not Vaccinated">Not Vaccinated</option>
                    <option value="First Dose Administered">First Dose Administered</option>
                    <option value="Fully Vaccinated">Fully Vaccinated</option>
                  </select>
                </div>

                <textarea
                  required
                  placeholder="Pet description..."
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white resize-none"
                  rows="3"
                />

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddPet(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-pet-orange-500 text-white rounded-xl text-xs font-bold shadow">Save Listing</button>
                </div>
              </form>
            </div>
          )}

          {/* Pets Grid Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                    <th className="p-4">Pet Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Breed</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Price/Fee</th>
                    <th className="p-4">Owner Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {petsList.map(pet => (
                    <tr key={pet.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                      <td className="p-4">
                        <img src={pet.images[0]} alt="pet" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{pet.name}</td>
                      <td className="p-4">{pet.breed} ({pet.type})</td>
                      <td className="p-4 capitalize">{pet.purpose}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {pet.purpose === 'sale' ? `Rs. ${pet.price}` : pet.fee > 0 ? `Rs. ${pet.fee}` : 'Free'}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-850 dark:text-white">{pet.ownerName}</p>
                        <p className="text-[10px] text-slate-400">{pet.ownerPhone}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${pet.status === 'Approved' ? 'bg-pet-green-50 text-pet-green-500' : pet.status === 'Sold' || pet.status === 'Adopted' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                          {pet.status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2">
                        {pet.status === 'Pending' && (
                          <button 
                            onClick={() => handleApprovePetListing(pet.id)}
                            className="bg-pet-green-500 hover:bg-pet-green-600 text-white p-1 rounded-lg"
                            title="Approve Selling Request"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeletePet(pet.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'adoptions' && (
        /* Adoption Requests */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in shadow-sm">
          <div className="p-6 border-b font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/40">
            <span>Verify & Approve Adoption Applications</span>
          </div>
          <div className="overflow-x-auto">
            {adoptionsList.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No adoption requests listed. 🐾</p>
            ) : (
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                    <th className="p-4">Pet Details</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Home Setting</th>
                    <th className="p-4">Reason/Motivation</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {adoptionsList.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                      <td className="p-4 flex items-center space-x-2">
                        <img src={req.petImage} alt="pet" className="w-9 h-9 rounded object-cover" />
                        <span className="font-bold text-slate-850 dark:text-white">{req.petName}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{req.applicantName}</td>
                      <td className="p-4">
                        <p>{req.applicantPhone}</p>
                        <p className="text-[10px] text-slate-400">{req.applicantEmail}</p>
                      </td>
                      <td className="p-4">
                        <p>{req.homeType}</p>
                        <p className="text-[10px] text-slate-400">Other Pets: {req.hasPets}</p>
                      </td>
                      <td className="p-4 truncate max-w-[150px]" title={req.motivation}>{req.motivation}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${req.status === 'Approved' ? 'bg-pet-green-50 text-pet-green-500' : req.status === 'Denied' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-1 shrink-0">
                        {req.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveAdoption(req.id)}
                              className="bg-pet-green-500 hover:bg-pet-green-600 text-white p-1 rounded-lg"
                              title="Approve adoption"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => handleRejectAdoption(req.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg"
                              title="Deny adoption"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders_bookings' && (
        /* Boardings & Accessory Orders Logs */
        <div className="grid grid-cols-1 gap-8 animate-fade-in">
          
          {/* Care Bookings */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/40">
              <span>Manage Boarding Bookings</span>
            </div>
            <div className="overflow-x-auto">
              {bookingsList.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-400">No care bookings found. 🐾</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                      <th className="p-4">Receipt ID</th>
                      <th className="p-4">Owner Name</th>
                      <th className="p-4">Pet details</th>
                      <th className="p-4">Check-in / Out</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                    {bookingsList.map(bk => (
                      <tr key={bk.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{bk.id}</td>
                        <td className="p-4 font-semibold">{bk.ownerName} ({bk.ownerPhone})</td>
                        <td className="p-4 capitalize">{bk.petName} ({bk.petType} - {bk.breed})</td>
                        <td className="p-4">{bk.checkIn} to {bk.checkOut} ({bk.daysCount} Days)</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Rs. {bk.totalCost}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${bk.status === 'Completed' || bk.status === 'Confirmed' ? 'bg-pet-green-50 text-pet-green-500' : 'bg-amber-50 text-amber-500'}`}>
                            {bk.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {bk.status === 'Confirmed' && (
                            <button 
                              onClick={() => handleCompleteBooking(bk.id)}
                              className="text-pet-green-600 hover:text-pet-green-700 font-bold hover:underline"
                            >
                              Mark Completed
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Retail Orders */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/40">
              <span>Manage Store Accessory Invoices</span>
            </div>
            <div className="overflow-x-auto">
              {ordersList.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-400">No invoice logs found. 🐾</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Delivery Address</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                    {ordersList.map(ord => (
                      <tr key={ord.txnId} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.txnId}</td>
                        <td className="p-4 font-semibold">
                          <p>{ord.buyerName}</p>
                          <p className="text-[10px] text-slate-400">{ord.buyerPhone}</p>
                        </td>
                        <td className="p-4 truncate max-w-[150px]">{ord.address || 'N/A'}</td>
                        <td className="p-4 capitalize">{ord.paymentGateway} ({ord.paymentStatus})</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Rs. {ord.totalAmount || ord.price}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${ord.status === 'Completed' ? 'bg-pet-green-50 text-pet-green-500' : 'bg-amber-50 text-amber-500'}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {ord.status === 'Pending' && (
                            <button 
                              onClick={() => handleCompleteOrder(ord.txnId)}
                              className="text-pet-green-600 hover:text-pet-green-700 font-bold hover:underline"
                            >
                              Deliver & Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'accessories' && (
        /* Products / Accessories management */
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Products Inventory</h3>
            <button 
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-pet-orange-500 hover:bg-pet-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 animate-scale-up">
              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <h4 className="font-bold text-sm text-slate-950 dark:text-white border-b pb-2">Add New Accessory</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="dog">Dog Category</option>
                    <option value="cat">Cat Category</option>
                  </select>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                  >
                    <option value="Food">Food</option>
                    <option value="Beds">Beds</option>
                    <option value="Bowls">Bowls</option>
                    <option value="Toys">Toys</option>
                    <option value="Leashes">Leashes</option>
                    <option value="Grooming Kits">Grooming Kits</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Scratching Posts">Scratching Posts</option>
                    <option value="Carriers">Carriers</option>
                    <option value="Litter Boxes">Litter Boxes</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    required
                    placeholder="Price (NPR)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Stock Quantity"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                </div>

                <textarea
                  required
                  placeholder="Product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white resize-none"
                  rows="3"
                />

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 border rounded-xl text-xs font-semibold">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-pet-orange-500 text-white rounded-xl text-xs font-bold shadow">Save Product</button>
                </div>
              </form>
            </div>
          )}

          {/* Products Grid Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-400 border-b border-slate-100 dark:border-slate-700 font-bold">
                    <th className="p-4">Image</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Species & Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {productsList.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 text-slate-500 dark:text-slate-350">
                      <td className="p-4">
                        <img src={prod.image} alt="prod" className="w-10 h-10 rounded object-cover bg-slate-100" />
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{prod.name}</td>
                      <td className="p-4 capitalize">{prod.type} • {prod.category}</td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white">Rs. {prod.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${prod.stock === 0 ? 'bg-red-50 text-red-500' : prod.stock <= 5 ? 'bg-amber-50 text-amber-500' : 'bg-pet-green-50 text-pet-green-500'}`}>
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} Units`}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testimonials_faqs' && (
        /* FAQS & Testimonials Content CRUD */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          
          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="text-pet-sky-500" />
                <span>Frequently Asked Questions</span>
              </h4>
              <button 
                onClick={() => setShowAddFaq(!showAddFaq)}
                className="p-1 text-pet-sky-500 hover:bg-slate-100 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            {showAddFaq && (
              <form onSubmit={handleAddFaqSubmit} className="bg-slate-50 dark:bg-slate-800 p-4 border rounded-2xl space-y-3 animate-scale-up">
                <input
                  type="text"
                  required
                  placeholder="FAQ Question"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                />
                <textarea
                  required
                  placeholder="FAQ Answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white resize-none"
                  rows="2"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddFaq(false)} className="px-3 py-1.5 border rounded-lg text-[10px] font-semibold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-pet-sky-500 text-white rounded-lg text-[10px] font-bold shadow">Save FAQ</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {faqsList.map(faq => (
                <div key={faq.id} className="p-4 border rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Q: {faq.question}</p>
                    <p className="text-slate-400 mt-1">A: {faq.answer}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-red-500 shrink-0 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="text-pet-green-500" />
                <span>Testimonials & Reviews</span>
              </h4>
              <button 
                onClick={() => setShowAddTestimonial(!showAddTestimonial)}
                className="p-1 text-pet-green-500 hover:bg-slate-100 rounded-lg"
              >
                <Plus size={18} />
              </button>
            </div>

            {showAddTestimonial && (
              <form onSubmit={handleAddTestimonialSubmit} className="bg-slate-50 dark:bg-slate-800 p-4 border rounded-2xl space-y-3 animate-scale-up">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Reviewer Name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Role (e.g. Dog Owner)"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white"
                  />
                </div>
                <textarea
                  required
                  placeholder="Review content..."
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white resize-none"
                  rows="2"
                />
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs outline-none dark:text-white font-semibold"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddTestimonial(false)} className="px-3 py-1.5 border rounded-lg text-[10px] font-semibold">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-pet-green-500 text-white rounded-lg text-[10px] font-bold shadow">Save Review</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {testimonialsList.map(test => (
                <div key={test.id} className="p-4 border rounded-2xl bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 flex justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{test.name} ({test.role})</p>
                    <p className="text-slate-450 mt-1 italic">"{test.content}"</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteTestimonial(test.id)}
                    className="text-red-500 shrink-0 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
