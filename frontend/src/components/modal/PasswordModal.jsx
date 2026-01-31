import React, { useState } from 'react';
import { MdLock, MdClose } from 'react-icons/md';

const PasswordModal = ({ isOpen, roomName, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword(''); // Clear for next time
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center white/30  p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-bold text-slate-800">Private Room</h3>
          <button onClick={onCancel} className="text-red-400 hover:text-red-600">
            <MdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <MdLock size={24} />
            </div>
            <p className="text-sm text-slate-500 text-center">
              Please enter the password to join <br />
              <span className="font-bold text-slate-700">"{roomName}"</span>
            </p>
          </div>

          <input
            type="password"
            autoFocus
            required
            placeholder="Enter password"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-50 font-semibold text-red-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-2 py-2.5 bg-slate-50 text-green-500 text-l font-semibold rounded-xl hover:bg-slate-100 transition-all"
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