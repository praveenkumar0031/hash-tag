import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    
    // 2. Clear session flags
    window.processedLogin = false;
    window.authTriggered = false;

    // 3. Redirect to login
    navigate('/login', { replace: true });
    
    // 4. Optional: Force a reload to clear any lingering state in memory
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2.5 
                 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl 
                 transition-all duration-200 active:scale-95 group border border-red-100"
      title="Logout"
    >
      <MdLogout className="text-xl group-hover:translate-x-0.5 transition-transform" />
      {/* Hidden on mobile, shown on medium screens and up */}
      <span className="hidden md:block font-bold text-sm tracking-tight">
        LOGOUT
      </span>
    </button>
  );
};

export default Logout;