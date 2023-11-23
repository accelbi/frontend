import React from "react";
import { useState, useEffect } from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import Reason from "./EmpComps/Reason";
import useDebounce from "../hooks/useDebounce";
import {
  getMondayOfCurrentWeek,
  getTitle,
  getMondayOfPreviousWeek,
  getMondayOfNextWeek,
  formatDate,
  getFormattedTodaysDate,
} from "./helperComps/HelperForDates";
import "./StyleAndAssets/general.css";
import "./StyleAndAssets/manager-details.css";
import "./StyleAndAssets/user-details.css";
import "./StyleAndAssets/timeSheet-card.css";
import "./StyleAndAssets/webkit-scroll.css";
import "./StyleAndAssets/timeSheet-main-footer.css";
import "./StyleAndAssets/timeSheet-newRow.css";
import "./StyleAndAssets/timeSheet-footer.css";
import "./StyleAndAssets/addProject-form.css";
import "./StyleAndAssets/addTask-form.css";
import "./StyleAndAssets/style.css";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegSave,
  FaInfoCircle,
  FaBars,
  FaEdit,
  FaQuestion,
  FaBoxOpen,
  FaSpinner,
  FaSyncAlt,
} from "react-icons/fa";
import {
  FaPersonWalkingArrowRight,
  FaArrowRightFromBracket,
  FaAnglesLeft,
} from "react-icons/fa6";
import DatesHeading from "./EmpComps/datesHeading";
import Rows from "./EmpComps/Rows";
import LeaveForm from "./EmpComps/LeaveForm";
import PassChangeForm from "./EmpComps/PassChangeForm";
import MainFooter from "./EmpComps/MainFooter";
import axios from "axios";
import useUser from "../hooks/useUser";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function AccelbiEmp() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  let headers = {};
  async function downloadFirebaseUserDetails() {
    const token = user && (await user.getIdToken());
    headers = token ? { authtoken: token } : {};
  }
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [showThat, setShowThat] = useState(false);

  async function downloadUserDetails() {
    const response = await axios.get(
      `http://localhost:8000/api/user/data/${user.email}`,
      { headers }
    );
    console.log("response", response.data);
    setUserDetails(response.data);
  }

  const back = {
    position: "fixed",
    top: "10px",
    right: "13px",
    padding: "10px",
    fontSize: "1.5rem",
    backgroundColor: "var(--acellbi-theme)",
    color: "white",
    zIndex: "2",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const styleForMenuItems = {
    top: "10px",
    right: "10px",
    position: "fixed",
    fontSize: "50px",
    padding: "10px",
    color: "var(--acellbi-theme)",
    borderRadius: "20%",
    marginBottom: "10px",
    border: "2px solid var(--acellbi-theme)",
    backgroundColor: "var(--light-acellbi-theme)",
    transition: "all 0.25s ease",
  };
  const [showMenu, setShowMenu] = useState(false);
  const styleForFaPersonWalkingArrowRight = {
    transform: `translateY(${showMenu ? "60px" : "0px"})`,
  };
  const styleForFaEdit = {
    transform: `translateY(${showMenu ? "120px" : "0px"})`,
  };
  const styleForFaArrowRightFromBracket = {
    transform: `translateY(${showMenu ? "180px" : "0px"})`,
  };
  const [sync , setSync] = useState(false)
  const [showPasChangeForm, setShowPasChangeForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [changing, setChanging] = useState(false);
  const [addNewRow, setAddNewRow] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [weekToBeDisplayed, setWeekToBeDisplayed] = useState(
    getMondayOfCurrentWeek()
  );
  const [stopToEdit, setStopToEdit] = useState(false);
  const [saveTheData, setSaveTheData] = useState(false);
  let temp = {};

  const [FullDataOf_A_User, setFullDataOf_A_User] = useState(temp);

  async function DownloadDataFromServer() {
    setLoading(true);
    const temp = await axios.get(
      `http://localhost:8000/api/fetch/employee/data/${
        userDetails && userDetails.empCode
      }/${weekToBeDisplayed}`
    );
    // console.log(`http://localhost:8000/api/fetch/employee/data/${userDetails && userDetails.empCode}/${weekToBeDisplayed}`);
    if (temp.data !== null || temp.data !== undefined) {
      console.log("temp", temp.data);
      setFullDataOf_A_User(temp.data);
      setTotalHours([0, 0, 0, 0, 0, 0, 0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    DownloadDataFromServer();
  }, [userDetails, saveTheData ,sync]);

  useEffect(() => {
    if (!isLoading) {
      downloadFirebaseUserDetails();
      downloadUserDetails();
    }
  }, [isLoading]);

  // useEffect(() => {
  //   DownloadDataFromServer();
  //   setAddNewRow(false);
  // }, [weekToBeDisplayed]);

  async function submitHandler() {
    await axios.post(
      `http://localhost:8000/api/update/sendToMan/${userDetails && userDetails.empCode}/${userDetails && userDetails.manCode}/${weekToBeDisplayed}/${getFormattedTodaysDate()}/${userDetails && userDetails.name}`
    );
  }

  async function unsubmitHandler() {
    await axios.post(
      `http://localhost:8000/api/update/unsubmit/${
        userDetails && userDetails.empCode
      }/${userDetails && userDetails.manCode}/${weekToBeDisplayed}/${
        FullDataOf_A_User && FullDataOf_A_User.submittedDate
      }`
    )
  }
      
    
      
  

  const [totalHours, setTotalHours] = useState([0, 0, 0, 0, 0, 0, 0]);

  let timerId ;
  function changeTheData(weekToBeDisplayedNext) {
    setWeekToBeDisplayed(weekToBeDisplayedNext);
    
    clearTimeout(timerId)
    timerId = setTimeout ( () => { 
      DownloadDataFromServer()
      setAddNewRow(false);
    } , 2000)
   
  }

  if (userDetails && userDetails.manCode === undefined) 
  {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--submit-button)",
            height: "100vh",
            width: "100vw",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              height: "100vh",
              width: "100vw",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              You are not assigned to any manager
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "darkred",
              }}
            >
              Please contact your admin
            </div>
          </div>
          <div
          className="toggleBetweenManAndEmp"
          onMouseEnter={() => setShowThat(true)}
          onMouseLeave={() => setShowThat(false)}
          onClick={() => navigate("/manager")}
        >
          <FaAnglesLeft /> {showThat && "Manager"}
        </div>
        </div>
      );
  } else {
  return (
    
    <div>
      <div className="Mcover">Dimensions are too small</div>

      {showLeaveForm && (
        <LeaveForm
          code={userDetails && userDetails.empCode}
          weekToBeDisplayed={weekToBeDisplayed}
          setShowLeaveForm={(e) => setShowLeaveForm(e)}
          token={null} /// pass token here
        />
      )}

      {showPasChangeForm && (
        <PassChangeForm
          setShowPasChangeForm={(e) => setShowPasChangeForm(e)}
          email={userDetails && userDetails.email} /// pass token here
        />
      )}

      {user && userDetails && userDetails.position === "manager" && (
        <div
          className="toggleBetweenManAndEmp"
          onMouseEnter={() => setShowThat(true)}
          onMouseLeave={() => setShowThat(false)}
          onClick={() => navigate("/manager")}
        >
          <FaAnglesLeft /> {showThat && "Manager"}
        </div>
      )}

      <div id="menu">
        <FaPersonWalkingArrowRight
          title="Apply for leave"
          style={{ ...styleForMenuItems, ...styleForFaPersonWalkingArrowRight }}
          onClick={() => {
            setShowLeaveForm(true);
          }}
        />

        <FaEdit
          title="Change Password"
          style={{ ...styleForMenuItems, ...styleForFaEdit }}
          onClick={() => {
            setShowPasChangeForm(!showPasChangeForm);
          }}
        />

        <FaArrowRightFromBracket
          title="Sign Out"
          style={{ ...styleForMenuItems, ...styleForFaArrowRightFromBracket }}
          onClick={() => {
            signOut(getAuth());
            navigate("/");
          }}
        />

        <FaBars
          title="Menu"
          style={{
            ...styleForMenuItems,
            backgroundColor: showMenu
              ? "lightcyan"
              : "var(--light-acellbi-theme)",
          }}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
      </div>

      <div
        title="Refresh"
        onClick={async () => {
          await DownloadDataFromServer();
          setSync(!sync);
        }}
        className="dja"
        style={{ ...back, left: "10px", right: "auto" }}
      >
        <FaSyncAlt />
      </div>

      <section id="background">
        <div id="upper-box"></div>
        <div id="lower-box"></div>
      </section>
      {
        <section id="timeCard">
          <div id="logo-and-nav">
            <div id="logo-conatiner">
              <img src={logo} alt="accelbi-logo-color" />
            </div>
            <div id="manager-details">
              <div id="manager-name">
                <span className="ac-s-b">Manager: </span>
                <span className="sbc-s-b manager-name-field">
                  {userDetails && userDetails.manName}
                </span>
              </div>

              <div className="manager-details-wrapper">
                <span className="icon-wrapper dja">
                  <FaEnvelope className="fa-envelope" />
                </span>
                <span className="sbc-s-b details-wrapper">
                  {userDetails && userDetails.manEmail}
                </span>
              </div>
              <div className="manager-details-wrapper">
                <span className="icon-wrapper dja">
                  <FaPhone className="fa-phone" />
                </span>
                <span className="sbc-ss-b details-wrapper">
                  {userDetails && userDetails.manPhone}
                </span>
              </div>
            </div>
            <div style={{padding:"5px"}} id="user-full-details">
              <div id="profile-pic" className="dja">
                <FaUser className="fa-user" />
              </div>
              <div
                id="user-details"
                style={{ width: "auto", overflowY:"hidden", overflowX: "scroll" , font:"1.2rem" , whiteSpace:"nowrap" }}
              >
                <div className="sbc-s-b user-name">
                  {userDetails && userDetails.name}
                </div>
                <div className="ac-s-b user-code">
                  {userDetails && userDetails.empCode}
                </div>
              </div>
            </div>
          </div>
          <div id="timeSheet-card">
            <div id="timeSheet-title">
              <span>Timesheet</span>
              <div id="calender">
                <svg
                  style={{
                    height: "80%",
                    position: "absolute",
                    left: "7px",
                    top: "3px",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0.00 0.00 512.00 512.00"
                >
                  <path
                    fill="#777777"
                    d="
  M 512.00 107.60
  L 512.00 444.53
  C 509.73 468.86 491.19 486.94 466.75 486.95
  Q 260.18 486.99 53.61 487.01
  Q 40.07 487.01 34.02 485.53
  C 14.84 480.85 1.57 464.31 0.00 444.45
  L 0.00 107.39
  C 1.61 87.54 15.11 70.90 34.36 66.35
  Q 40.23 64.96 54.24 65.00
  Q 67.18 65.03 80.02 64.98
  A 0.97 0.97 0.0 0 0 80.98 64.02
  Q 81.01 54.67 81.00 45.09
  Q 80.98 37.38 82.05 34.51
  C 86.56 22.38 104.47 21.79 109.69 33.84
  Q 110.94 36.73 110.97 42.88
  Q 111.03 53.58 110.99 63.99
  A 1.01 1.00 0.3 0 0 112.00 65.00
  L 239.78 65.00
  A 1.23 1.22 90.0 0 0 241.00 63.77
  Q 240.97 53.68 241.01 43.50
  Q 241.04 36.72 242.40 33.69
  C 247.53 22.26 264.54 22.16 269.65 33.76
  Q 270.93 36.65 270.97 42.72
  Q 271.04 53.53 270.99 63.97
  A 1.02 1.02 0.0 0 0 272.01 65.00
  L 399.76 65.00
  A 1.23 1.23 0.0 0 0 400.99 63.77
  Q 400.99 53.61 401.00 43.36
  Q 401.01 36.92 402.41 33.82
  C 407.88 21.72 425.17 22.34 429.81 34.50
  Q 431.10 37.90 431.03 45.16
  Q 430.92 54.74 431.04 64.10
  A 0.91 0.91 0.0 0 0 431.95 65.00
  Q 449.78 65.00 467.75 65.01
  C 491.71 65.03 509.83 84.07 512.00 107.60
  Z
  M 109.97 125.42
  C 105.37 137.45 87.71 138.28 82.43 126.47
  Q 81.05 123.39 81.03 116.82
  Q 80.99 106.34 80.98 96.20
  A 1.20 1.19 89.8 0 0 79.79 95.01
  Q 63.73 94.98 48.42 95.01
  Q 41.92 95.02 38.78 96.43
  C 31.87 99.54 30.03 105.26 30.02 112.88
  Q 29.98 140.21 30.01 167.75
  A 1.25 1.25 0.0 0 0 31.26 169.00
  L 481.26 169.00
  A 0.74 0.74 0.0 0 0 482.00 168.26
  Q 482.00 140.99 482.00 113.76
  C 482.00 105.78 480.56 99.78 473.31 96.48
  Q 470.12 95.03 463.45 95.00
  Q 447.56 94.93 431.59 95.03
  Q 431.05 95.03 431.05 95.57
  Q 430.91 105.48 431.01 115.39
  Q 431.09 122.17 429.83 125.46
  C 425.14 137.70 407.86 138.26 402.38 126.11
  Q 401.03 123.12 401.02 117.20
  Q 401.00 106.53 400.97 96.21
  A 1.21 1.21 0.0 0 0 399.76 95.00
  L 271.52 95.00
  Q 271.04 95.00 271.03 95.48
  Q 270.95 106.13 270.97 116.77
  Q 270.99 122.84 269.91 125.58
  C 265.21 137.43 247.86 138.22 242.49 126.59
  Q 241.06 123.49 241.03 116.93
  Q 240.98 106.41 240.98 96.22
  A 1.22 1.22 0.0 0 0 239.76 95.00
  L 111.52 95.00
  Q 111.04 95.00 111.03 95.48
  Q 110.94 106.32 110.98 116.90
  Q 110.99 122.73 109.97 125.42
  Z
  M 473.27 455.59
  C 477.39 453.68 482.00 448.35 482.00 443.25
  Q 482.01 321.45 482.00 199.98
  A 0.98 0.98 0.0 0 0 481.02 199.00
  L 30.27 199.00
  Q 30.00 199.00 30.00 199.28
  Q 30.01 318.25 29.99 437.32
  C 29.99 445.53 31.01 452.09 38.58 455.46
  Q 42.07 457.00 51.14 457.00
  Q 257.55 457.00 463.96 456.99
  Q 470.24 456.99 473.27 455.59
  Z"
                  />
                  <rect
                    fill="#777777"
                    x="97.18"
                    y="249.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="225.18"
                    y="249.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="353.18"
                    y="249.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="97.18"
                    y="313.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="225.18"
                    y="313.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="353.18"
                    y="313.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="97.18"
                    y="377.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="225.18"
                    y="377.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                  <rect
                    fill="#777777"
                    x="353.18"
                    y="377.11"
                    width="61.64"
                    height="29.78"
                    rx="14.20"
                  />
                </svg>
                <span id="current-week">{getTitle(weekToBeDisplayed)}</span>
                <FaChevronLeft
                  style={{ position: "absolute", right: "30px" }}
                  className="fa-chevron-left"
                  onClick={() =>{
                    changeTheData(getMondayOfPreviousWeek(weekToBeDisplayed))
                    
                  }
                  }
                />
                <FaChevronRight
                  style={{ position: "absolute", right: "10px" }}
                  className="fa-chevron-right"
                  onClick={() =>{
                    changeTheData(getMondayOfNextWeek(weekToBeDisplayed))
                    
                  }
                  }
                />
              </div>
            </div>
            <div id="timeSheet-main">
              <div id="timeSheet-main-heading" style={{position:"relative"}}>
              {FullDataOf_A_User &&
                  (FullDataOf_A_User.approved === true || FullDataOf_A_User.submitted === true) && (
                    <div
                      style={{
                        position: "absolute",
                        
                        width: "100%",
                        height: "100%",
                        zIndex: "1",
                        backgroundColor: "white",
                        opacity: "0.15",
                      }}
                    ></div>
                  )}
                <span id="word-Project">Project</span>
                <span id="word-Task">Task</span>
                <span id="allDate">
                
                  <DatesHeading
                    Mday={weekToBeDisplayed}
                    leave={FullDataOf_A_User && FullDataOf_A_User.leave}
                    code={userDetails && userDetails.empCode}
                    date={weekToBeDisplayed}
                    position={"employee"}
                  />
                </span>
              </div>
              <div id="timeSheet-update" >
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
                      borderRadius: " 0 0 30px 30px",
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
                ) : (
                  FullDataOf_A_User &&
                  FullDataOf_A_User.approved === true && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: "20",
                        width: "100%",
                        height: "100%",
                        zIndex: "20",
                        backgroundColor: "darkcyan",
                        opacity: "0.15",
                        borderRadius: " 0 0 30px 30px",
                      }}
                    ></div>
                  )
                )}
                {addNewRow || (FullDataOf_A_User && FullDataOf_A_User.data) ? (
                  <Rows
                    setSync={(e) => setSync(e)}
                    sync={sync}
                    setLoading={(e) => setLoading(e)}
                    setWeekToBeDisplayed={(e) => setWeekToBeDisplayed(e)}
                    code={userDetails && userDetails.empCode}
                    setSaveTheData={(e) => setSaveTheData(e)}
                    saveTheData={saveTheData}
                    setChanging={(e) => setChanging(e)}
                    date={weekToBeDisplayed}
                    url={FullDataOf_A_User && FullDataOf_A_User.data}
                    setAddNewRow={(e) => setAddNewRow(e)}
                    addNewRow={addNewRow}
                    setTotalHours={(e) => setTotalHours(e)}
                  />
                ) : (
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
                    <FaQuestion size={"40px"} />
                    <FaBoxOpen size={"100px"} />
                  </div>
                )}
              </div>
              <div id="timeSheet-main-footer">
                <MainFooter totalHours={totalHours} />
              </div>
            </div>
            <div id="timeSheet-footer">
              <div id="footer-controls">
                <button
                  style={{
                    backgroundColor: `${
                      addNewRow ||
                      (FullDataOf_A_User && FullDataOf_A_User.approved === true)
                        ? "lightgrey"
                        : "white"
                    }`,
                  }}
                  id="addNewRow-btn"
                  onClick={() => setAddNewRow(true)}
                >
                  <div id="plus-wrapper" className="dja">
                    <FaPlus className="fa-plus" />
                  </div>
                  <span>Add new row</span>
                </button>

                {FullDataOf_A_User && FullDataOf_A_User.submitted !== null ? (
                  FullDataOf_A_User.approved === null ? (
                    FullDataOf_A_User.submitted === true ? (
                      <button
                        onClick={()=>{
                          setLoading(true);
                          unsubmitHandler()
                          setTimeout(() => {
                            setSync(!sync)
                          }, 1000);
                          setLoading(false);
                          console.log("unsubmittedDone");
                        }}
                        style={{ backgroundColor: "blueviolet" }}
                        id="submit-btn"
                      >
                        UNSUBMIT
                      </button>
                    ) : (
                      <button
                        onClick={()=>{
                          setLoading(true);
                          submitHandler()
                          setTimeout(() => {
                            setSync(!sync)
                          }, 2000);
                          setLoading(false);
                          console.log("submittedDone");
                        }}
                        style={{ backgroundColor: "var(--submit-button)" }}
                        id="submit-btn"
                      >
                        SUBMIT
                      </button>
                    )
                  ) : FullDataOf_A_User.approved === true ? (
                    <button
                      style={{ backgroundColor: "white", color: "blue" }}
                      id="submit-btn"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      onClick={()=>{
                        setLoading(true)
                        submitHandler()
                        setTimeout(() => {
                            setSync(!sync)
                          },2000);
                          setLoading(false);
                          console.log("submittedDone");
                      }}
                      style={{ backgroundColor: "darkcyan" }}
                      id="submit-btn"
                    >
                      RESUBMIT
                    </button>
                  )
                ) : (
                  <button
                    onClick={()=>{
                      setLoading(true)
                      submitHandler()
                      setTimeout(() => {
                            setSync(!sync)
                          }, 2000);
                          setLoading(false);
                          console.log("submittedDone");
                    }}
                    style={{ backgroundColor: "var(--submit-button)" }}
                    id="submit-btn"
                  >
                    SUBMIT
                  </button>
                )}

                <button
                  onClick={() => setSaveTheData(true)}
                  className="dja"
                  id="submit-btn"
                  style={{ gap: "10px" }}
                >
                  SAVE <FaRegSave />
                </button>
              </div>
              <div id="info-of-appr-and-subm-date">
                <span id="emp-subm-date">
                  Employee Submission Date:{" "}
                  <span id="emp-subm-date-value">
                    {FullDataOf_A_User && FullDataOf_A_User.submitted
                      ? formatDate(FullDataOf_A_User.submittedDate)
                      : "Not Submitted"}
                  </span>{" "}
                </span>
                <span id="mang-appr-date">
                  Manager Approval Date:{" "}
                  <span id="mang-appr-date-input">
                    {
                      FullDataOf_A_User && FullDataOf_A_User.approved !== null
                        ? FullDataOf_A_User.approvedDate === null
                          ? "Yet to review"
                          : FullDataOf_A_User.approved === false 
                            ? "Rejected"
                            : formatDate(FullDataOf_A_User.approvedDate)
                        : "------"
                    }
                    {/* {FullDataOf_A_User && FullDataOf_A_User.submitted
                      ? FullDataOf_A_User.approvedDate === null
                      : FullDataOf_A_User && FullDataOf_A_User.approved !== true
                      ? "Yet to review"
                      : "Rejected"
                      ? FullDataOf_A_User &&
                        formatDate(FullDataOf_A_User.approvedDate)
                      : "------"} */}
                    {FullDataOf_A_User &&
                      !FullDataOf_A_User.approved &&
                      !(
                        FullDataOf_A_User.approved === null ||
                        FullDataOf_A_User.approvedDate === null
                      ) && (
                        <FaInfoCircle
                          onClick={() => setShowReason(true)}
                          id="info"
                        />
                      )}
                  </span>
                  {showReason && (
                    <Reason
                      setShowReason={(e) => setShowReason(e)}
                      content={FullDataOf_A_User.reason}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  );
  }
}

export default AccelbiEmp;
