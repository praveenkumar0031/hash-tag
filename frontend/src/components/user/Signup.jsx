import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdAlternateEmail, MdLockOutline, MdPersonOutline } from "react-icons/md";
import { signupapi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FaSlackHash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [signup, setSignup] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignup((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await signupapi(signup);
      if (res) {
        setMessage("Account created successfully 🎉");
        setType("success");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed. Try again.");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 selection:bg-indigo-100 overflow-x-hidden font-sans relative">
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-50/50 blur-[100px] pointer-events-none"></div>

      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-7 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="p-3 bg-slate-50 rounded-2xl mb-3 border border-slate-100 shadow-sm">
            <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={28} />
          </div>
          <h2 className="text-slate-800 text-2xl md:text-3xl font-black tracking-tight text-center leading-tight">Create Account</h2>
          <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">Start your #story today</p>
        </div>

        {message && (
          <div className={`mb-5 p-3.5 rounded-2xl text-[11px] font-bold text-center border animate-in fade-in zoom-in duration-300 ${
            type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* USERNAME */}
          <div className="relative group">
            <MdPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              name="username"
              required
              value={signup.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
            />
          </div>

          {/* EMAIL */}
          <div className="relative group">
            <MdAlternateEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="email"
              name="email"
              required
              value={signup.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={signup.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <MdOutlineVisibilityOff size={20} /> : <MdOutlineVisibility size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-pink-500 font-bold underline underline-offset-8 decoration-indigo-600/20 transition-all">
            Login
          </a>
        </p>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #f8fafc; }
        ::-webkit-scrollbar { width: 0px; }
      `}} />
    </div>
  );
};

export default Signup;