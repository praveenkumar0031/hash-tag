import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLockOutline, MdKey, MdArrowBack } from 'react-icons/md';
import { FaSlackHash } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_API;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${backendUrl}/user/forget`, { email });
      setMessage({ type: 'success', text: response.data.message || 'OTP sent to your email!' });
      setStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${backendUrl}/user/reset`, { email, otp, newPassword });
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid OTP or error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 selection:bg-indigo-100 overflow-x-hidden font-sans relative">
      
      {/* Soft Light Mode Accents from Login UI */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-50/50 blur-[120px] pointer-events-none"></div>

      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-7 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10">
        
        {/* Header with Hash Icon */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <Link to="/login" className="self-start text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest mb-4 transition-colors">
            <MdArrowBack size={16}/> Back
          </Link>
          <div className="p-3 bg-slate-50 rounded-2xl mb-3 border border-slate-100 shadow-sm">
             <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={28} />
          </div>
          <h2 className="text-slate-800 text-2xl md:text-3xl font-black tracking-tight text-center">
            {step === 1 ? 'Forgot Password' : 'New Credentials'}
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1 text-center">
            {step === 1 ? "Get back into the conversation" : "Set your new security key"}
          </p>
        </div>

        {message.text && (
          <div className={`mb-5 p-3.5 rounded-2xl text-[11px] font-bold text-center animate-in fade-in zoom-in duration-300 ${
            message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="relative group">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="email" 
                required
                placeholder="Email address"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-50 text-sm mt-2"
            >
              {loading ? "Sending OTP..." : "Request Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative group">
              <MdKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text" 
                required
                maxLength="6"
                placeholder="6-Digit OTP"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold tracking-[0.3em]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="relative group">
              <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="password" 
                required
                placeholder="New password"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-50 text-sm mt-2"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-slate-400 font-bold text-xs hover:text-indigo-600 transition-all underline underline-offset-4 decoration-slate-200"
            >
              Didn't receive code? Try again
            </button>
          </form>
        )}
      </div>

      <style>{`
        body { background-color: #f8fafc; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;