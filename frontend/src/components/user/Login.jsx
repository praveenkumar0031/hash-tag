import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { loginapi } from "../../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await loginapi(login);
    
    
    if (res.token) {
      setMessage("Login successful");
      setType("success");

      localStorage.setItem('token', res.token);
      localStorage.setItem('email',login.email);
      //console.log("local:",localStorage.getItem('token'))
      navigate("/dashboard");
    } else {
      setMessage(res.data?.message || "user doesn't exists: check your email or password ");
      setType("error");
    }

  } catch (err) {
    
    setMessage(
      err.response?.data?.message || "Invalid credentials"
    );
    setType("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page">
      <div className="card">

        {/* LEFT PANEL – DESKTOP ONLY */}
        <div className="left-panel">
          <div className="left-content">
            <h2>Make your mark on #Hashtag</h2>
            <p className="tagline">– Where your topics take center stage.</p>
            <p className="description">
              In Hashtag, every conversation is a community. Jump into your
              favorite channels, connect with people who speak your language,
              and turn every moment into a movement.
            </p>
            <h3>What’s your #story today?</h3>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* MOBILE INTRO (shown only on mobile) */}
          <div className="mobile-intro">
            
          </div>

          <div className="header">
            
            <p>
              Sign in to continue the conversation on <span>HashTag</span>
            </p>
            <br />
          </div>

          {/* MESSAGE BOX */}
          {message && (
            <div className={`message-box ${type}`}>
              {message}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={login.email}
                onChange={handleChange}
                placeholder="you@hashtag.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={login.password}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="footer-text">
            New to HashTag? <a href="/signup">Create an account</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
