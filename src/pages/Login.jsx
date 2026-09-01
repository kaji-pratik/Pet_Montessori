import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, KeyRound, PawPrint } from 'lucide-react';
import { auth } from '../services/auth';

export default function Login({ setUser, triggerNotification }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Forgot Password Field
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Log in
        const sessionUser = await auth.login(email, password);
        setUser(sessionUser);
        triggerNotification(`Welcome back, ${sessionUser.name}! 🐾`);
        navigate(redirect);
      } else {
        // Sign up
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        const sessionUser = await auth.signup(name, email, password, { phone, address });
        setUser(sessionUser);
        triggerNotification('Account registered successfully! 🐾');
        navigate(redirect);
      }
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    setLoading(true);
    setTimeout(() => {
      triggerNotification(`Reset link successfully sent to ${forgotEmail}`, 'info');
      setForgotEmail('');
      setShowForgot(false);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-700">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-pet-orange-500 text-white rounded-full flex items-center justify-center shadow-md animate-bounce-slow">
            <PawPrint size={26} />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {showForgot ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            {showForgot 
              ? 'Enter your email to receive recovery instructions.' 
              : isLogin 
                ? 'Your Trusted Home for Happy Dogs & Cats.' 
                : 'Join the Pet Montessori community today.'}
          </p>
        </div>

        {/* Auth Toggles */}
        {!showForgot && (
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm font-bold rounded-full transition-all duration-200 ${isLogin ? 'bg-white dark:bg-slate-800 text-pet-orange-500 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm font-bold rounded-full transition-all duration-200 ${!isLogin ? 'bg-white dark:bg-slate-800 text-pet-orange-500 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Register
            </button>
          </div>
        )}

        {showForgot ? (
          /* Forgot Password form */
          <form className="mt-8 space-y-6" onSubmit={handleForgotSubmit}>
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pet-orange-500 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-pet-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition mt-2 text-center"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          /* Standard Login & Registration forms */
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              /* Register Fields */
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977-98XXXXXXXX"
                      className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Delivery Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Kathmandu, Nepal"
                      className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email & Password */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sita@gmail.com"
                    className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password *</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-semibold text-pet-sky-500 hover:text-pet-sky-600 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-pet-orange-500 rounded-2xl w-full text-sm outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Hint Box */}
            {isLogin && (
              <div className="bg-pet-sky-50 dark:bg-slate-700/50 border border-pet-sky-100 dark:border-slate-600 p-3 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400">
                <p className="font-bold mb-1 text-pet-sky-600">Quick Test Credentials:</p>
                <p>• Admin: <span className="font-semibold">admin@petmontessori.com</span> / password: <span className="font-semibold">admin123</span></p>
                <p>• Standard: <span className="font-semibold">sita@gmail.com</span> / password: <span className="font-semibold">user123</span></p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pet-orange-500 to-pet-orange-600 hover:from-pet-orange-600 hover:to-pet-orange-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all duration-150 disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
