import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username, 
      email: email,
      password: password,
      role: "student" 
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Cannot connect to server. Make sure your server terminal is running!");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE - BRANDING */}
      <div className="auth-left">
        <h1>Join TLC<br/>CampusEquip</h1>
        <p>Create an account to start reserving equipment for your next event, class project, or org activity.</p>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <p>Sign up to get started.</p>
          
          <form onSubmit={handleSignUpSubmit}>
            <div className="auth-input-group">
              <label>School Username / ID</label>
              <input 
                type="text" 
                placeholder="Enter your name or ID" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter school or personal email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Create password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign Up
            </button>
          </form>

          <div className="auth-switch-text">
            Already have an account? 
            <button type="button" onClick={() => navigate("/login")} className="auth-switch-link">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;