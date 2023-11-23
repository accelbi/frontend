import React from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import "./StyleLanding/style.css";
import "./StyleLanding/general.css";
import { useNavigate } from "react-router-dom";

function Landing(props) {
    const navigate = useNavigate();
  return (
    <>
      <div className="cover">Dimensions are too small</div>

      <section id="background">
        <div id="upper-box"></div>
        <div id="lower-box"></div>
      </section>

      <section id="login">
        <div id="loginform">
          <div id="upperLogin">
            <img src={logo} alt="logo" />
          </div>
          <div id="lowerLogin" style={{borderRadius:"0"}}>
            <div className="msg">
              <h1>Hello and Welcome,</h1>
              <h2>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Dolor perferendis vel in error
                optio rem, harum aliquid, atque id modi illum repellendus
                nostrum dolore ipsam natus sunt doloremque nesciunt voluptas
                vero ducimus sequi labore architecto! Ipsum magnam debitis
                mollitia commodi.
              </h2>
            </div>
          </div>
          <div className="bottom">
            <button id="loginbtn" onClick={()=>{navigate('/login')}}>Login</button>
            <button id="signupbtn" onClick={()=>{navigate('/signup')}}>Sign Up</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
