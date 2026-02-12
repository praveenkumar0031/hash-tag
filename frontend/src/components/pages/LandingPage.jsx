import React from 'react';
import { Link } from 'react-router-dom';
import { FaSlackHash, FaMapMarkerAlt, FaShieldAlt, FaWind } from 'react-icons/fa';
import { MdOutlineTimer, MdCoffee, MdOutlineCleaningServices, MdNearMe, MdGroups } from 'react-icons/md';
import { HiOutlineLightningBolt } from "react-icons/hi";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* GRADIENT DEFINITION FOR ICON */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#6366f1" offset="0%" />
          <stop stopColor="#a855f7" offset="50%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-6 md:px-12 lg:px-20 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={32} className="transition-transform group-hover:rotate-12 duration-300" />
          <span className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-slate-900">
            Hash-Tag
          </span>
        </div>
        <Link to="/login">
          <button className="bg-white border-2 border-slate-900 text-slate-900 px-5 py-2 rounded-xl font-bold text-sm md:text-base hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Login
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 pt-12 pb-20 md:pt-20 md:pb-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
          <MdNearMe /> 12 Active Rooms Nearby
        </div>
        
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.95] md:leading-[0.85]">
          SPILL THE TEA, <br /> 
          <span className="italic" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            THEN LEAVE.
          </span>
        </h1>

        <p className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed px-4">
          The "Break-Time" chat app for people who value privacy. Join local pop-up lounges that vanish automatically in 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-6">
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-80 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl">
              Start Your Tea Talk
            </button>
          </Link>
        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section className="py-12 md:py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Feature 1: The 24h Wipe */}
          <div className="md:col-span-7 lg:col-span-8 bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
            <MdOutlineCleaningServices className="absolute -right-12 -bottom-12 text-[15rem] opacity-10 group-hover:-rotate-12 transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="bg-white/20 w-fit p-4 rounded-2xl mb-8">
                <MdOutlineTimer size={32} />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Vanish Mode</h3>
              <p className="text-indigo-100 text-lg md:text-xl max-w-md leading-relaxed">
                No digital footprints. Every chat, image, and room is wiped from the server every 24 hours. Pure spontaneity.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] relative z-10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span> Servers clear daily
            </div>
          </div>

          {/* Feature 2: Location Based */}
          <div className="md:col-span-5 lg:col-span-4 bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between min-h-[300px] hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
              <FaMapMarkerAlt size={28} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Local Lounges</h3>
              <p className="text-slate-500 text-base md:text-lg">
                Find rooms hosted by people right next to you. Perfect for campus gossip, office breaks, or event hangouts.
              </p>
            </div>
          </div>

          {/* Feature 3: Data Security */}
          <div className="md:col-span-5 lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col justify-between min-h-[300px]">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-400">
              <FaShieldAlt size={28} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-slate-400 text-base md:text-lg">
                Your data is encrypted and temporary. We don't sell your info because we don't keep it long enough to.
              </p>
            </div>
          </div>

          {/* Feature 4: The Tea Talk Concept */}
          <div className="md:col-span-7 lg:col-span-8 bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="flex gap-4 mb-8">
               <div className="p-4 bg-amber-200 text-amber-700 rounded-2xl shadow-sm"><MdCoffee size={32} /></div>
               <div className="p-4 bg-indigo-200 text-indigo-700 rounded-2xl shadow-sm"><MdGroups size={32} /></div>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Split Your Tea.</h3>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              Break time is sacred. Hash-Tag lets you create instant, localized spaces to vent, laugh, or debate with colleagues and peers without the baggage of permanent history.
            </p>
            <FaWind className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-amber-200/30 text-[10rem] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white relative shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">Ready for a <br className="md:hidden" /> break?</h2>
            <p className="text-indigo-50 mb-12 text-lg md:text-2xl font-medium max-w-2xl mx-auto opacity-90">
              Join or create a lounge in seconds. No profile setup, no long-term commitment.
            </p>
            <Link to="/signup">
              <button className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg md:text-xl hover:scale-105 hover:shadow-2xl transition-all active:scale-95">
                JOIN NOW
              </button>
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 text-center px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
          <span>Hash-Tag</span>
          <span className="hidden md:inline">•</span>
          <span>The Pop-Up Social Experience</span>
          <span className="hidden md:inline">•</span>
          <span className="text-slate-900">Developed by Praveen Kumar S</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;