import React, { useState } from 'react';
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
    lng: null, // New field
    lat: null  // New field
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

  // --- Location Handling Logic ---
  const handleLocationToggle = (e) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setLoading(true);
      setError('');
      
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
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
          setError("Please enable location permissions to tag this room.");
          setUseLocation(false);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      
      setFormData(prev => ({ ...prev, lng: null, lat: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.isprivate && !formData.password) {
      return setError("Private rooms require a password.");
    }

    try {
      setLoading(true);
      // Backend expects: { name, description, isprivate, password, lng, lat }
      const payload = {
        ...formData,
        // Ensure password is empty string if public
        password: formData.isprivate ? formData.password : '',
        // Ensure lat/lng are null if location is toggled off
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <MdArrowBack /> Back to Dashboard
      </button>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
            <MdOutlineChatBubble size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create a New #Hastag</h2>
          <p className="text-slate-500">Start a conversation that matters</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Room Name</label>
            <input required type="text" name="name" placeholder="e.g. Developers Hub" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea name="description" rows="2" placeholder="What is this room about?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" onChange={handleChange} />
          </div>

          {/* --- Location Toggle --- */}
          <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3">
              {useLocation ? <MdLocationOn className="text-indigo-600" /> : <MdLocationOff className="text-slate-400" />}
              <div>
                <p className="text-sm font-bold text-slate-700">Tag Current Location</p>
                <p className="text-xs text-slate-500">
                  {useLocation ? `Location Fixed: ${formData.lng?.toFixed(2)}, ${formData.lat?.toFixed(2)}` : "Help locals find your room"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={useLocation} className="sr-only peer" onChange={handleLocationToggle} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              {formData.isprivate ? <MdLock className="text-amber-500" /> : <MdPublic className="text-emerald-500" />}
              <div>
                <p className="text-sm font-bold text-slate-700">Private Room</p>
                <p className="text-xs text-slate-500">Only people with the password can join</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isprivate" className="sr-only peer" onChange={handleChange} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {formData.isprivate && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Room Password</label>
              <input required type="password" name="password" placeholder="Enter room password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" onChange={handleChange} />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:bg-indigo-400"
          >
            {loading ? "Processing..." : "Launch Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;