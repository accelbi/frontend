import React from "react";
import { useState, useEffect } from "react";
import logo from "./StyleAndAssets/accelbi-logo-color.png";
import axios from "axios";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import {
  getMondayOfCurrentWeek,
  getTitle,
  getMondayOfPreviousWeek,
  getMondayOfNextWeek,
  getThisWeekDatesArray,
  formatDate,
  getFormattedTodaysDateModified,
} from "./helperComps/HelperForDates";
import { FaBars, FaEdit, FaSyncAlt , FaQuestion , FaBoxOpen, FaSpinner } from "react-icons/fa";
import {
  FaCalendarDays,
  FaChevronLeft,
  FaChevronRight,
  FaFileExcel,
  FaFilePdf,
  FaUser,
  FaArrowLeft,
  FaAnglesLeft,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import PassChangeForm from "./EmpComps/PassChangeForm";
import DisplayRow from "./ManagerComps/DisplayRow";
import Review from "./ManagerComps/Review";
import "./StyleManager/Mstyle.css";
import "./StyleManager/Mdownloads.css";
import "./StyleManager/MtimeSheet-card.css";
import "./StyleManager/MtimeSheet-footer.css";
import "./StyleManager/MtimeSheet-main-footer.css";
import "./StyleManager/MtimeSheet-newRow.css";
import "./StyleManager/Muser-details.css";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Manager() {
  const navigate = useNavigate();
  const [showThat, setShowThat] = useState(false);
  const [review, setReview] = useState(false);
  const [reviewUrl, setReviewUrl] = useState("");
  const [weekToBeDisplayed, setWeekToBeDisplayed] = useState(
    getMondayOfCurrentWeek()
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showPasChangeForm, setShowPasChangeForm] = useState(false);
  const [changing, setChanging] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const { user, isLoading } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [code, setCode] = useState(null);
  const [data, setData] = useState(null);
  const [name, setName] = useState(null);
  const [loading , setLoading] = useState(true)
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

  function changeTheData(weekToBeDisplayedNext) {
    setWeekToBeDisplayed(weekToBeDisplayedNext);
  }

  let headers = {};
  async function downloadFirebaseUserDetails() {
    const token = user && (await user.getIdToken());
    headers = token ? { authtoken: token } : {};
    console.log("headers", headers);
  }
  async function downloadUserDetails() {
    const response = await axios.get(
      `http://localhost:8000/api/user/data/${user.email}`,
      { headers }
    );
    console.log("response.data", response.data);

    setCode(response.data.code);
    setUserDetails(response.data);
  }

  async function getData() {
    setLoading(true)
    const response2 = await axios.get(
      `http://localhost:8000/api/fetch/manReview/${code}/${weekToBeDisplayed}`
    );
    console.log("response2.data", response2.data);
    setData(response2.data);
    if (response2.data) setLoading(false)
  }
  const [monDateUsed, setMonDateUsed] = useState(null);
  const [empCodeUsed, setEmpCodeUsed] = useState(null);

  const styleForMenuItems = {
    top: "65px",
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
  const styleForFaEdit = {
    transform: `translateY(${showMenu ? "60px" : "0px"})`,
  };
  const styleForFaArrowRightFromBracket = {
    transform: `translateY(${showMenu ? "120px" : "0px"})`,
  };

  const exportToExcel = (jsonData) => {
    if (jsonData !== null) {
      const ws = XLSX.utils.json_to_sheet(jsonData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${empCodeUsed}'s ${monDateUsed} timeSheet.xlsx`);
    } else {
      alert("No data to export");
    }
  };

  const exportToPDF = (jsonData) => {
    let columns = jsonData[0] && Object.keys(jsonData[0]);
    let columnWidths = [];
    columns = columns.map((item , index)=>{ 
      if (item === "project") {
        columnWidths[index] = 17
        return "Project (P)"
      } else if (item === "projectCode") {
        columnWidths[index] = 17
        return "Code (P)"
      } else if (item === "task") {
        columnWidths[index] = 17  
        return "Task (T)"
      } else if (item === "taskCode")  {
        columnWidths[index] = 17
        return "Code (T)"
      } else if (item === "taskDesc")  {
        columnWidths[index] = 45
        return "Descrp. (T)"
      } else {
        columnWidths[index] = 22
        return item
      }    })
    const dataOnly = jsonData.map((el) => [...Object.values(el)]);

    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Define the table's x and y coordinates
    const x = 10;
    const y = 10;

    // Set the table's column widths and row heights
    
    const rowHeight = 10;

    // Create the table
    doc.autoTable({
      head: [columns],
      body: dataOnly,
      startY: y,
      headStyles: { fillColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
        6: { cellWidth: columnWidths[6] },
      },
      margin: { top: y + rowHeight },
    });

      // Save or display the PDF
      doc.save(`${empCodeUsed}'s ${monDateUsed} timeSheet.pdf`);
    
  };
// toggle
  useEffect(() => {
    if (!isLoading) {
      downloadFirebaseUserDetails();
      downloadUserDetails();
    }
  }, [isLoading]);

  useEffect(() => {
    if (userDetails !== null && weekToBeDisplayed !== null) getData();
    console.log("userDetails", userDetails);
    console.log("data", data);
  }, [weekToBeDisplayed, userDetails, changing]);

  return (
    <>
      <div className="Mcover">Dimensions are too small</div>
      <div
        title="Go back"
        onClick={() => {
          if (review === true) {
            setReview(false);
            getData();
          } else window.history.back();
        }}
        className="dja"
        style={back}
      >
        <FaArrowLeft />
      </div>

      <div
        title="Refresh"
        onClick={() => {
          getData();
        }}
        className="dja"
        style={{ ...back, left: "10px", right: "auto" }}
      >
        <FaSyncAlt />
      </div>

      <section id="Mbackground">
        <div id="Mupper-box"></div>
        <div id="Mlower-box"></div>
      </section>

      {showPasChangeForm && (
        <PassChangeForm
          setShowPasChangeForm={(e) => setShowPasChangeForm(e)}
          email={userDetails && userDetails.email} /// pass token here
        />
      )}

      <div id="menu">
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

      {user && userDetails && userDetails.position === "manager" && (
        <div
          className="toggleBetweenManAndEmp"
          onMouseEnter={() => setShowThat(true)}
          onMouseLeave={() => setShowThat(false)}
          onClick={() => navigate("/employee")}
        >
          <FaAnglesLeft /> {showThat && "Employee"}
        </div>
      )}

      <section id="MtimeCard">
        <div id="Mlogo-and-nav">
          <div id="Mlogo-conatiner">
            <img src={logo} alt="accelbi-logo-color" />
          </div>

          <div id="Mdownloads">
            <div className="Mdown-wrapper" onClick={() => exportToPDF(pdfData)}>
              <div className="dja Micon-wrapper">
                <FaFilePdf className="Mfa-regular Mfa-file-pdf" />
              </div>
              Download PDF Report
            </div>
            <div
              className="Mdown-wrapper"
              onClick={() => exportToExcel(excelData)}
            >
              <div className="dja Micon-wrapper">
                <FaFileExcel className="Mfa-regular Mfa-file-excel" />
              </div>
              Download Excel Report
            </div>
          </div>

          <div id="Muser-full-details">
            <div id="Mprofile-pic" className="dja">
              <FaUser className="Mfa-solid Mfa-user" />
            </div>
            <div
              id="Muser-details"
              style={{ width: "auto", overflowY: "scroll" }}
            >
              <div className="Msbc-s-b Muser-name">
                {userDetails && userDetails.name}
              </div>
              <div className="Mac-s-b Muser-code">
                {userDetails && userDetails.code}
              </div>
            </div>
          </div>
        </div>
        {review === true ? (
          <Review
            setEmpCodeUsed={(e) => setEmpCodeUsed(e)}
            setMonDateUsed={(e) => setMonDateUsed(e)}
            manCode={userDetails && userDetails.code}
            name={name}
            reviewUrl={reviewUrl}
            setReview={(e) => setReview(e)}
            setChanging={(e) => setChanging(e)}
            changing={changing}
            setExcelData={(e) => setExcelData(e)}
            setPdfData={(e) => setPdfData(e)}
          />
        ) : (
          <div id="MtimeSheet-card">
            <div id="MtimeSheet-title">
              <span>Timesheet</span>
              <div id="Mcalender">
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
                <span id="Mcurrent-week">{getTitle(weekToBeDisplayed)}</span>
                <FaChevronLeft
                  style={{ position: "absolute", right: "30px" }}
                  onClick={() =>
                    changeTheData(getMondayOfPreviousWeek(weekToBeDisplayed))
                  }
                  className="Mfa-solid Mfa-chevron-left"
                />
                <FaChevronRight
                  style={{ position: "absolute", right: "10px" }}
                  onClick={() =>
                    changeTheData(getMondayOfNextWeek(weekToBeDisplayed))
                  }
                  className="Mfa-solid Mfa-chevron-right"
                />
              </div>
            </div>
            <div id="MtimeSheet-main">
              <div id="MtimeSheet-main-heading">
                <span className="Mb-text" id="Mword-name">
                  Employee Name
                </span>
                <span className="Mb-text" id="Mword-id">
                  Employee ID
                </span>
                <span className="Mb-text" id="Mword-type">
                  Type
                </span>
                <div id="Minner-details">
                  <span className="Ms-text empW" id="Mword-thw ">
                    Total hours worked
                  </span>
                  <span className="Ms-text" id="Mword-tp">
                    Total Projects
                  </span>
                  <span className="Ms-text empT" id="Mword-tt">
                    Total Tasks
                  </span>
                  <span className="Ms-text" id="Mword-la">
                    Leave Availed
                  </span>
                </div>
                <span className="Mb-text" id="Mword-status">
                  Status
                </span>
                <span className="Ms-text" id="Mword-sd">
                  Submision Date
                </span>
              </div>

              <div id="MtimeSheet-update">
                {loading ? (
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
                ) : data && data.length !== 0 ? (
                  data.map((item, index) => (
                    <DisplayRow
                      setName={(e) => setName(e)}
                      setReview={(e) => setReview(e)}
                      setReviewUrl={(e) => setReviewUrl(e)}
                      item={item}
                      key={index}
                    />
                  ))
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
            </div>

            <div id="MtimeSheet-footer"></div>
          </div>
        )}
      </section>
    </>
  );
}
export default Manager;
