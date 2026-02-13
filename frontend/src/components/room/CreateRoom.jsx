import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoomApi } from '../../api/api';
import { MdOutlineChatBubble, MdLock, MdPublic, MdArrowBack, MdLocationOn, MdLocationOff } from 'react-icons/md';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isprivate: false,
    password: '',
    lng: null,
    lat: null
  });
  
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationToggle = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setLoading(true);
      setError('');
      if (!navigator.geolocation) {
        setError("Geolocation not supported.");
        setUseLocation(isChecked);
        setLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lng: position.coords.longitude,
            lat: position.coords.latitude
          }));
          setUseLocation(true);
          setLoading(false);
        },
        (err) => {
          setError("Location permissions required.");
          setUseLocation(false);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setUseLocation(false);
      setFormData(prev => ({ ...prev, lng: null, lat: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.isprivate && !formData.password) return setError("Private rooms require a password.");

    try {
      setLoading(true);
      const payload = {
        ...formData,
        password: formData.isprivate ? formData.password : '',
        lat: useLocation ? formData.lat : null,
        lng: useLocation ? formData.lng : null,
      };
      await createRoomApi(payload);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col items-center justify-center p-3 sm:p-4 font-sans">
      {/* Back Button with hover effect */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-xs font-semibold uppercase tracking-wider group"
      >
        <MdArrowBack className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white p-5 sm:p-8 relative overflow-hidden">
        {/* Animated Loading Bar */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100 overflow-hidden">
            <div className="w-full h-full bg-indigo-600 animate-progress origin-left"></div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 mb-3">
            <MdOutlineChatBubble size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">New #Hastag</h2>
          <p className="text-slate-400 text-sm font-medium">Create your space in seconds</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase rounded-r-lg animate-in fade-in slide-in-from-left-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">Room Identity</label>
            <input 
              required type="text" name="name" placeholder="e.g. Developers Hub" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300" 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest ml-1">Short Brief</label>
            <textarea 
              name="description" rows="2" placeholder="What's happening here?" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none text-sm font-medium placeholder:text-slate-300" 
              onChange={handleChange} 
            />
          </div>

          {/* Toggles Group */}
          <div className="grid grid-cols-1 gap-3">
            <div className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border ${useLocation ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50/30 border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${useLocation ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                  {useLocation ? <MdLocationOn size={18} /> : <MdLocationOff size={18} />}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700 leading-none">Tag Location</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                    {useLocation ? `Pinned: ${formData.lng?.toFixed(2)}, ${formData.lat?.toFixed(2)}` : "Visible to nearby"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-90">
                <input type="checkbox" checked={useLocation} className="sr-only peer" onChange={handleLocationToggle} />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border ${formData.isprivate ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50/30 border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${formData.isprivate ? 'bg-amber-500 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                  {formData.isprivate ? <MdLock size={18} /> : <MdPublic size={18} />}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700 leading-none">Private Access</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Only with password</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-90">
                <input type="checkbox" name="isprivate" className="sr-only peer" onChange={handleChange} />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {formData.isprivate && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input 
                required type="password" name="password" placeholder="Define room password" 
                className="w-full px-5 py-3 rounded-2xl border-2 border-amber-100 bg-amber-50/30 focus:bg-white outline-none transition-all text-sm font-bold shadow-inner" 
                onChange={handleChange} 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-95 transition-all disabled:bg-slate-200 text-xs uppercase tracking-[0.2em] mt-2"
          >
            {loading ? "Creating..." : "Launch Space"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-slate-300 text-[10px] font-black uppercase tracking-widest">Secure • Encrypted • Global</p>

      {/* Tailwind Custom Animation Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default CreateRoom;