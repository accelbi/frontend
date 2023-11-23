import React, { useEffect } from "react";
import { FaPen, FaCross, FaUser, FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
  FaMessage,
  FaPhone,
  FaRegEnvelope,
  FaRegCircleXmark,
  FaTriangleExclamation,
} from "react-icons/fa6";
import "../StyleAndAssets/style.css";
import axios from "axios";

function Cards({loading , setLoading , setChange, change, code, position }) {
  const [edit, setEdit] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [data, setData] = useState({});
  const [changeName, setChangeName] = useState("");
  const [changeCode, setChangeCode] = useState("");
  const [changeEmail, setChangeEmail] = useState("");
  const [changePhone, setChangePhone] = useState("");
  const [confirmCodeToDelete, setConfirmCodeToDelete] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [addMan, setAddMan] = useState(false); 
  const [addManCode, setAddManCode] = useState("");
  const [addManError, setAddManError] = useState("");
  

  const input = {
    padding: "5px",
    fontSize: "1rem",
    borderRadius: "5px",
    backgroundColor: "var(--light-acellbi-theme)",
    border: "1px solid grey",
    color: "var(--submit-button)",
  };
  const label = {
    display: "flex",
    justifyContent: "space-between",
    gap: "5px",
    width: "100%",
  };

  const fetchData = async () => {
    setLoading(true)
    let response;
    if (position === "Employees") {
      response = await axios.get(
        `http://localhost:8000/api/user/codeSpecific/employee/${code}`
      );
    } else if (position === "Managers") {
      response = await axios.get(
        `http://localhost:8000/api/user/codeSpecific/manager/${code}`
      );
    }
    console.log("response.data", response.data);
    setData(response.data);
    setAddManCode(response.data.manCode ? response.data.manCode : "");
    setLoading(false)
  };
  useEffect(() => {
    fetchData();
  }, [code]);

  const submitHandler = async () => {
    const data2 = {
      name: changeName,
      code: data.code,
      email: data.email,
      phone: changePhone,
    };
    if (changeName === "") data2.name = data.name;
    if (changeEmail === "") data2.email = data.email;
    if (changePhone === "") data2.phone = data.phone;
    let response;
    if (position === "Employees") {
      response = await axios.post(
        `http://localhost:8000/api/update/edit/${data.code}/employee`,
        { data2 }
      );
    } else if (position === "Managers") {
      response = await axios.post(
        `http://localhost:8000/api/update/edit/${data.code}/manager`,
        { data2 }
      );
    }
    await axios.post(
      `http://localhost:8000/api/user/edit/${data.code}`,
       { data2 }
    );
    setEdit(false);
    setChange(!change);
  };


  async function addManHandler () {
    if (addManCode === data.manCode) {
      setAddMan(false);
    } else {
      const response = await axios.post(
        `http://localhost:8000/api/update/addManToManBySuper/${data.code}`,
        { manCode: addManCode }
      );
      if (response){
        setAddMan(false);
        setChange(!change);
      } else {
        setAddManError(response.error);
    }
  }
  setAddMan(false);
}

  
  async function deleteHandler () {
    setDeleteError("");
    if (confirmCodeToDelete === data.code) {
      
      if (position === "Employees") {
        await axios.post(
          `http://localhost:8000/api/update/delete/${data.code}/employee`
        );
      } else if (position === "Managers") {
        await axios.post(
          `http://localhost:8000/api/update/delete/${data.code}/manager`
        );
      }
      setChange(!change);
      setDeleteItem(false);
    } else {
      setDeleteError("Code does not match");
    }
  };

  return (
    <>
      { data && (
        <>
       {deleteItem && (
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
          <section
            style={{
              zIndex: "10",
              position: "fixed",
              top: "50vh",
              right: "40vw",
            }}
            id="leave-box"
          >
            <div id="leave-title" className="dja">
              Delete
              <div id="addProject-close">
                <FaRegCircleXmark
                  onClick={() => setDeleteItem(false)}
                  className="fa-regular fa-circle-xmark"
                />
              </div>
            </div>
            <div id="leave-form">
              <h5
                className="dja"
                style={{
                  color: "red",
                  textAlign: "center",
                  gap: "5px",
                  fontWeight: "200",
                  padding: "0px 30px",
                }}
              >
                This might have serious effect!{" "}
                <FaTriangleExclamation style={{ fontSize: "60px" }} />{" "}
              </h5>

              <label style={label}>
                Code:{" "}
                <input
                  style={input}
                  type="text"
                  name="name"
                  placeholder={data.code}
                  onChange={(e) => {
                    setConfirmCodeToDelete(e.target.value);
                  }}
                />
              </label>

              <button onClick={deleteHandler} id="submit">
                Delete
              </button>
              {deleteError ? (
                <div style={{ color: "red" }}>{deleteError}</div>
              ) : (
                <div style={{ color: "red" }}>Losses may occur</div>
              )}
            </div>
          </section>
        </>
      )}
      {edit && data && (
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
          <section
            style={{
              zIndex: "10",
              position: "fixed",
              top: "50vh",
              right: "40vw",
            }}
            id="leave-box"
          >
            <div id="leave-title" className="dja">
              Edit
              <div id="addProject-close">
                <FaRegCircleXmark
                  onClick={() => setEdit(false)}
                  className="fa-regular fa-circle-xmark"
                />
              </div>
            </div>
            <div id="leave-form">
              <label style={label}>
                Name:{" "}
                <input
                  style={input}
                  type="text"
                  name="name"
                  placeholder={data.name}
                  onChange={(e) => {
                    setChangeName(e.target.value);
                  }}
                />
              </label>
              <label style={label}>
                Code:{" "}
                <input
                  style={input}
                  type="text"
                  name="code"
                  value={data.code}
                  
                />
              </label>
              <label style={label}>
                Email:{" "}
                <input
                  style={input}
                  type="text"
                  name="code"
                  value={data.email}
                  
                />
              </label>
              <label style={label}>
                Phone:{" "}
                <input
                  style={input}
                  type="text"
                  name="code"
                  placeholder={data.phone}
                  onChange={(e) => {
                    setChangePhone(e.target.value);
                  }}
                />
              </label>
              <button onClick={submitHandler} id="submit">
                Submit
              </button>
            </div>
          </section>
        </>
      )}
      {addMan && data && (
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
          <section
            style={{
              zIndex: "10",
              position: "fixed",
              top: "50vh",
              right: "40vw",
            }}
            id="leave-box"
          >
            <div id="leave-title" className="dja">
              Add Manager
              <div id="addProject-close">
                <FaRegCircleXmark
                  onClick={() => setAddMan(false)}
                  className="fa-regular fa-circle-xmark"
                />
              </div>
            </div>
            <div id="leave-form">
              <label style={label}>
                Code:{" "}
                <input
                  style={input}
                  type="text"
                  name="code"
                  value={addManCode}
                  onChange={(e) => {
                    setAddManCode(e.target.value);
                  }}
                />
              </label>
              <button onClick={addManHandler} id="submit">
                Submit
              </button>
            </div>
            {
              addManError && <div style={{position:"absolute" , bottom:"10px" , color:"red"}}>{addManError}</div>
            }
          </section>
        </>
      )}

      <div
        style={{
          margin: "auto",
          width: "200px",
          height: "300px",
          backgroundColor: "#63e3ed",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "column",
          padding: "5px",
          borderRadius: "15px",
          position: "relative",
        }}
      >
        <div
          className="dja"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "var(--bc-white) ",
            borderRadius: "50%",
          }}
        >
          <FaUser
            style={{ color: "var(--acellbi-theme) ", fontSize: "30px" }}
          />
        </div>
        <div
          style={{
            color: "var(--submit-button)",
            alignSelf: "flex-start",
            padding: "10px",
            fontWeight: "800",
          }}
        >
          {data && data.name}
          {!data && "Name not found"}
          <div style={{ color: "var(--bc-white)", fontWeight: "800" }}>
            {data && data.code}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--light-acellbi-theme)", maxWidth:"90%"  , overflowX: "scroll" }}>
          <div
            style={{
              color: "var(--submit-button)",
              
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px",
            }}
          >
            <FaRegEnvelope
              style={{
                backgroundColor: "var(--acellbi-theme)",
                color: "var(--bc-white)",
                padding: "3px",
                borderRadius: "50%",
                minWidth: "17px",
              }}
            />
            {data && data.email}
          </div>
          <div
            style={{
              color: "var(--submit-button)",
              
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px",
            }}
          >
            <FaPhone
              style={{
                backgroundColor: "var(--acellbi-theme)",
                color: "var(--bc-white)",
                padding: "3px",
                borderRadius: "50%",
                minWidth: "17px",
              }}
            />
            {data && data.phone}
          </div>
        </div>

        <div
          onClick={() => {
            setDeleteItem(true);
          }}
          className="dja"
          style={{
            color: "red",
            border: "2px solid var(--acellbi-theme)",
            backgroundColor: "var(--bc-white)",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            fontSize: "17px",
            position: "absolute",
            top: "33px",
            right: "-15px",
          }}
          title="Delete"
        >
          <FaRegTrashAlt />
        </div>
        <div
          onClick={() => {
            setEdit(true);
          }}
          className="dja"
          style={{
            color: "blue",
            border: "2px solid var(--acellbi-theme)",
            backgroundColor: "var(--bc-white)",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            fontSize: "15px",
            position: "absolute",
            top: "73px",
            right: "-15px",
          }}
          title="Edit"
        >
          <FaPen />
        </div>
        {
          position === "Managers" &&
          <div
          onClick={() => {
            setAddMan(true);
          }}
          className="dja"
          style={{
            color: "blue",
            border: "2px solid var(--acellbi-theme)",
            backgroundColor: "var(--bc-white)",
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            fontSize: "15px",
            position: "absolute",
            top: "113px",
            right: "-15px",
          }}
          title="Add Manager"
        >
          <FaPlus />
        </div>
        }
      </div>
      </>
      )}
    </>
  );
}
export default Cards
