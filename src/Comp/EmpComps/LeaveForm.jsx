import React, { useState } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import {getSundayOfThisWeek} from "../helperComps/HelperForDates"
import axios from "axios";
function Reason({ token, setShowLeaveForm , code , weekToBeDisplayed}) {
    const [reason, setReason] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState();
   async function applyLeave () {
    await axios.post(`http://localhost:8000/api/update/employee/applyLeave/${code}/${weekToBeDisplayed}`, {
      type:type,
      reason:reason,
      date:date,
    })
    setShowLeaveForm(false);
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
          Leave Form
          <div id="addProject-close">
            <FaRegCircleXmark
              onClick={() => setShowLeaveForm(false)}
              className="fa-regular fa-circle-xmark"
            />
          </div>
        </div>
        <div id="leave-form">
          <label
            htmlFor="date"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            Date:{"  "}
            <input
            value={date}
            min={weekToBeDisplayed}
            max={getSundayOfThisWeek(weekToBeDisplayed)}
            onChange={(e) => setDate(e.target.value)}
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
              type="date"
              name="date"
              id="date"
            />
          </label>

          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            Reason:{"  "}
            <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
              id="dropdown"
              style={{
                width: "150px",
                marginRight: "5px",
                padding: "10px",
                fontSize: "15px",
                border: "2px solid var(--acellbi-theme)",
                color: "var(--submit-button)",
                borderRadius: "5px",
              }}
            >
              <option value="Select">Select</option>
              <option value="Health Issue">Health Issue</option>
              <option value="Emergency">Emergency</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
            }}
          >
            Type:{"  "}
            <select
            value={type}
            onChange={(e) => setType(e.target.value)}
              id="dropdown"
              style={{
                width: "150px",
                marginRight: "5px",
                padding: "10px",
                fontSize: "15px",
                border: "2px solid var(--acellbi-theme)",
                color: "var(--submit-button)",
                borderRadius: "5px",
              }}
            >
              <option value="Select">Select</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Annual">Annual</option>
              <option value="Work Form Home">Work Form Home</option>
            </select>
          </label>
          <button id="submit" onClick={applyLeave}>Submit</button>
        </div>
      </section>
    </>
  );
}

export default Reason;
