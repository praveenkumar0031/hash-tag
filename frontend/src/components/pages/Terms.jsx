import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSlackHash, FaUserShield, FaRegHandPeace } from 'react-icons/fa';
import { MdCheckCircle, MdErrorOutline, MdAutoDelete, MdGavel } from 'react-icons/md';

const Terms = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = (e) => {
    e.preventDefault();
    if (agreed) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 flex flex-col overflow-x-hidden">
      
      {/* TOP DECORATIVE BAR */}
      <div className="flex h-1.5 w-full fixed top-0 z-50">
        <div className="flex-1 bg-[#a855f7]" />
        <div className="flex-1 bg-[#d9f99d]" />
        <div className="flex-1 bg-[#22d3ee]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 mt-8 md:mt-4">
        <div className="max-w-2xl w-full bg-white border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-slate-200/50">
          
          {/* HEADER */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-2xl mb-6 shadow-lg shadow-purple-200/50">
              <MdGavel className="text-[#d9f99d] text-2xl md:text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-2 uppercase italic leading-none">
              The Tag Rules
            </h1>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
              By using HashTag, you agree to:
            </p>
          </div>

          {/* TERMS LIST */}
          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            
            {/* 1. Respectful Behavior */}
            <div className="flex items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-[#a855f7]/5 border border-[#a855f7]/10 group hover:bg-[#a855f7]/10 transition-colors">
              <div className="text-[#a855f7] mt-1 md:mt-0"><FaRegHandPeace size={22} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base md:text-lg">Be respectful to all users</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Spill the tea, don't throw the pot. Harassment is an instant ban.</p>
              </div>
            </div>

            {/* 2. Content Policy */}
            <div className="flex items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-[#22d3ee]/5 border border-[#22d3ee]/10 group hover:bg-[#22d3ee]/10 transition-colors">
              <div className="text-[#0891b2] mt-1 md:mt-0"><MdErrorOutline size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base md:text-lg">No illegal content</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Zero tolerance for vulgarity, illegal links, or prohibited media.</p>
              </div>
            </div>

            {/* 3. Ephemeral Nature */}
            <div className="flex items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-[#d9f99d]/20 border border-[#d9f99d]/30 group hover:bg-[#d9f99d]/30 transition-colors">
              <div className="text-lime-700 mt-1 md:mt-0"><MdAutoDelete size={24} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base md:text-lg">Chats are ephemeral</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Everything vanishes in 24h. No backups, no history, no logs.</p>
              </div>
            </div>

            {/* Responsibility */}
            <div className="flex items-start md:items-center gap-4 p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-slate-100 transition-colors">
              <div className="text-slate-400 mt-1 md:mt-0"><FaUserShield size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-base md:text-lg">Your Words, Your Burden</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">You are solely responsible for what you post. Act accordingly.</p>
              </div>
            </div>
          </div>

          {/* ACCEPTANCE SECTION */}
          <form onSubmit={handleAccept} className="space-y-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-[#a855f7] peer-checked:border-[#a855f7] transition-all shadow-sm"></div>
                <MdCheckCircle className="absolute top-0 left-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={24} />
              </div>
              <span className="text-xs md:text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors leading-tight">
                I agree to the rules and understand that my digital footprint here is temporary.
              </span>
            </label>

            <button 
              type="submit"
              disabled={!agreed}
              className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl
                ${agreed 
                  ? 'bg-slate-900 text-white hover:bg-[#a855f7] shadow-purple-100' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
            >
              Enter the Lounge
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-8 text-center mt-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaSlackHash className="text-[#a855f7]" size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Hash-Tag Integrity System
          </span>
        </div>
        <p className="text-slate-300 text-[9px] uppercase tracking-[0.3em] font-bold italic">Stay Local • Leave No Trace</p>
      </footer>
    </div>
  );
};

export default Terms;