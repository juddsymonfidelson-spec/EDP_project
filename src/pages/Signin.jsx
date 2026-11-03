import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // Input states tracking text entries
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    // 🔒 The role is hardcoded to "student" securely on submission
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
    <div style={{ padding: "20px" }}>
      <h2>Sign Up</h2>
      
      <form onSubmit={handleSignUpSubmit}>
        <div>
          <label>School Username / ID</label><br />
          <input 
            type="text" 
            placeholder="Enter your name or ID" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Email Address</label><br />
          <input 
            type="email" 
            placeholder="Enter school or personal email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label><br />
          <input 
            type="password" 
            placeholder="Create password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>Sign Up</button>
      </form>

      <p>Already have an account? <button type="button" onClick={() => navigate("/login")}>Log In</button></p>
    </div>
  );
}

export default Register;