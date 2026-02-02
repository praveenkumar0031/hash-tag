import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { signupapi } from "../../api/api";
import "./log.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate=useNavigate();
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
    setSignup((prev) => ({
      ...prev,
      [name]: value,
    }));
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

        navigate('/login');
        setSignup({
          username: "",
          email: "",
          password: "",
          role: "user",
        });
      } else {
        setMessage(res.data?.message || "Signup failed");
        setType("error");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Signup failed. Try again."
      );
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">

        {/* LEFT PANEL (DESKTOP ONLY) */}
        <div className="left-panel">
          
          <div className="left-content">
            <h2>Welcome to Hashtag 👋</h2>
            <p className="description">
              In Hashtag, we put your interests center stage. 
              Create your account to connect with people who speak your language and start building your community from the ground up.
            </p>
            <h3>Ready to tell your #story? 
              <br />Let’s get started.</h3>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* MESSAGE BOX */}
          {message && (
            <div className={`message-box ${type}`}>
              {message}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={signup.username}
                onChange={handleChange}
                placeholder="yourname"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={signup.email}
                onChange={handleChange}
                placeholder="you@hashtag.com"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signup.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <MdOutlineVisibilityOff size={20} />
                  ) : (
                    <MdOutlineVisibility size={20} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="footer-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
