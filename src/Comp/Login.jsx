import React from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import "./StyleLogin/style.css";
import "./StyleLogin/general.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { set } from "mongoose";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const LogInFunction = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      const response = await axios.get(
        `http://localhost:8000/api/user/data/${email}`
      );
      if (response.data.position === "employee") navigate("/employee");
      else if (response.data.position === "manager") navigate("/manager");
      else if (response.data.position === "super") navigate("/super");
    } catch (e) {
      const errorMessage = e.message;
      const regex = /Error \((auth\/.*?)\)/;
      const match = errorMessage.match(regex);

      if (match) {
        const errorCode = match[1].replace("auth/", "");
        const formattedErrorCode = errorCode
          .split("/")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("/");
        setError(formattedErrorCode);
      } else {
        setError(e.message);
      }
      setLoading(false);
    }
  };
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
  const [passVisible, setPassVisible] = useState(false);
  const eye = {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    color: "var(--acellbi-theme)",
  };
  return (
    <>
      {loading ? (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            color: "var(--acellbi-theme)",
            backgroundColor: "#ffffff57",
            opacity: "0.5",
            borderRadius: " 0 0 30px 30px",
          }}
        >
          <FaSpinner
            style={{
              animationName: "spin",
              animationDuration: "1000ms",
              animationIterationCount: "infinite",
              animationTimingFunction: "cubic-bezier(0.5 , 0.05 , 0.5 , 0.05)",
            }}
            size={"60px"}
          />
        </div>
      ) : (
        <>
          <div className="cover">Dimensions are too small</div>
          <div
            onClick={() => window.history.back()}
            className="dja"
            style={back}
          >
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
              <div id="lowerLogin">
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
                <div className="input-container">
                  <label htmlFor="password" style={{ position: "relative" }}>
                    Password:
                    <input
                      style={{ paddingRight: "40px" }}
                      type={`${passVisible ? "text" : "password"}`}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autocomplete="new-password"
                    />
                    <h3
                      style={{
                        position: "absolute",
                        fontSize: "15px",
                        fontWeight: "200",
                        bottom: "-20px",
                        right: "10px",
                      }}
                    >
                      <Link
                        to={`/forgotPassword/${email}`}
                        style={{ color: "var(--submit-button)" , textDecoration:"none" }}
                      >
                        Forgot?
                      </Link>
                    </h3>
                    {passVisible ? (
                      <FaEyeSlash
                        style={eye}
                        onClick={() => setPassVisible(!passVisible)}
                      />
                    ) : (
                      <FaEye
                        style={eye}
                        onClick={() => setPassVisible(!passVisible)}
                      />
                    )}
                    
                  </label>
                  <div className="msg">
                    <h4
                      style={{
                        position: "absolute",
                        bottom: "160px",
                        left: "5px",
                        writingMode: "vertical-rl",
                        color: "red",
                        fontSize: "1rem",
                      }}
                    >
                      {error}
                    </h4>
                  </div>
                </div>
              </div>
              <h3
                style={{ position: "absolute", color: "white", bottom: "70px" }}
              >
                Don't have an account? <Link style={{textDecoration :"none"}} to="/signup">SignUp Here</Link>.
              </h3>

              <button onClick={LogInFunction} id="proceedLogin">
                Proceed
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
export default Login;
