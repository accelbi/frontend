import React, { useState } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { getAuth, updatePassword , reauthenticateWithCredential ,EmailAuthProvider, } from "firebase/auth";
function PassChange({ email, setShowPasChangeForm }) {
  const [newP, setNewP] = useState("");
  const [oldP, setOldP] = useState("");
  const [cNewP, setCNewP] = useState("");
  const [error, setError] = useState("");
  async function applyChangePassword() {
    const auth = getAuth();
    const user = auth.currentUser;
    setError("");
    if (newP !== cNewP) {
      setError("Passwords do not match");
    } else if (newP.length < 8) {
      setError("Password must be atleast 8 characters long");
    } else {
      const credential = EmailAuthProvider.credential(
        email,
        oldP
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newP)
        .then(() => {
          setShowPasChangeForm(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          height: "100vh",
          width: "100vw",
          zIndex: "2",
          backgroundColor: "rgba(0,0,0)",
        }}
        id="overlay-cover"
      ></div>
      <section style={{ zIndex: "10" }} id="leave-box">
        <div id="leave-title" className="dja">
          Password
          <div id="addProject-close">
            <FaRegCircleXmark
              onClick={() => setShowPasChangeForm(false)}
              className="fa-regular fa-circle-xmark"
            />
          </div>
        </div>
        <div id="leave-form">
          <label
            htmlFor="new"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            Previous:{"  "}
            <input
              value={oldP}
              onChange={(e) => setOldP(e.target.value)}
              style={{
                width: "150px",
                float: "right",
                marginRight: "5px",
                padding: "10px",
                fontSize: "15px",
                border: "2px solid var(--acellbi-theme)",
                color: "var(--submit-button)",
                borderRadius: "5px",
              }}
              type="password"
              name="old"
              id="old"
            />
          </label>
          <label
            htmlFor="new"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            New:{"  "}
            <input
              value={newP}
              onChange={(e) => setNewP(e.target.value)}
              style={{
                width: "150px",
                float: "right",
                marginRight: "5px",
                padding: "10px",
                fontSize: "15px",
                border: "2px solid var(--acellbi-theme)",
                color: "var(--submit-button)",
                borderRadius: "5px",
              }}
              type="password"
              name="new"
              id="new"
            />
          </label>

          <label
            htmlFor="cNew"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            Confirm:{"  "}
            <input
              value={cNewP}
              onChange={(e) => setCNewP(e.target.value)}
              style={{
                width: "150px",
                float: "right",
                marginRight: "5px",
                padding: "10px",
                fontSize: "15px",
                border: "2px solid var(--acellbi-theme)",
                color: "var(--submit-button)",
                borderRadius: "5px",
              }}
              type="password"
              name="cNew"
              id="cNew"
            />
          </label>

          <button id="submit" onClick={applyChangePassword}>
            Submit
          </button>
          <h4
            style={{
              fontWeight: "200",
              fontSize: "15px",
              position: "absolute",
              bottom: "10px",
              color: "red",
            }}
          >
            {error}
          </h4>
        </div>
      </section>
    </>
  );
}

export default PassChange;
