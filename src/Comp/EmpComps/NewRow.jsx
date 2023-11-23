import { useEffect, useState } from "react";
import PlaceHolderRow from "./PlaceHolderRow";
import axios from "axios";

function NewRow({ setChanging1 ,url , weekToBeDisplayed , setAddNewRow , setSaveTheData , saveTheData , code , setWeekToBeDisplayed , setNewRowHours}) {
  const [changing, setChanging] = useState(false);
  const [allowAddProject, setAllowAddProject] = useState(false);
  const [allowAddTask, setAllowAddTask] = useState(false);
  const [project, setProject] = useState({ project: "", projectCode: "" });
  
  const [task, setTask] = useState({ task: "", taskCode: "", taskDesc: "" });
  const [data, setData] = useState({
    ...project,
    ...task,
    hours: [0, 0, 0, 0, 0, 0, 0],
  });
  const [hour0, setHour0] = useState(0);
  const [hour1, setHour1] = useState(0);
  const [hour2, setHour2] = useState(0);
  const [hour3, setHour3] = useState(0);
  const [hour4, setHour4] = useState(0);
  const [hour5, setHour5] = useState(0);
  const [hour6, setHour6] = useState(0);

  useEffect(() => {
    if (saveTheData) {
      console.log("data", data);
      (async () => {
        await axios.post(`http://localhost:8000/api/update/employee/newWork/${code}/${weekToBeDisplayed}`, { data });
      })();
      setChanging1(true)
      setAddNewRow(false);
      setSaveTheData(false);
      setWeekToBeDisplayed(weekToBeDisplayed)
      setNewRowHours([0, 0, 0, 0, 0, 0, 0])
    }
  }, [saveTheData]);

  

  useEffect(() => {
    /// to update the data in the UI
    setData({
      ...project,
      ...task,
      hours: [hour0, hour1, hour2, hour3, hour4, hour5, hour6],
    });
    setNewRowHours([hour0, hour1, hour2, hour3, hour4, hour5, hour6])
  }, [
    allowAddProject,
    allowAddTask,
    hour0,
    hour1,
    hour2,
    hour3,
    hour4,
    hour5,
    hour6,
  ]);

  useEffect(() => {
    if (allowAddProject || allowAddTask) {
      setChanging(true);
      setChanging1(true)
    }
  }, [allowAddProject , allowAddTask]);
 

  if (allowAddProject) {
    return (
      <>
        <PlaceHolderRow data={data} />
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
        <section style={{ zIndex: "10" }} id="addProject-form">
          <div className="title dja">
            PROJECT
            <div id="addProject-close">
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
          </div>
          <form action="#">
            <div>
              <label htmlFor="p-name">Name:</label>
              <input
                value={project.project}
                onChange={(e) =>
                  setProject({ ...project, project: e.target.value })
                }
                type="text"
                name="p-name"
                id="project-name"
              />
            </div>
            <div>
              <label htmlFor="p-code">Code:</label>
              <input
                value={project.projectCode}
                onChange={(e) =>
                  setProject({ ...project, projectCode: e.target.value })
                }
                type="text"
                name="p-code"
                id="project-code"
              />
            </div>
            <button
              id="submit"
              className="dja"
              onClick={() => setAllowAddProject(false)}
              type="button"
            >
              Submit
            </button>
          </form>
        </section>
      </>
    );
  } else if (allowAddTask) {
    return (
      <>
        <PlaceHolderRow data={data} />
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
        <section style={{ zIndex: "10" }} id="addTask-form">
          <div className="title dja">
            TASK
            <div id="addTask-close">
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
          </div>
          <form action="#">
            <div>
              <label htmlFor="t-name">Name:</label>
              <input
                value={task.task}
                onChange={(e) => setTask({ ...task, task: e.target.value })}
                type="text"
                name="t-name"
                id="task-name"
              />
            </div>
            <div>
              <label htmlFor="t-code">Code:</label>
              <input
                value={task.taskCode}
                onChange={(e) => setTask({ ...task, taskCode: e.target.value })}
                type="text"
                name="t-code"
                id="task-code"
              />
            </div>
            <div>
              <label htmlFor="t-desc">Desc:</label>

              <textarea
                value={task.taskDesc}
                onChange={(e) => setTask({ ...task, taskDesc: e.target.value })}
                name="t-desc"
                id="task-desc"
              ></textarea>
            </div>
            <button
              id="submit"
              className="dja"
              onClick={() => setAllowAddTask(false)}
              type="button"
            >
              Submit
            </button>
          </form>
        </section>
      </>
    );
  } else {
    return (
      <div  className="newRow">
        <div className="innerNewRow">
          {data.project ? (
            <div
              onClick={() => setAllowAddProject(true)}
              className="addProject"
            >
              <span className="p-name">{data.project}</span>
              <span className="p-code">{data.projectCode}</span>
            </div>
          ) : (
            <div
              onClick={() => setAllowAddProject(true)}
              style={{ position: "relative" }}
              className="addProject"
            >
              + Click to add Details
            </div>
          )}
          {data.task ? (
            <div onClick={() => setAllowAddTask(true)} className="addTask">
              <div>
                <span className="t-name">{data.task}</span>
                <span className="t-code">{data.taskCode}</span>
              </div>
              <div>
                <span className="t-desc">{data.taskDesc}</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setAllowAddTask(changing)}
              style={{
                position: "relative",
                color: `${changing ? "black" : "lightgrey"}`,
              }}
              className="addTask"
            >
              + Click to add Details
            </div>
          )}
          {(changing) ?
          <div className="inputHours-wrapper">
            <input
              value={hour0}
              onChange={(e) => {
                setHour0(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours1"
            />
            <input
              value={hour1}
              onChange={(e) => {
                setHour1(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours2"
            />
            <input
              value={hour2}
              onChange={(e) => {
                setHour2(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours3"
            />
            <input
              value={hour3}
              onChange={(e) => {
                setHour3(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours4"
            />
            <input
              value={hour4}
              onChange={(e) => {
                setHour4(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours5"
            />
            <input
              value={hour5}
              onChange={(e) => {
                setHour5(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours6"
            />
            <input
              value={hour6}
              onChange={(e) => {
                setHour6(parseInt(e.target.value))
                setChanging(true)

setChanging1(true)              }
              }
              type="number"
              min={0}
              className="inputHours"
              id="inputHours7"
            />
          </div>
          :
          <div className="inputHours-wrapper">
            {Array.from({ length: 7 }).map((_, i) => (
              <input
              style={{
                color: `${changing ? "black" : "lightgrey"}`,
              }}
                key={i}
                value={hour0} // You may want to set different values for each input
                type="number"
                min={0}
                className="inputHours"
                id={`inputHours${i + 1}`} // Use a unique ID for each input if needed
              />
            ))}
          </div>
          }
        </div>
      </div>
    );
  }
}
export default NewRow;
