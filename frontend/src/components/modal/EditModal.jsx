import { useState, useEffect } from 'react';
import { MdClose, MdLock, MdPublic } from 'react-icons/md';

const EditModal = ({ isOpen, room, onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    isprivate: false, 
    password: '' 
  });

  useEffect(() => {
    if (room) {
      setFormData({ 
        name: room.name, 
        description: room.description || '', 
        isprivate: room.isprivate || false,
        password: '' 
      });
    }
  }, [room]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(room._id, formData);
  };
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20 transform transition-all scale-100 shadow-indigo-500/10">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">Settings & Permissions</p>
        </div>
        <button 
          onClick={onCancel} 
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all shadow-sm active:scale-90"
        >
          <MdClose size={22} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Room Name */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Room Name</label>
          <input
            type="text" required
            placeholder="e.g. Design Team"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Description</label>
          <textarea
            rows="2"
            placeholder="What is this room about?"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Privacy Selector */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-700 ml-1">Privacy Status</label>
          <div className="flex gap-3 bg-slate-100 p-1 rounded-[18px]">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isprivate: false })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-sm font-bold transition-all ${
                !formData.isprivate 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MdPublic size={18} /> Public
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isprivate: true })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-sm font-bold transition-all ${
                formData.isprivate 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MdLock size={18} /> Private
            </button>
          </div>
        </div>

        {/* Password field - High contrast for security */}
        {formData.isprivate && (
          <div className="animate-in slide-in-from-top-3 duration-300 space-y-1.5">
            <label className="text-[13px] font-bold text-amber-700 ml-1">Room Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-3 bg-amber-50/50 border-2 border-amber-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-700"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <MdLock className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300" />
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 px-4 py-3.5 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl font-bold text-white hover:opacity-90 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default EditModal;