import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // 1. Create input state variables to track email and password text
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. The login submit function handles communication with the database
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Save the logged-in user profile info locally if needed
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("username", data.user.username);

        alert("Login successful!");
        // Check the role from the response
        if (data.user.role === 'admin') {
          navigate("/admin/dashboard"); // Redirect Admin to their page
        } else {
          navigate("/dashboard");       // Redirect Client to their page
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
    <div style={{ padding: "20px" }}>
      <h2>Log In</h2>
      
      {/* 3. Link your submission logic directly here */}
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label>Email</label><br />
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // saves email typing into state
          />
        </div>

        <div>
          <label>Password</label><br />
          <input 
            type="password" 
            placeholder="Enter your password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // saves password typing into state
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Log In</button>
      </form>

      <p>Don't have an account? <button type="button" onClick={() => navigate("/register")}>Sign Up</button></p>
    </div>
  );
}

export default Login;
