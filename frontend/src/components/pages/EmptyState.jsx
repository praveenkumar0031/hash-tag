import React from 'react';
import { MdRocketLaunch } from 'react-icons/md';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl text-indigo-600 border border-indigo-50">
          <MdRocketLaunch size={48} />
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-3xl font-bold text-slate-800 mb-3">
        Be the first to start the conversation!
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        <strong>#HashTag</strong> is a place where messages live for 24 hours and then vanish forever. 
        Currently, there are no active rooms. Why not create one and invite your friends?
      </p>

      {/* Call to Action */}
      <Link to="/room/create">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
          
          Create the First Room
        </button>
      </Link>

      {/* Feature Badges */}
      <div className="flex gap-4 mt-12 opacity-50">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">⚡ Fast Setup</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">•</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">🛡️ Auto-Delete</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">•</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">🔒 Private Options</span>
      </div>
    </div>
  );
};

export default EmptyState;