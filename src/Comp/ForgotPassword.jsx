import React from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import "./StyleLogin/style.css";
import "./StyleLogin/general.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getAuth , sendPasswordResetEmail } from "firebase/auth";
import { useParams } from "react-router-dom";

function Login() {

  const { emailFromLoginForm } = useParams();

  const [email, setEmail] = useState(emailFromLoginForm);
  
  const [error, setError] = useState("");
 
  const back = {
    position: "fixed",
    top: "10px",
    right: "10px",
    padding: "10px",
    fontSize: "1.5rem",
    backgroundColor: "var(--acellbi-theme)",
    color: "white",
    zIndex: "2",
    borderRadius: "8px",
    cursor: "pointer",
  };
  const navigate = useNavigate();

  const auth = getAuth();

  
  async function proceedHandler(){
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent")
    navigate("/")
  }
  
  return (
    <>
      <div className="cover">Dimensions are too small</div>
      <div onClick={() => window.history.back()} className="dja" style={back}>
        <FaArrowLeft />
      </div>
      <section id="background">
        <div id="upper-box"></div>
        <div id="lower-box"></div>
      </section>

      <section id="login">
        <div id="loginform" style={{ position: "relative" }}>
          <div id="upperLogin">
            <img src={logo} alt="logo" />
          </div>
          <div style={{ position: "relative"
           }} id="lowerLogin">
            <h1 style={{ position: "absolute", top: "30px" , fontSize:"2rem" , fontWeight:"200"  }}>Forgot Password</h1>
            <div className="input-container">
              <label htmlFor="user-id">
                User/Email Id:
                <input
                  type="text"
                  name="user-id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            
          </div>
           
            <h4 style={{ position: "absolute", bottom: "160px" , left:"5px", writingMode: "vertical-rl" , color: "red" , fontSize:"1rem" }}>
              {error}
            </h4>
          
          <button onClick={proceedHandler} id="proceedLogin">
            Proceed
          </button>
        </div>
      </section>
    </>
  );
}
export default Login;
