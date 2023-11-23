import axios from "axios";
import Cards from "./SuperComps/Cards";
import React, { useState, useEffect } from "react";
import { FaBars, FaEdit, FaExclamationTriangle, FaPlus  , FaSpinner } from "react-icons/fa";
import { FaRegCircleXmark ,FaArrowRightFromBracket, FaExclamation } from "react-icons/fa6";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
function Super() {
  const [error , setError] = useState("")
  const [position, setPosition] = useState("Employees");
  const [info, setInfo] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const [changeName, setChangeName] = useState("");
  const [changeManCode, setChangeManCode] = useState("");
  const [changeCode, setChangeCode] = useState("");
  const [changeEmail, setChangeEmail] = useState("");
  const [changePhone, setChangePhone] = useState("");
  const [change, setChange] = useState(false);
  const [type, setType] = useState("Full-Time");
  const [loading, setLoading] = useState(true);
  
  const { user, isLoading } = useUser();
  let headers = {};
  async function downloadFirebaseUserDetails() {
    const token = user && (await user.getIdToken());
    headers = token ? { authtoken: token } : {};
  }
  const [userDetails, setUserDetails] = useState(null);

  async function downloadUserDetails() {
    const response = await axios.get(
      `http://localhost:8000/api/user/data/${user.email}`,
      { headers }
    );
    console.log("response", response.data);
    setUserDetails(response.data);
  }

  useEffect(() => {
    downloadFirebaseUserDetails();
    downloadUserDetails();
    console.log(userDetails && userDetails)
  },[isLoading])

  const input = {
    padding: "5px",
    fontSize: "1rem",
    borderRadius: "5px",
    backgroundColor: "var(--light-acellbi-theme)",
    border: "1px solid grey",
    color: "var(--submit-button)",
    width:"150px"
  };
  const label = {
    display: "flex",
    justifyContent: "space-between",
    gap: "5px",
    width: "100%",
    position: "relative",
  };
  const back = {
    position: "fixed",
    top: "10px",
    right: "10px",
    padding: "10px",
    fontSize: "1.5rem",
    backgroundColor: "var(--acellbi-theme)",
    color: "white",
    zIndex: "3",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const submitHandler = async () => {
    setError("")
    let data2 = {} ;
    if (position === "Managers") {
    data2 = {
      name: changeName,
      code: changeManCode,
      email: changeEmail,
      phone: changePhone,
      type: "Full-Time(M)",
    };
    } else {
      data2 = {
        manCode: changeManCode,
        code: changeCode,
        email: changeEmail,
        phone: changePhone,
        type: type,
      };
    }
    if (changeCode === "" && position === "employee") setError("Employee Code feild cannot be empty");
    else if (changeCode.length < 6 && position === "Employees")  setError(`${ position === "Employees" ? "Employee" : "Manager"} Code min length is 6`);
    else if (changeManCode === "") setError("Mananger Code feild cannot be empty");
    else if (changeManCode.length < 6) setError("Mananger Code min length is 6");
    else if (changeEmail === "") setError("Email feild cannot be empty");
    else if (changePhone === "") setError("Phone feild cannot be empty");
    else {
    let response;
    try {
    if (position === "Employees") {
      response = await axios.post(
        `http://localhost:8000/api/update/add/employee`,
        { data2 }
      );
      if (response.data.error) setError(response.data.error);
      else {
        setAddNew(false);
        setChange(!change);
      }
    } else if (position === "Managers") {
      
      response = await axios.post(
        `http://localhost:8000/api/update/add/manager`,
        { data2 }
      );

      response = await axios.post(
        `http://localhost:8000/api/update/adding/managerAccount`,
        { data2 }
      );

      await createUserWithEmailAndPassword(getAuth(), data2.email , data2.code);
      
      setAddNew(false);
      setChange(!change);
    }
    }
    catch (e) {
      setError(e.error);
    }
  }
  };

  async function getDataOfPersons() {
    setLoading(true);
    try {
      if (position === "Employees") {
        const getInfo = await axios.get("http://localhost:8000/api/user/all/employee");
        const arr = []
        getInfo.data.map((item) => arr.push(item.code));
        setInfo(arr);
      } else if (position === "Managers") {
        const getInfo = await axios.get("http://localhost:8000/api/user/all/manager");
        const arr = []
        getInfo.data.map((item) => arr.push(item.code));
        setInfo(arr);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, e.g., display an error message or retry the request
    }
  }
  
  const navigate = useNavigate();

  useEffect(() => {
    getDataOfPersons();
  }, [position]);

  useEffect(() => {
    getDataOfPersons();
  }, [change]);

  useEffect(() => {
    setError("")
  }, [addNew]);

  if( userDetails && userDetails.position === "super") {
    return (
      <>
      <div style={{ position: "relative" }}>
        {addNew && (
          <>
            <div
              style={{
                position: "fixed",
                top: "0px",
                left: "0px",
                height: "100vh",
                width: "100vw",
                zIndex: "3",
                backgroundColor: "rgba(0,0,0)",
              }}
              id="overlay-cover"
            ></div>
            <section style={{ zIndex: "10", position: "fixed" }} id="leave-box">
              <div id="leave-title" className="dja">
                Add New 
                
                <div id="addProject-close">
                  <FaRegCircleXmark
                    onClick={() => setAddNew(false)}
                    className="fa-regular fa-circle-xmark"
                  />
                </div>

              </div>
              <h5 style={{ position: "absolute", top: "40px" , right :"110px" , letterSpacing:"2px" }}>
                    {position === "Employees" ? "Employee" : "Manager"}
                </h5>
              <div id="leave-form">
                {position === "Employees" ? (
                  <label style={label}>
                    Manager Id:{" "}
                    <input
                      style={input}
                      type="text"
                      name="name"
                      onChange={(e) => {
                        setChangeManCode(e.target.value);
                      }}
                    />
                    {/* <h6 style={{ position: "absolute", bottom: "-5px" }}>
                      Code
                    </h6> */}
                  </label>
                ) : (
                  <label style={label}>
                    Name:{" "}
                    <input
                      style={input}
                      type="text"
                      name="code"
                      onChange={(e) => {
                        setChangeName(e.target.value);
                      }}
                    />
                  </label>
                )}

                {position === "Employees" ? (
                  <label style={label}>
                    Employee Id:
                    <input
                      style={input}
                      type="text"
                      name="code"
                      onChange={(e) => {
                        setChangeCode(e.target.value);
                      }}
                    />
                    {/* <h6 style={{ position: "absolute", bottom: "-5px" }}>
                      Code
                    </h6> */}
                  </label>
                ) : (
                  <label style={label}>
                    Manager Id:
                    <input
                      style={input}
                      type="text"
                      name="code"
                      onChange={(e) => {
                        setChangeManCode(e.target.value);
                      }}
                    />
                    {/* <h6 style={{ position: "absolute", bottom: "-5px" }}>
                      Code
                    </h6> */}
                  </label>
                )}

                <label style={label}>
                  Email:{" "}
                  <input
                    style={input}
                    type="text"
                    name="code"
                    onChange={(e) => {
                      setChangeEmail(e.target.value);
                    }}
                  />
                </label>
                <label style={label}>
                  Phone:{" "}
                  <input
                    style={input}
                    type="text"
                    name="code"
                    onChange={(e) => {
                      setChangePhone(e.target.value);
                    }}
                  />
                </label>
                {position === "Employees" && (
                  <label style={label}>
                    Type:{" "}
                    <select
                      style={input}
                      name="code"
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Intern">Intern</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </label>
                )}
                <button onClick={submitHandler} id="submit">
                  Submit
                </button>
              </div>
              {error && (
                <div
                  style={{
                    color: "red",
                    position: "absolute",
                    bottom: "0",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {error}
                </div>
              )}
            </section>
          </>
        )}
        <div className="cover">Dimensions are too small</div>

        <div
          title="Sign Out"
          onClick={() => {
            signOut(getAuth());
            navigate("/");
          }}
          style={back}
        >
          <FaArrowRightFromBracket />
        </div>

        <section id="background">
          <div id="upper-box"></div>
          <div id="lower-box"></div>
        </section>
        <div
          className="dja"
          style={{
            position: "fixed",
            top: "5px",
            gap: "10px",
            width: "100%",
            zIndex: "2",
          }}
        >
          <button
            onClick={() => setPosition("Employees")}
            id="submit"
            style={{
              backgroundColor: `${
                position === "Employees"
                  ? "var(--submit-button)"
                  : "var(--acellbi-theme)"
              }`,
            }}
          >
            Employees
          </button>
          <button
            onClick={() => setPosition("Managers")}
            id="submit"
            style={{
              backgroundColor: `${
                position === "Managers"
                  ? "var(--submit-button)"
                  : "var(--acellbi-theme)"
              }`,
            }}
          >
            Managers
          </button>
        </div>
        <section id="timeCard" style={{ position: "relative" }}>
          <div
            id="timeSheet-card"
            style={{
              margin: "auto",
              marginTop: "50px",
              height: "calc(100% - 70px)",
            }}
          >
            <div id="timeSheet-title">
              <span>{position}</span>
            </div>
            {loading && (
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  left: "0px",
                  height: "100vh",
                  width: "100vw",
                  zIndex: "3",
                  backgroundColor: "rgba(0,0,0)",
                }}
                id="overlay-cover"
              >
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
              </div>
            )}
            <>
              <div
                id="timeSheet-main"
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "30px",
                  overflowY: "scroll",
                }}
              >
                <>
                  {info.map((item) => (
                    <Cards
                      loading={loading}
                      setLoading={(e) => setLoading(e)}
                      change={change}
                      setChange={(e) => setChange(e)}
                      position={position}
                      code={item}
                      key={item.code}
                    />
                  ))}
                </>
              </div>
              <div id="timeSheet-footer">
                <div className="dja" style={{ width: "100%" }}>
                  <button onClick={() => setAddNew(true)} id="addNewRow-btn">
                    <div id="plus-wrapper" className="dja">
                      <FaPlus className="fa-plus" />
                    </div>
                    <span>Add New</span>
                  </button>
                </div>
              </div>
            </>
          </div>
        </section>
      </div>
    </>
    )
  } else if (userDetails && userDetails.position !== "super") {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "var(--submit-button)",
        backgroundColor: "var(--light-acellbi-theme)",
        fontSize: "2rem",
        fontWeight: "bold",
      }}
    >
      <FaExclamationTriangle
        style={{ marginRight: "20px", fontSize: "3rem", color: "darkred" }}
      />
      Not Authorized Super User
    </div>
  );
    }
}

export default Super;
