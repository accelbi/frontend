import React from "react";
import "../StyleAndAssets/timeSheet-card.css";
import { getDatesInWeek } from "../helperComps/HelperForDates";
import {  FaInfoCircle } from "react-icons/fa";
import {  FaXmark } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";

function DatesHeading({ Mday, leave , code , date , position }) {
  const [showLeaveInfo, setShowLeaveInfo] = useState([false , false , false , false , false , false , false]);
  const dates = getDatesInWeek(Mday);

  console.log("leave" , leave)

  function dayToIndex (day){
    if (day === "Mon") return 0;
    if (day === "Tue") return 1;
    if (day === "Wed") return 2;
    if (day === "Thu") return 3;
    if (day === "Fri") return 4;
    if (day === "Sat") return 5;
    if (day === "Sun") return 6;
  }

  async function cancelAppliedLeave(leave){
    await axios.post(`http://localhost:8000/api/update/employee/cancelAppliedLeave/${code}/${date}`,{leave})
  }
  
  return (
    dates.map((dat) => (
      <span style={{ color: `${(leave && leave.find((item) => item.date === dat.date)) ? "darkblue" : "black" }` ,position:"relative"}}className="word-Day">
        {dat.day}
        <span className="word-Date">
          <span style={{ color: `${(leave && leave.find((item) => item.date === dat.date)) ? "blue" : "var(--accelbi-theme)" }`} } className="word-Mon">{dat.monthAndYear}</span>
        </span>

        {(leave && leave.find((item) => item.date === dat.date)) && <FaInfoCircle onClick={()=>{
          setShowLeaveInfo((prev)=>{
            const newShowLeaveInfo = [...prev];
            newShowLeaveInfo[dayToIndex(dat.day)] = !newShowLeaveInfo[dayToIndex(dat.day)];
            let i = 0;
            while (i !== 6){
              if (i !== dayToIndex(dat.day)){
              newShowLeaveInfo[i] = false;
              }
              i++;
            }
            return newShowLeaveInfo;
          })
          }} style={{position:"absolute", right:"-60%" , top:"30%" }}/>}

        {showLeaveInfo[dayToIndex(dat.day)] && leave && leave.find((item) => item.date === dat.date) && (
          <div style={{position:"absolute" , width:"200px" , borderRadius:"10px" , border:"1px solid darkblue"  ,top:"100%" , backgroundColor:"lightcyan" , padding:"10px"}}>
            {
              position === "employee"  && 
              <div 
            style={{position:"absolute" , top :"2px" , right:"2px" , fontSize:"15px", color:"blue"}} 
            onClick={()=>{
              setShowLeaveInfo((prev)=>{
                const newShowLeaveInfo = [...prev];
                newShowLeaveInfo[dayToIndex(dat.day)] = false;
                return newShowLeaveInfo;
              })
              cancelAppliedLeave(leave.find((item) => item.date === dat.date))
            }}
            >
              <FaXmark/>
            </div>
            }
            <h5>Type: {leave.find((item) => item.date === dat.date).type}</h5>
            <h5>Reason: {leave.find((item) => item.date === dat.date).reason}</h5>
          </div>
        )}

      </span>
    ))
  );
}

export default DatesHeading;

