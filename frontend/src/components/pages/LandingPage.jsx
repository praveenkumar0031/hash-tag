
import { Link } from 'react-router-dom';
import { FaSlackHash } from 'react-icons/fa';
import { MdNearMe, MdTimer, MdPlace, MdAutoDelete } from 'react-icons/md';
import Logo from '../../assets/hash-tag-logo.png'
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 overflow-x-hidden">
      
      {/* MINIMAL TOP BAR */}
      <div className="flex h-1.5 w-full fixed top-0 z-50">
        <div className="flex-1 bg-[#a855f7]" />
        <div className="flex-1 bg-[#d9f99d]" />
        <div className="flex-1 bg-[#22d3ee]" />
      </div>

      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap">
            
              <img 
                          src={Logo} 
                          alt="Hash-Tag Logo" 
                          className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300 ease-out animate-bounce-slow"
                        />
            
            <span className="text-xl font-black tracking-tighter uppercase italic">Hash-Tag</span>
          </div>
        <Link to="/terms">
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all">
            Get Started
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 pt-16 pb-20 md:pt-32 md:pb-40 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live in your radius</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
          STAY LOCAL.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#22d3ee] to-[#a855f7] bg-[length:200%_auto] animate-gradient">
            LEAVE NO TRACE.
          </span>
        </h1>

        <p className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The instant chat layer for the physical world. Connect with people around you right now—everything vanishes in 24 hours.
        </p>

        <Link to="/terms" className="relative inline-block group">
            <button className="bg-slate-900 text-white px-10 py-5 md:px-14 md:py-7 rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all active:scale-95">
              Launch a Lounge
            </button>
            <div className="absolute -top-3 -right-4 bg-[#d9f99d] text-slate-900 text-[10px] px-3 py-1 rounded-full font-black rotate-12 group-hover:rotate-0 transition-transform border-2 border-white shadow-sm">
                24H LIMIT
            </div>
        </Link>
      </section>

      {/* VIBRANT GRID SECTION */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1: Purple */}
          <div className="relative group overflow-hidden rounded-[2.5rem] p-1 bg-[#a855f7]">
            <div className="bg-white h-full w-full rounded-[2.4rem] p-8 md:p-10 transition-transform group-hover:scale-[0.98]">
                <div className="w-14 h-14 bg-[#a855f7] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-200">
                    <MdPlace size={30} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Hyper-Local</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                    No global noise. We use precise coordinates to only show you rooms within walking distance.
                </p>
            </div>
          </div>

          {/* Card 2: Cyan */}
          <div className="relative group overflow-hidden rounded-[2.5rem] p-1 bg-[#22d3ee]">
            <div className="bg-white h-full w-full rounded-[2.4rem] p-8 md:p-10 transition-transform group-hover:scale-[0.98]">
                <div className="w-14 h-14 bg-[#22d3ee] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-200">
                    <MdTimer size={30} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Time-Boxed</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                    Every room is a temporary "Hotspot". Once the 24-hour clock hits zero, the lounge is gone.
                </p>
            </div>
          </div>

          {/* Card 3: Lime */}
          <div className="relative group overflow-hidden rounded-[2.5rem] p-1 bg-[#d9f99d]">
            <div className="bg-white h-full w-full rounded-[2.4rem] p-8 md:p-10 transition-transform group-hover:scale-[0.98]">
                <div className="w-14 h-14 bg-[#d9f99d] text-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-lime-200">
                    <MdAutoDelete size={30} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Zero Logs</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                    Privacy is built-in. We don't just hide your data—we wipe our servers daily. No traces left.
                </p>
            </div>
          </div>

        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a855f7] opacity-20 blur-[100px]" />
          
          <div className="flex-1 z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-6 italic leading-tight uppercase">Privacy is sacred.</h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                Modern social media is a permanent record. Hash-Tag is different. It's for the coffee breaks, the stadium cheers, and the late-night airport waits.
            </p>
          </div>
          <div className="flex flex-col gap-4 z-10 w-full md:w-auto">
            <span className="px-6 py-3 bg-[#a855f7]/20 border border-[#a855f7]/40 rounded-full text-center font-bold text-[#a855f7]">No Profiles</span>
            <span className="px-6 py-3 bg-[#22d3ee]/20 border border-[#22d3ee]/40 rounded-full text-center font-bold text-[#22d3ee]">No Trackers</span>
            <span className="px-6 py-3 bg-[#d9f99d]/20 border border-[#d9f99d]/40 rounded-full text-center font-bold text-lime-400">No History</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <FaSlackHash className="text-slate-400" size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hash-Tag &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link to="/terms" className="hover:text-slate-900">Terms</Link>
            <span className="text-slate-900">Built by Praveen Kumar S</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}} />
    </div>
  );
};

export default LandingPage;