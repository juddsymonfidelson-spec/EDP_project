import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
const handleSignUpSubmit = (e) => {
    e.preventDefault(); 
    navigate("/dashboard"); 

  };
  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleSignUpSubmit}>
        {/* Your registration input fields go here (Name, Email, Password) */}
        <input type="email" placeholder="Enter email" required />
        <input type="password" placeholder="Create password" required />
        
        <button type="submit">Sign Up</button>
      </form>
      
      {/* Clicking this will send them back to the Login page */}
      <p>Already have an account? <button onClick={() => navigate("/login")}>Log In</button></p>
    </div>
  );
}

export default Register;