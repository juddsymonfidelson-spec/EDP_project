import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Import the new design

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("username", data.user.username);

        alert("Login successful!");
        if (data.user.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.error || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login verification error:", err);
      alert("Cannot connect to server. Make sure your server window is running!");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE - BRANDING */}
      <div className="auth-left">
        <h1>TLC CampusEquip</h1>
        <p>The reservation system for TLC students, faculty, and staff. Book projectors, sound systems, and event equipment in minutes.</p>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Log In
            </button>
          </form>

          <div className="auth-switch-text">
            Don't have an account? 
            <button type="button" onClick={() => navigate("/register")} className="auth-switch-link">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;