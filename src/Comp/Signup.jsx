import React from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import "./StyleSignup/style.css";
import "./StyleSignup/general.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import emailValidator from "email-validator";
const eye = {
  position: "absolute",
  right: "10px",
  cursor: "pointer",
  color: "var(--acellbi-theme)",
};

function Signup() {
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
  const [passConfirmVisible, setPassConfirmVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [manCode, setManCode] = useState("");
  const [pass, setPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleProceed() {
    setError("");
    setLoading(true);
    if (!emailValidator.validate(email)) {
      setError("Invalid Email");
      setLoading(false);
      return;
    } else if (pass !== conPass) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    } else if (pass.length < 8) {
      setError("Password is short (min. 8 char)");
      setLoading(false);
      return;
    }
    try {
      const exist = await axios.post(
        "http://localhost:8000/api/user/checkWhetherExist",
        {
          params: {
            email,
            code,
            manCode,
          },
        }
      );

      if (exist.data === "true") {
        setError("User already exists");
        setLoading(false);
      } else {
        const response = await axios.get(
          "http://localhost:8000/api/fetch/superVerification",
          {
            params: { email, code, manCode },
          }
        );
        console.log("superVerification", response.data);
        if (response.data === true) {
          console.log("superVerification Inner", response.data);

          await axios.post(
            "http://localhost:8000/api/user/savingEmployeeData",
            {
              email,
              code,
              manCode,
              name,
            }
          );

          await axios.post("http://localhost:8000/api/user/addNameToSuper", {
            name,
            code,
          });

          await createUserWithEmailAndPassword(getAuth(), email, pass);
          navigate("/login");
          setLoading(false);
        } else {
          setError("Cannot verify");
          setLoading(false);
        }
        setLoading(false);
      }
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
        setLoading(false);
      } else {
        setError(e.message);
        setLoading(false);
      }
    }
  }
  if (loading) {
    return (
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
    );
  } else {
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

        <section id="signup">
          <div id="signupform">
            <div id="uppersignup">
              <img src={logo} alt="logo" />
            </div>
            <div id="lowersignup">
              <div className="input-container">
                <label htmlFor="name">
                  Name:
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="name"
                  />
                </label>
              </div>
              <div className="input-container">
                <label htmlFor="email">
                  Email:
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    id="email"
                  />
                </label>
              </div>
              <div className="input-container">
                <label htmlFor="code">
                  Code:
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    id="code"
                  />
                </label>
              </div>
              <div className="input-container">
                <label htmlFor="m-email">
                  Manager's Code:
                  <input
                    value={manCode}
                    onChange={(e) => setManCode(e.target.value)}
                    type="text"
                    id="m-email"
                  />
                </label>
              </div>
              <div className="input-container">
                <label htmlFor="cr-pass" style={{ position: "relative" }}>
                  Create Passsword:
                  <input
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    style={{ paddingRight: "40px" }}
                    type={`${passVisible ? "text" : "password"}`}
                    id="cr-pass"
                  />
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
              </div>
              <div className="input-container">
                <label htmlFor="cm-pass" style={{ position: "relative" }}>
                  Confirm Passsword:
                  <input
                    value={conPass}
                    onChange={(e) => setConPass(e.target.value)}
                    style={{ paddingRight: "40px" }}
                    type={`${passConfirmVisible ? "text" : "password"}`}
                    id="cm-pass"
                  />
                  {passConfirmVisible ? (
                    <FaEyeSlash
                      style={eye}
                      onClick={() => setPassConfirmVisible(!passConfirmVisible)}
                    />
                  ) : (
                    <FaEye
                      style={eye}
                      onClick={() => setPassConfirmVisible(!passConfirmVisible)}
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
            <button onClick={handleProceed} id="proceedsignup">
              Proceed
            </button>
          </div>
        </section>
      </>
    );
  }
}
export default Signup;
