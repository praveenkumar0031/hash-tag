import React from 'react';
import { MdRocketLaunch, MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 md:px-6">
      <div className="w-full max-w-[600px] bg-white rounded-[2.5rem] p-8 md:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
        
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

        {/* Floating Icon Section */}
        <div className="relative inline-block mb-8">
          {/* Animated rings */}
          <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-[-10px] bg-indigo-50 rounded-full animate-pulse opacity-40"></div>
          
          {/* The Rocket Icon */}
          <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100 text-indigo-600 border border-indigo-50 transform hover:rotate-12 transition-transform duration-500 ease-in-out">
            <MdRocketLaunch size={52} className="animate-bounce-slow" />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
            Be the first to start the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">conversation!</span>
          </h2>
          
          <p className="text-slate-500 text-sm md:text-base max-w-sm mx-auto mb-10 leading-relaxed font-medium">
            <span className="text-indigo-600 font-bold">#HashTag</span> messages vanish every 24 hours. The lounge is quiet right now—let's break the silence.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col items-center">
            <Link to="/room/create" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 group">
                <MdAdd size={24} className="group-hover:rotate-90 transition-transform" />
                Create the First Room
              </button>
            </Link>
          </div>

          {/* Feature Badges - Optimized for Mobile wrap */}
          <div className="flex flex-wrap justify-center gap-y-3 gap-x-6 mt-12 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Fast Setup
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span> Auto-Delete
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Secured
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default EmptyState;