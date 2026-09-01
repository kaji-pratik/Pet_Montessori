import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages Import
import Home from './pages/Home';
import Nutrition from './pages/Nutrition';
import PetAdoption from './pages/PetAdoption';
import BuyPets from './pages/BuyPets';
import SellPets from './pages/SellPets';
import DonatePets from './pages/DonatePets';
import Accessories from './pages/Accessories';
import Booking from './pages/Booking';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Custom Toast Component for feedback
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-pet-sky-500' : 'bg-pet-green-500';

  return (
    <div className={`fixed bottom-5 right-5 z-50 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 transition-all duration-300 transform translate-y-0 scale-100 ${bgClass} font-sans text-sm font-semibold`}>
      <span>🐾</span>
      <span>{message}</span>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  // Initialize state
  useEffect(() => {
    // Theme
    const darkSetting = localStorage.getItem('pet_montessori_dark_mode') === 'true';
    setIsDarkMode(darkSetting);
    if (darkSetting) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // User Session
    const activeUser = localStorage.getItem('pet_montessori_current_user');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }

    // Cart and Wishlist
    const localCart = localStorage.getItem('pet_montessori_cart');
    const localWishlist = localStorage.getItem('pet_montessori_wishlist');
    if (localCart) setCart(JSON.parse(localCart));
    if (localWishlist) setWishlist(JSON.parse(localWishlist));
  }, []);

  // Update Theme DOM
  useEffect(() => {
    localStorage.setItem('pet_montessori_dark_mode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync Cart
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('pet_montessori_cart', JSON.stringify(newCart));
  };

  // Sync Wishlist
  const saveWishlist = (newWish) => {
    setWishlist(newWish);
    localStorage.setItem('pet_montessori_wishlist', JSON.stringify(newWish));
  };

  const triggerNotification = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      const updated = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: Math.min(item.stock, item.quantity + qty) } 
          : item
      );
      saveCart(updated);
      triggerNotification(`${product.name} quantity updated in Cart`);
    } else {
      saveCart([...cart, { ...product, quantity: qty }]);
      triggerNotification(`${product.name} added to Cart`);
    }
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter(item => item.id !== productId);
    saveCart(updated);
    triggerNotification('Item removed from Cart', 'info');
  };

  const updateCartQuantity = (productId, qty) => {
    const updated = cart.map(item => 
      item.id === productId ? { ...item, quantity: qty } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (item) => {
    const inWish = wishlist.find(w => w.id === item.id);
    if (inWish) {
      const updated = wishlist.filter(w => w.id !== item.id);
      saveWishlist(updated);
      triggerNotification(`${item.name || item.breed} removed from Wishlist`, 'info');
    } else {
      saveWishlist([...wishlist, item]);
      triggerNotification(`${item.name || item.breed} added to Wishlist`);
    }
  };

  // Protected Route guards
  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login?redirect=admin" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
  };

  const PrivateRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar 
          cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} 
          wishlistCount={wishlist.length} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          user={user} 
          setUser={setUser} 
          triggerNotification={triggerNotification}
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home triggerNotification={triggerNotification} toggleWishlist={toggleWishlist} wishlist={wishlist} addToCart={addToCart} />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/adopt" element={<PetAdoption wishlist={wishlist} toggleWishlist={toggleWishlist} triggerNotification={triggerNotification} />} />
            <Route path="/buy" element={<BuyPets wishlist={wishlist} toggleWishlist={toggleWishlist} user={user} triggerNotification={triggerNotification} />} />
            <Route path="/sell" element={<PrivateRoute><SellPets user={user} triggerNotification={triggerNotification} /></PrivateRoute>} />
            <Route path="/donate" element={<PrivateRoute><DonatePets user={user} triggerNotification={triggerNotification} /></PrivateRoute>} />
            
            <Route path="/shop" element={
              <Accessories 
                cart={cart} 
                wishlist={wishlist}
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
                updateCartQuantity={updateCartQuantity}
                clearCart={clearCart}
                toggleWishlist={toggleWishlist}
                triggerNotification={triggerNotification}
                user={user}
              />
            } />
            
            <Route path="/booking" element={<PrivateRoute><Booking user={user} triggerNotification={triggerNotification} /></PrivateRoute>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact triggerNotification={triggerNotification} />} />
            <Route path="/login" element={<Login setUser={setUser} triggerNotification={triggerNotification} />} />
            
            <Route path="/profile" element={<PrivateRoute><UserProfile user={user} setUser={setUser} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} triggerNotification={triggerNotification} /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard triggerNotification={triggerNotification} /></AdminRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer triggerNotification={triggerNotification} />
        
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </BrowserRouter>
  );
}
