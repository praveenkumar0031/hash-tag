import React from 'react';
import { MdRocketLaunch, MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 md:px-6">
      <div className="w-full max-w-[600px] bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 py-10 md:p-16 text-center shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
        
        {/* Cyber-Citrus Decorative Blobs - Scaled down for mobile */}
        <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-32 h-32 md:w-64 md:h-64 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-12 -left-12 md:-bottom-24 md:-left-24 w-32 h-32 md:w-64 md:h-64 bg-cyan-50 rounded-full blur-3xl opacity-60"></div>

        {/* Floating Icon Section */}
        <div className="relative inline-block mb-6 md:mb-10">
          <div className="absolute inset-0 bg-[#a855f7] rounded-full animate-ping opacity-10"></div>
          
          {/* The Rocket Icon - Smaller on mobile */}
          <div className="relative bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-purple-100 text-[#a855f7] border border-purple-50 transform hover:rotate-12 transition-transform duration-500 ease-in-out">
            <MdRocketLaunch className="text-4xl md:text-6xl animate-bounce-slow" />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 px-2">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter leading-[0.9] md:leading-none uppercase italic">
            Break the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#22d3ee]">silence.</span>
          </h2>
          
          <p className="text-slate-500 text-xs md:text-lg max-w-[260px] md:max-w-sm mx-auto mb-8 md:mb-10 leading-relaxed font-bold uppercase tracking-tight">
            The lounge is a ghost town. Start a 
            <span className="text-[#a855f7]"> #HashTag</span> and break the ice.
          </p>

          {/* Call to Action - Full width button on mobile */}
          <div className="flex flex-col items-center">
            <Link to="/room/create" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-[#a855f7] transition-all shadow-xl shadow-slate-200 active:scale-95 group">
                <MdAdd size={24} className="group-hover:rotate-90 transition-transform text-[#d9f99d]" />
                CREATE A ROOM
              </button>
            </Link>
          </div>

          {/* Feature Badges - Optimized for tight mobile rows */}
          <div className="flex flex-wrap justify-center gap-y-3 gap-x-4 md:gap-x-8 mt-10 md:mt-14 pt-6 md:pt-8 border-t border-slate-50">
            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span> Fast
            </div>
            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9f99d]"></span> Auto-Wipe
            </div>
            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]"></span> Local
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default EmptyState;