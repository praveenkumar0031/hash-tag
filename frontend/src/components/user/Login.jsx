import React, { useState, useEffect } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff, MdAlternateEmail, MdLockOutline } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { loginapi, verifyGoogleCode } from "../../api/api";
import { FcGoogle } from "react-icons/fc"; 
import { FaSlackHash } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !window.hasProcessed) {
      window.hasProcessed = true;
      handleFinalLogin(code);
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  const googlelogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: `${import.meta.env.VITE_FRONTEND_URL}/login`, 
  });

  const handleFinalLogin = async (code) => {
    setLoading(true);
    try {
      const data = await verifyGoogleCode(code);
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('email', data.user.email);
        }
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setMessage("Google Auth failed.");
      setType("error");
      window.hasProcessed = false; 
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginapi(login);
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', login.email);
        navigate("/dashboard");
      } else {
        setMessage(res.message || "Invalid credentials");
        setType("error");
      }
    } catch (err) {
      setMessage("Invalid email or password.");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 selection:bg-indigo-100 overflow-x-hidden font-sans">
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-50/50 blur-[120px] pointer-events-none"></div>

      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="100%" />
        </linearGradient>
      </svg>

      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-7 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10">
        
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="p-3 bg-slate-50 rounded-2xl mb-3 border border-slate-100 shadow-sm">
             <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={28} />
          </div>
          <h2 className="text-slate-800 text-2xl md:text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">Sign in to your account</p>
        </div>

        {message && (
          <div className={`mb-5 p-3.5 rounded-2xl text-[11px] font-bold text-center animate-in fade-in zoom-in duration-300 ${
            type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <MdAlternateEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="email"
              name="email"
              required
              value={login.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
            />
          </div>

          <div className="relative group">
            <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={login.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <MdOutlineVisibilityOff size={20} /> : <MdOutlineVisibility size={20} />}
            </button>
          </div>

          {/* FORGOT PASSWORD LINK */}
          <div className="flex justify-end px-1">
            <Link 
              to="/forget" 
              className="text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-7">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="px-3 text-[10px] text-slate-300 font-black uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <button
          type="button"
          onClick={() => googlelogin()}
          disabled={loading}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] text-sm shadow-sm"
        >
          <FcGoogle size={22} />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-slate-500 text-xs mt-8">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:text-pink-500 font-bold underline underline-offset-8 decoration-indigo-600/20 transition-all">
            Join the streak
          </a>
        </p>
      </div>

      <style>{`
        body { background-color: #f8fafc; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default Login;