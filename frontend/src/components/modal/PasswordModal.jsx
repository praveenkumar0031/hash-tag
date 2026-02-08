import React, { useState } from 'react';
import { MdLock, MdClose } from 'react-icons/md';

const PasswordModal = ({ isOpen, roomName, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword(''); 
  };

  return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-[28px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
      
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Private Room
        </h3>
        <button 
          onClick={onCancel} 
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
        >
          <MdClose size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Icon & Message */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-4 rotate-3 transform">
              <MdLock size={32} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-sm text-slate-500">Access Restricted</p>
            <p className="text-[15px] text-slate-700 font-medium">
              Enter password for <span className="text-indigo-600 font-bold">"{roomName}"</span>
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative mb-6">
          <input
            type="password"
            autoFocus
            required
            placeholder="••••••••"
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-center tracking-[0.3em] font-bold text-slate-700 placeholder:tracking-normal placeholder:font-normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-2xl transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3.5 bg-indigo-600 font-bold text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default PasswordModal;