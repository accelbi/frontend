import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaRegCircleXmark } from "react-icons/fa6"
import logo from "../StyleAndAssets/accelbi-logo-color.png";
import {
  getMondayOfCurrentWeek,
  getTitle,
  getMondayOfPreviousWeek,
  getMondayOfNextWeek,
  formatDate,
  getFormattedTodaysDate,
  getMondayDateOfAnyDayInTheWeek,
} from "../helperComps/HelperForDates";
import DatesHeading from "../EmpComps/datesHeading";
import MainFooter from "../EmpComps/MainFooter";
import PlaceHolderRow from "../ManagerComps/PlaceHolderRow";
import { get, set } from "mongoose";
import { FaCheck , FaSpinner } from "react-icons/fa";

function Review ({ setEmpCodeUsed , setMonDateUsed , name , reviewUrl , manCode , setChanging ,changing, setExcelData , setPdfData}) {

  function getThisWeekDatesArrayWithDay(mondayDate) {
    const datesArray = [];
    const startDate = new Date(mondayDate);
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
    // Loop through the days of the week (0 = Monday, 6 = Sunday)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day} ${daysOfWeek[i]}`;
      datesArray.push(formattedDate);
    }
  
    return datesArray;
  }
  function excelFormattedDatas(jsonData)  {
      const dateHeaders = getThisWeekDatesArrayWithDay(jsonData && jsonData.MonDate); 
  
      const transformedData = jsonData.data.map((item) => {
          const transformedItem = {
            project: item && item.project,
            projectCode: item && item.projectCode,
            task: item && item.task,
            taskCode: item && item.taskCode,
            taskDesc: item && item.taskDesc,
          };
          // transformedItem["Project"] = item.project;
          // transformedItem["Task"] = item.task;
          // transformedItem["Task Description"] = item.taskDesc;
          // transformedItem["Project Code"] = item.projectCode;
          // transformedItem["Task Code"] = item.taskCode;
        
          dateHeaders.forEach((dateHeader, index) => {
            transformedItem[dateHeader] = item && item.hours[index];
          });

          
          
        
          return transformedItem;
      });
      return transformedData;
  }
    
    console.log("reviewUrl", reviewUrl)
    const [totalHours, setTotalHours] = useState([0, 0, 0, 0, 0, 0, 0])
    const [reason, setReason] = useState("")
    const [showReasonInputBox, setShowReasonInputBox] = useState(false)
    const [weekToBeDisplayed, setWeekToBeDisplayed] = useState(
        getMondayOfCurrentWeek()
    )
    const [data , setData] = useState(null);
    const [loading , setLoading] = useState(true)

    async function downloadDisplayDetails() {
        setLoading(true)
        const response = await axios.get(`${reviewUrl}`)
        console.log("response", response.data)
        setData(response.data)
        setExcelData(excelFormattedDatas(response && response.data))
        setPdfData(excelFormattedDatas(response && response.data))
        setMonDateUsed(response.data.MonDate)
        setEmpCodeUsed(response.data.code)
        setLoading(false)
    }

    useEffect(() => {
      
        downloadDisplayDetails()
        
    }, [reviewUrl , name])

    useEffect(() => {

        let newTotalHours = [0, 0, 0, 0, 0, 0, 0]

        {data && data.data.forEach((item) => {
            item.hours.forEach((hour, index) => {
              newTotalHours[index] += hour;
            });
          });
    
          setTotalHours(newTotalHours);}
        
      }, [reviewUrl]);

      async function approveHandler (){
        await axios.post(`http://localhost:8000/api/update/manager/approve/${data.code}/${manCode}/${data && data.MonDate}/${getFormattedTodaysDate()}`)
        setChanging(!changing)
        setLoading(true)
        setTimeout(() => {
          downloadDisplayDetails()
          setLoading(false)
        }, 1000);
      }
      async function rejectHandler (reason){
        setShowReasonInputBox(true)
      }
      async function rejectBoxHandler (reason){
        setLoading(true)
        await axios.post(`http://localhost:8000/api/update/manager/reject/${data.code}/${manCode}/${data && data.MonDate}/${getFormattedTodaysDate()}`,{reason})

        setChanging(!changing)
        
        
      }
  return (
    <>

    {
      showReasonInputBox &&
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
        <section style={{ zIndex: "10" , borderBottomRightRadius:"0" }} id="reason-box">
          <div className="title dja">
            REASON
            <div id="addProject-close">
              <FaRegCircleXmark onClick={()=>setShowReasonInputBox(false)} className="fa-regular fa-circle-xmark"/>
            </div>
          </div>
          <div id="reason" style={{borderBottomRightRadius:"0"}}>
            <textarea 
             value={reason}
             onChange={(e)=>{
              setReason(e.target.value)
            }} style={{padding:"5px" ,margin:"20px" , borderBottomRightRadius:"0" , width:"260px" , resize:"none"}} name="reason" id="reason" cols="30" rows="10" ></textarea>
          </div>
          <div style={{display:"flex" , justifyContent:"center" , alignItems:"center" , borderTopLeftRadius:"10px" , position:"fixed" , bottom:"0" , right:"0" , backgroundColor :"var(--acellbi-theme)" , height:"30px" , width:"30px" , color:"white" , padding:"3px 0 0 3px" }}>
          <FaCheck onClick={()=>{
            rejectBoxHandler(reason)
            setShowReasonInputBox(false)
            setTimeout(() => {
              downloadDisplayDetails()
              setLoading(false)
            }, 1000);
            }}/>
            </div>
        </section>
        </>
    }
     
        <div id="timeSheet-card">
          <div id="timeSheet-title">
            <span style={{color:"" , fontWeight:"200"}} >{name}{",  "}<span style={{color:"var(--submit-button)" , fontWeight:"200"}}>{data && data.code}</span></span>
          </div>
          <div id="timeSheet-main">
            <div id="timeSheet-main-heading">
              <span id="word-Project">Project</span>
              <span id="word-Task">Task</span>
              <span id="allDate">
                <DatesHeading leave={data && data.leave}  Mday={data && data.MonDate} code={data && data.code} date={weekToBeDisplayed} position={"manager"}/>
              </span>
            </div>
            <div id="timeSheet-update">
              {
                loading &&
                <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      color: "var(--acellbi-theme)",
                    }}
                  >
                    <FaSpinner
                      style={{
                        animationName: "spin",
                        animationDuration: "1000ms",
                        animationIterationCount: "infinite",
                        animationTimingFunction:
                          "cubic-bezier(0.5 , 0.05 , 0.5 , 0.05)",
                      }}
                      size={"60px"}
                    />
                </div>
}
            {    

                data &&
                  data.data.map((item, index) => {
                    return (
                      <PlaceHolderRow
                        
                        data={item}
                        
                      />
                    )
                  })
              }
            </div>
            <div id="timeSheet-main-footer">
              <MainFooter totalHours={totalHours} />
            </div>
          </div>
          <div id="timeSheet-footer" style={{height:"60px"}}>
          <div id="footer-controls" style={{display:"flex" , justifyContent:"space-evenly" , alignItems:"center"}}>
              
              
              
                { (data && data.approval === null ) &&
                <>
                  <button
                  onClick={()=>{
                    setLoading(true)
                    approveHandler()
                    setTimeout(() => {
                      downloadDisplayDetails()
                      setLoading(false)
                    }, 1000);
                  }}
                  style={{ backgroundColor: "var(--submit-button)" }}
                  id="submit-btn"
                >
                  Approve
                </button>

                <button
                  onClick={rejectHandler}
                  style={{ backgroundColor: "darkred" }}
                  id="submit-btn"
                >
                  Reject
                </button>
                </>}

                { 
                (data && data.approval === true) &&
                  <button
                  className="Mstatus-btn Mapp"
                  style={{borderColor:"var(--submit-button) !important"}}
                  >
                  Approved
                </button>
                }

                { 
                (data && data.approval === false) &&
                  <button
                  className="Mstatus-btn Mrej"
                >
                  Rejected
                </button>
                }
             
              
            </div>
            <div id="info-of-appr-and-subm-date">
              <span id="emp-subm-date">
                Employee Submission Date:{" "}
                <span id="emp-subm-date-value">
                  {data
                  
                    ? formatDate(data.subDate)
                    : "Not Submitted"}
                </span>{" "}
              </span>
              { (data &&( data.approval !== true && data.approvalDate))
                &&
                <span id="emp-subm-date">
                Last Rejection Date:{" "}
                <span id="emp-subm-date-value">
                  {formatDate(data.approvalDate)}
                    
                </span>{" "}
              </span>
              }
              
            </div>
          </div>
        </div>
      
    </>
  )
}

export default Review


// className