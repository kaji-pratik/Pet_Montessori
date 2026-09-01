import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, ShoppingCart, Heart, Bell, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { auth } from '../../services/auth';
import { db } from '../../services/db';

export default function Navbar({ cartCount, wishlistCount, isDarkMode, setIsDarkMode, user, setUser, triggerNotification }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    const list = await db.getNotifications();
    if (user) {
      setNotifications(list.filter(n => n.userId === 'all' || n.userId === user.id));
    } else {
      setNotifications(list.filter(n => n.userId === 'all'));
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    setShowProfileMenu(false);
    triggerNotification('Logged out successfully');
    navigate('/');
  };

  const markRead = async () => {
    if (user) {
      await db.markNotificationsRead(user.id);
    } else {
      await db.markNotificationsRead('all');
    }
    loadNotifications();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markRead();
    }
  };

  const activeLink = (path) => {
    return location.pathname === path 
      ? "text-pet-orange-500 font-bold border-b-2 border-pet-orange-500 pb-1"
      : "text-slate-600 dark:text-slate-300 hover:text-pet-sky-500 transition-colors duration-150";
  };

  const mobileActiveLink = (path) => {
    return location.pathname === path
      ? "block px-4 py-2 text-pet-orange-500 bg-pet-orange-50 dark:bg-slate-800 rounded-lg font-bold"
      : "block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg";
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-premium backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-pet-orange-500 text-white p-2 rounded-full shadow-md animate-bounce-slow">
              <PawPrint size={24} />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-pet-orange-500 via-pet-sky-500 to-pet-green-500 bg-clip-text text-transparent">
                Pet Montessori
              </span>
              <p className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider hidden sm:block">HAPPY DOGS & CATS</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className={activeLink('/')}>Home</Link>
            <Link to="/nutrition" className={activeLink('/nutrition')}>Nutrition</Link>
            <Link to="/adopt" className={activeLink('/adopt')}>Adoption</Link>
            <Link to="/buy" className={activeLink('/buy')}>Buy Pets</Link>
            <Link to="/sell" className={activeLink('/sell')}>Sell Pets</Link>
            <Link to="/donate" className={activeLink('/donate')}>Donate</Link>
            <Link to="/shop" className={activeLink('/shop')}>Accessories</Link>
            <Link to="/booking" className={activeLink('/booking')}>Pet Care</Link>
            <Link to="/about" className={activeLink('/about')}>About Us</Link>
            <Link to="/contact" className={activeLink('/contact')}>Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-150"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link */}
            <Link 
              to="/profile?tab=wishlist" 
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <Link 
              to="/shop?cart=open"
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pet-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 bg-pet-green-500 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 font-bold text-sm flex justify-between items-center">
                    <span>Notifications</span>
                    <button onClick={() => setNotifications([])} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Clear all</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!n.read ? 'bg-pet-sky-50/30 dark:bg-pet-sky-950/20' : ''}`}>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-2">{new Date(n.date).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-1.5 focus:outline-none"
                >
                  <img 
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"} 
                    alt="profile" 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-pet-sky-500 object-cover shadow-sm"
                  />
                  <ChevronDown size={14} className="text-slate-500 dark:text-slate-400 hidden sm:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-pet-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold"
                      >
                        <LayoutDashboard size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150"
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 py-4 px-6 space-y-2 animate-fade-in absolute w-full left-0 z-40 shadow-xl">
          <Link to="/" onClick={() => setIsOpen(false)} className={mobileActiveLink('/')}>Home</Link>
          <Link to="/nutrition" onClick={() => setIsOpen(false)} className={mobileActiveLink('/nutrition')}>Nutrition Guide</Link>
          <Link to="/adopt" onClick={() => setIsOpen(false)} className={mobileActiveLink('/adopt')}>Pet Adoption</Link>
          <Link to="/buy" onClick={() => setIsOpen(false)} className={mobileActiveLink('/buy')}>Buy Pets</Link>
          <Link to="/sell" onClick={() => setIsOpen(false)} className={mobileActiveLink('/sell')}>Sell Pets</Link>
          <Link to="/donate" onClick={() => setIsOpen(false)} className={mobileActiveLink('/donate')}>Donate Pets</Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className={mobileActiveLink('/shop')}>Accessories Store</Link>
          <Link to="/booking" onClick={() => setIsOpen(false)} className={mobileActiveLink('/booking')}>Pet Boarding Care</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className={mobileActiveLink('/about')}>About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className={mobileActiveLink('/contact')}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
}
