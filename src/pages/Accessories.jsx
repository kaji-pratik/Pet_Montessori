import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Star, Plus, Minus, Trash2, X, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { db } from '../services/db';

export default function Accessories({ cart, wishlist, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, triggerNotification, user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const showCartDrawer = searchParams.get('cart') === 'open';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPetType, setSelectedPetType] = useState('all'); // all, dog, cat
  const [selectedCategory, setSelectedCategory] = useState('all'); // all, Food, Beds, Bowls, Toys, Leashes, Grooming, Litter, Carriers, Clothes, Scratching Posts
  const [priceFilter, setPriceFilter] = useState('all');

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryName, setDeliveryName] = useState(user?.name || '');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [deliveryEmail, setDeliveryEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, esewa, khalti
  
  // Wallet states
  const [walletPhone, setWalletPhone] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [otp, setOtp] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Delivery Form, 2: Wallet Login (if eSewa/Khalti), 3: OTP, 4: Receipt
  const [isPaying, setIsPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const list = await db.getProducts();
    setProducts(list);
    setFilteredProducts(list);
    setLoading(false);
  };

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedPetType !== 'all') {
      result = result.filter(p => p.type === selectedPetType);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || p.name.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (priceFilter !== 'all') {
      result = result.filter(p => {
        if (priceFilter === 'under1500') return p.price < 1500;
        if (priceFilter === '1500to3000') return p.price >= 1500 && p.price <= 3000;
        if (priceFilter === 'above3000') return p.price > 3000;
        return true;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedPetType, selectedCategory, priceFilter, products]);

  const closeCart = () => {
    searchParams.delete('cart');
    setSearchParams(searchParams);
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      triggerNotification('Please log in to purchase accessories.', 'error');
      closeCart();
      return;
    }
    setDeliveryName(user.name || '');
    setDeliveryEmail(user.email || '');
    setDeliveryPhone(user.phone || '');
    setDeliveryAddress(user.address || '');
    setWalletPhone(user.phone || '');
    setWalletPin('');
    setOtp('');
    setCheckoutStep(1);
    setShowCheckout(true);
    closeCart();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryName || !deliveryPhone || !deliveryEmail || !deliveryAddress) {
      triggerNotification('Please complete delivery information.', 'error');
      return;
    }

    if (paymentMethod === 'cod') {
      setIsPaying(true);
      setTimeout(async () => {
        const rcptId = 'ORD-' + Math.floor(Math.random() * 89999999 + 10000000);
        
        const newOrder = {
          txnId: rcptId,
          items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
          totalAmount: cartTotal,
          buyerName: deliveryName,
          buyerEmail: deliveryEmail,
          buyerPhone: deliveryPhone,
          address: deliveryAddress,
          paymentGateway: 'Cash on Delivery',
          paymentStatus: 'Pending',
          status: 'Pending',
          type: 'accessory'
        };

        await db.saveOrder(newOrder);

        // Update Stock
        for (let item of cart) {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            await db.saveProduct({ ...prod, stock: Math.max(0, prod.stock - item.quantity) });
          }
        }

        await db.createNotification({
          userId: user.id,
          title: 'Accessory Order Received',
          message: `Your order ${rcptId} has been placed. Payment method: Cash on Delivery.`
        });

        triggerNotification(`Order placed successfully via COD! Receipt ID: ${rcptId}`);
        setReceipt(newOrder);
        clearCart();
        setIsPaying(false);
        setCheckoutStep(4);
        loadProducts(); // Refresh stocks
      }, 1000);
    } else {
      // Wallet Gateway flow (eSewa / Khalti)
      setCheckoutStep(2);
    }
  };

  const handleWalletConfirm = () => {
    if (checkoutStep === 2) {
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
        triggerNotification('Please input the confirmation OTP.', 'error');
        return;
      }
      setIsPaying(true);
      setTimeout(async () => {
        const rcptId = 'ORD-' + Math.floor(Math.random() * 89999999 + 10000000);

        const newOrder = {
          txnId: rcptId,
          items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
          totalAmount: cartTotal,
          buyerName: deliveryName,
          buyerEmail: deliveryEmail,
          buyerPhone: deliveryPhone,
          address: deliveryAddress,
          paymentGateway: paymentMethod,
          paymentStatus: 'Paid',
          status: 'Processing',
          type: 'accessory'
        };

        await db.saveOrder(newOrder);

        // Update Stock
        for (let item of cart) {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            await db.saveProduct({ ...prod, stock: Math.max(0, prod.stock - item.quantity) });
          }
        }

        await db.createNotification({
          userId: user.id,
          title: 'Accessory Order Paid',
          message: `Your payment of Rs. ${cartTotal} for order ${rcptId} is verified.`
        });

        triggerNotification(`Payment verified. Order confirmed! 🐾`);
        setReceipt(newOrder);
        clearCart();
        setIsPaying(false);
        setCheckoutStep(4);
        loadProducts(); // Refresh stocks
      }, 1200);
    }
  };

  const categories = ['all', 'Food', 'Beds', 'Bowls', 'Toys', 'Leashes', 'Grooming', 'Litter', 'Carriers', 'Clothes', 'Scratching Posts'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 relative">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-pet-sky-500 uppercase tracking-widest font-mono">🛒 Pet Essentials</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">Accessories Marketplace</h1>
        <p className="text-sm text-slate-400">Shop premium food, plush beds, non-toxic toys, grooming brushes, and winter coats for dogs and cats.</p>
      </div>

      {/* Category Tabs & Quick Filters */}
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
            placeholder="Search products..."
            className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-xs sm:text-sm outline-none dark:text-white font-medium"
          />
        </div>

        {/* Pet Filter */}
        <div>
          <select
            value={selectedPetType}
            onChange={(e) => setSelectedPetType(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Species (Dogs & Cats)</option>
            <option value="dog">Dog Accessories Only</option>
            <option value="cat">Cat Accessories Only</option>
          </select>
        </div>

        {/* Category List */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white capitalize font-semibold"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Slider */}
        <div>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl text-xs sm:text-sm outline-none dark:text-white font-semibold"
          >
            <option value="all">All Prices</option>
            <option value="under1500">Under Rs. 1,500</option>
            <option value="1500to3000">Rs. 1,500 - Rs. 3,000</option>
            <option value="above3000">Above Rs. 3,000</option>
          </select>
        </div>

      </div>

      {/* E-commerce grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl p-4 space-y-4 animate-pulse border border-slate-100 dark:border-slate-700">
              <div className="h-44 bg-slate-200 dark:bg-slate-750 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-750 rounded w-2/3"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-750 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
          <p className="text-slate-400 text-sm font-semibold">No products matches these shopping filters. 🐾</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isWish = wishlist.some(w => w.id === prod.id);
            const lowStock = prod.stock > 0 && prod.stock <= 5;
            const outOfStock = prod.stock === 0;

            return (
              <div key={prod.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full border border-slate-100 dark:border-slate-700">
                
                {/* Product Image and Actions */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <button 
                    onClick={() => toggleWishlist(prod)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition-all z-10"
                    aria-label="Wishlist"
                  >
                    <Heart size={16} fill={isWish ? "currentColor" : "none"} />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-full text-[10px] font-bold text-pet-orange-500 shadow-sm uppercase tracking-wide">
                    Rs. {prod.price}
                  </div>

                  {/* Stock status indicator */}
                  <div className="absolute top-3 left-3">
                    {outOfStock ? (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow">Sold Out</span>
                    ) : lowStock ? (
                      <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow">Low Stock ({prod.stock})</span>
                    ) : (
                      <span className="bg-pet-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow">In Stock</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{prod.type} • {prod.category}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">{prod.name}</h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{prod.description}</p>

                  <div className="flex items-center space-x-1 text-xs text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{prod.rating}</span>
                  </div>

                  <div className="pt-2 mt-auto">
                    <button 
                      onClick={() => addToCart(prod)}
                      disabled={outOfStock}
                      className="w-full text-center bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-2.5 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={14} />
                      <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* SHOPPING CART DRAWER (RIGHT PANEL) */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md shadow-2xl h-full flex flex-col animate-slide-left border-l border-slate-100 dark:border-slate-700">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="text-pet-orange-500" />
                <span>Shopping Cart</span>
              </h3>
              <button 
                onClick={closeCart}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <p className="text-slate-400 text-sm">Your shopping cart is currently empty. 🐾</p>
                  <button 
                    onClick={closeCart}
                    className="text-xs font-bold text-pet-orange-500 hover:text-pet-orange-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-3.5 bg-slate-50 dark:bg-slate-700/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-xs text-pet-orange-500 font-extrabold mt-0.5">Rs. {item.price}</p>
                      
                      {/* Quantity adjustments */}
                      <div className="flex items-center space-x-2.5 mt-2">
                        <button 
                          onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 bg-white dark:bg-slate-755 border rounded hover:bg-slate-100 dark:border-slate-600"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="p-1 bg-white dark:bg-slate-755 border rounded hover:bg-slate-100 dark:border-slate-600"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom pricing */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 space-y-4 shrink-0 bg-slate-50 dark:bg-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Shipping:</span>
                  <span className="font-bold text-pet-green-500">FREE DELIVERY</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-extrabold text-base text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span>Rs. {cartTotal}</span>
                </div>

                <button 
                  onClick={handleOpenCheckout}
                  className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* RETAIL ACCESSORIES CHECKOUT MODAL W/ COD SUPPORT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Accessory Checkout Wizard</h3>
              {checkoutStep !== 4 && (
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-5 flex-grow">
              
              {checkoutStep === 1 && (
                /* Step 1: Delivery Details & Payment Select */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide border-b pb-2">1. Delivery Address</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Recipient Name *</label>
                      <input
                        type="text"
                        required
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Delivery Email *</label>
                    <input
                      type="email"
                      required
                      value={deliveryEmail}
                      onChange={(e) => setDeliveryEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                    />
                  </div>

                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide border-b pb-2 pt-2">2. Select Payment Method</h4>
                  <div className="grid grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 border rounded-2xl flex flex-col items-center gap-1 transition-all ${paymentMethod === 'cod' ? 'border-pet-orange-500 bg-pet-orange-50/20 shadow-sm ring-1 ring-pet-orange-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                    >
                      <Truck className="text-pet-orange-500" size={20} />
                      <span className="text-[10px] font-bold">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 border rounded-2xl flex flex-col items-center gap-1 transition-all ${paymentMethod === 'esewa' ? 'border-pet-green-500 bg-pet-green-50/20 shadow-sm ring-1 ring-pet-green-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                    >
                      <CreditCard className="text-green-600" size={20} />
                      <span className="text-[10px] font-bold">eSewa Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 border rounded-2xl flex flex-col items-center gap-1 transition-all ${paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50/20 shadow-sm ring-1 ring-purple-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                    >
                      <CreditCard className="text-purple-600" size={20} />
                      <span className="text-[10px] font-bold">Khalti Wallet</span>
                    </button>

                  </div>

                  <div className="pt-4 border-t">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:from-pet-orange-600 hover:to-pet-orange-700"
                    >
                      {paymentMethod === 'cod' ? 'Place COD Order (Rs. ' + cartTotal + ')' : 'Proceed to Digital Wallet'}
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 2 && (
                /* Step 2: Wallet Details */
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h4 className={`text-base font-bold uppercase tracking-wider ${paymentMethod === 'esewa' ? 'text-green-600' : 'text-purple-600'}`}>
                      {paymentMethod === 'esewa' ? 'eSewa Merchant Checkout' : 'Khalti Payment Portal'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pay Rs. {cartTotal} from your wallet</p>
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
                      onClick={handleWalletConfirm}
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
                      onClick={handleWalletConfirm}
                      disabled={isPaying}
                      className="w-1/2 py-3 bg-gradient-to-r from-pet-green-500 to-pet-green-600 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pet-green-600 hover:to-pet-green-700 disabled:opacity-50"
                    >
                      {isPaying ? 'Confirming...' : 'Verify & Pay'}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 4 && receipt && (
                /* Step 4: Receipt */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-pet-green-100 rounded-full flex items-center justify-center text-pet-green-500 mx-auto">
                      <ShieldCheck size={26} className="stroke-[3]" />
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h4>
                    <p className="text-xs text-slate-400">Thank you for shopping at Pet Montessori. Here is your receipt.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50 dark:bg-slate-800 space-y-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between font-bold border-b pb-2">
                      <span>Order ID:</span>
                      <span className="text-slate-900 dark:text-white">{receipt.txnId}</span>
                    </div>
                    <div className="space-y-1.5 border-b pb-2">
                      <span className="font-bold">Items Purchased:</span>
                      {receipt.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between pl-2 text-slate-500">
                          <span>{i.name} (x{i.quantity})</span>
                          <span>Rs. {i.price * i.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <span>Gateway:</span>
                      <span className="capitalize">{receipt.paymentGateway}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span>{receipt.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="truncate max-w-[200px]">{receipt.address}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-extrabold text-slate-900 dark:text-white">
                      <span>Grand Total:</span>
                      <span>Rs. {receipt.totalAmount}</span>
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
