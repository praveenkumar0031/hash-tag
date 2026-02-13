import React, { useEffect } from 'react';
import { MdErrorOutline, MdCheckCircleOutline, MdClose } from 'react-icons/md';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right ${styles[type]}`}>
      {type === 'error' && <MdErrorOutline size={20} />}
      {type === 'success' && <MdCheckCircleOutline size={20} />}
      
      <p className="text-sm font-medium">{message}</p>
      
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <MdClose size={18} />
      </button>
    </div>
  );
};

export default Toast;