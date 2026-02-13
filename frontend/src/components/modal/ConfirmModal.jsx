

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
 
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      
      {/* max-w-sm on desktop, but w-full on mobile */}
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
        </div>
        
        {/* flex-col-reverse for mobile (Cancel at bottom), flex-row for desktop */}
        <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
          <button 
            onClick={onCancel}
            className="w-full md:w-auto px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="w-full md:w-auto px-6 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;