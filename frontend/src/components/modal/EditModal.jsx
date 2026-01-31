import React, { useState, useEffect } from 'react';
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
        password: '' // Keep password empty unless they want to change it
      });
    }
  }, [room]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(room._id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <MdClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Room Name</label>
            <input
              type="text" required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Privacy Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Privacy Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isprivate: false })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${!formData.isprivate ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white text-slate-500'}`}
              >
                <MdPublic /> Public
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isprivate: true })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all ${formData.isprivate ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white text-slate-500'}`}
              >
                <MdLock /> Private
              </button>
            </div>
          </div>

          {/* Password field only shown if private */}
          {formData.isprivate && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Room Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border rounded-xl font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 rounded-xl font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;