import React from 'react';
import { Link } from 'react-router-dom';
import { FaSlackHash, FaHourglassHalf, FaWind } from 'react-icons/fa';
import { MdOutlineTimer, MdGroups2, MdAutoDelete } from 'react-icons/md';
import { HiOutlineLightBulb } from "react-icons/hi2";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      {/* GRADIENT DEFINITION */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="50%" />
          <stop stopColor="#f59e0b" offset="100%" />
        </linearGradient>
      </svg>

      {/* NAV */}
      <nav className="flex justify-between items-center px-5 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={28} className="md:size-8" />
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Hash-Tag</span>
        </div>
        <Link to="/login">
          <button className="bg-white border-2 border-slate-900 text-slate-900 px-4 py-1.5 md:px-6 md:py-2 rounded-xl font-bold text-sm md:text-base hover:bg-slate-900 hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Login
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="px-5 pt-8 pb-16 md:pt-12 md:pb-20 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 shadow-sm">
          <FaHourglassHalf className="animate-pulse" /> Time is Ticking
        </div>
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
          OWN THE <br /> 
          <span className="italic" style={{ background: 'linear-gradient(to right, #4f46e5, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MOMENT.
          </span>
        </h1>

        <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-medium leading-relaxed">
          The chat app for people who value their time. Join topic-specific pop-up lounges that vanish when your break ends.
        </p>

        <div className="flex justify-center items-center">
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-lg md:text-xl hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-all active:scale-95">
              Start Chatting
            </button>
          </Link>
        </div>
      </section>

      {/* THE CORE CONCEPT (Bento Grid) */}
      <section className="py-12 md:py-20 px-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Feature 1: Time Bound */}
          <div className="md:col-span-8 bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white flex flex-col justify-between min-h-[300px] md:min-h-[350px] relative overflow-hidden group">
            <MdOutlineTimer className="absolute -right-10 -bottom-10 text-[12rem] md:text-[15rem] opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Limited Lifespan</h3>
              <p className="text-indigo-100 text-base md:text-lg max-w-md leading-relaxed">Rooms aren't permanent. They vanish after the timer hits zero, leaving no digital footprint behind.</p>
            </div>
            <div className="flex items-center gap-2 font-bold text-[10px] md:text-sm uppercase tracking-widest relative z-10">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Pop-up Active
            </div>
          </div>

          {/* Feature 2: Clean Slate */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between min-h-[200px] hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-800">
              <FaWind size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Zero Clutter</h3>
              <p className="text-slate-500 text-sm md:text-base">When the room dies, your chat list stays clean. No ghost notifications.</p>
            </div>
          </div>

          {/* Feature 3: Spontaneous Thought */}
          <div className="md:col-span-4 bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white flex flex-col justify-between min-h-[200px] md:min-h-[300px]">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-400">
              <HiOutlineLightBulb size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Spontaneous</h3>
              <p className="text-slate-400 text-sm md:text-base">From tech trends to random shower thoughts. Share it before it's gone.</p>
            </div>
          </div>

          {/* Feature 4: High Engagement */}
          <div className="md:col-span-8 bg-[#fdf2f8] border border-pink-100 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-center items-start">
            <div className="flex gap-3 md:gap-4 mb-6">
               <div className="p-3 md:p-4 bg-pink-100 text-pink-600 rounded-full"><MdGroups2 size={24} className="md:size-8" /></div>
               <div className="p-3 md:p-4 bg-indigo-100 text-indigo-600 rounded-full"><MdAutoDelete size={24} className="md:size-8" /></div>
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-800 mb-3 md:mb-4 tracking-tight">Focus on the Now.</h3>
            <p className="text-slate-600 text-sm md:text-lg leading-relaxed">Temporary spaces make conversations more valuable. You engage more because you know it won't be here tomorrow.</p>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-12 md:py-24 px-5">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 text-center text-white relative shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black mb-6 md:mb-8">Ready for your break?</h2>
            <p className="text-indigo-100 mb-8 md:mb-10 text-base md:text-xl font-medium">Join a lounge and let the conversation begin.</p>
            <Link to="/signup">
              <button className="bg-white text-indigo-600 px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black text-base md:text-xl hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                JOIN NOW
              </button>
            </Link>
          </div>
          {/* Decorative Circle for Mobile Background */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-slate-400 font-bold text-[9px] md:text-xs uppercase tracking-[0.2em] px-5 leading-loose">
        Hash-Tag // The Pop-Up Social Experience.
        //Developer by Praveen Kumar S
      </footer>
    </div>
  );
};

export default LandingPage;