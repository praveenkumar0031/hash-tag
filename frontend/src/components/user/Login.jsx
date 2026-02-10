import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { loginapi } from "../../api/api";
import { FcGoogle } from "react-icons/fc"; 
import { FaSlackHash } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  

  const [login, setLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // Send the access token to your backend for verification
      const res = await axios.post(`${prcess.env.VITE_BACKEND_API}/auth/google`, {
        token: tokenResponse.access_token 
      });
      
      localStorage.setItem('token', res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage("Google Login Failed");
    }
  },
  onError: () => setMessage("Login Failed"),
  flow: 'implicit', // or 'auth-code'
  ux_mode: 'redirect', // <--- Change from 'popup' to 'redirect'
  redirect_uri: 'http://localhost:5173'
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginapi(login);
      if (res.token) {
        setMessage("Welcome back!");
        setType("success");
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', login.email);
        navigate("/dashboard");
      } else {
        setMessage(res.data?.message || "Invalid email or password");
        setType("error");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 md:p-8 lg:p-12 selection:bg-indigo-100">
      {/* GRADIENT DEFINITION */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="hash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#4f46e5" offset="0%" />
          <stop stopColor="#ec4899" offset="50%" />
          <stop stopColor="#f59e0b" offset="100%" />
        </linearGradient>
      </svg>

      {/* MAIN CONTAINER - Max width for massive screens */}
      <div className="max-w-[1400px] w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row min-h-[650px] lg:min-h-[750px] border border-slate-100">
        
        {/* LEFT PANEL – Hidden on Mobile, Visual Power on Desktop */}
        <div className="hidden md:flex w-1/2 lg:w-[55%] bg-slate-900 p-12 lg:p-20 flex-col justify-between relative overflow-hidden">
          {/* Decorative Glows */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={40} />
              <span className="text-white text-3xl font-black italic tracking-tighter">HASH-TAG</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6">
              THE <br />LOUNGE IS <br />
              <span style={{ background: 'linear-gradient(to right, #4f46e5, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WAITING.</span>
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-md">
              Sign in to catch the latest conversations before they vanish. High-engagement, zero digital footprint.
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-block p-1 px-4 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-black uppercase tracking-widest mb-4">
              Now Trending: #TechTrends
            </div>
            <p className="text-slate-500 text-sm italic">Join 2,000+ others in spontaneous thought sharing.</p>
          </div>
        </div>

        {/* RIGHT PANEL – Form Container */}
        <div className="w-full md:w-1/2 lg:w-[45%] p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8 text-center md:text-left">
             <div className="md:hidden flex justify-center mb-6">
                <FaSlackHash style={{ fill: "url(#hash-gradient)" }} size={45} />
             </div>
             <h3 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h3>
             <p className="text-slate-500 font-medium">Continue your streak in the lounges.</p>
          </div>

          {/* SOCIAL LOGIN */}
          <button 
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-100 transition-all mb-8 shadow-sm active:scale-[0.98]"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Or use Email</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* FEEDBACK MESSAGE */}
          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-sm font-bold text-center animate-bounce-short ${
              type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {message}
            </div>
          )}

          {/* LOGIN FORM */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={login.email}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-800 font-medium"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={login.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdOutlineVisibilityOff size={22} /> : <MdOutlineVisibility size={22} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95 mt-4 h-16"
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            New here? <a href="/signup" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;