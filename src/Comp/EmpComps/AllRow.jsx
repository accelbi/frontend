import { useEffect , useState , useMemo } from "react";
import PlaceHolderRow from "./PlaceHolderRow";
import axios from "axios";

function AllRow({saveTheData, setChanging , setSaveTheInsideData , weekToBeDisplayed , setDataInside , dataInside , item , idx }) {
  const [allowAddProject, setAllowAddProject] = useState(false);
  const [allowAddTask, setAllowAddTask] = useState(false);
  const [data, setData] = useState()
  
  console.log("item",item)
  
  useEffect(()=>{

      setData(item && item)
      setHour0(item && item.hours[0])
      setHour1(item && item.hours[1])
      setHour2(item && item.hours[2])
      setHour3(item && item.hours[3])
      setHour4(item && item.hours[4])
      setHour5(item && item.hours[5])
      setHour6(item && item.hours[6])
  
  },[item , saveTheData])   

    
    const [hour0, setHour0] = useState();
    const [hour1, setHour1] = useState();
    const [hour2, setHour2] = useState();
    const [hour3, setHour3] = useState();
    const [hour4, setHour4] = useState();
    const [hour5, setHour5] = useState();
    const [hour6, setHour6] = useState();

  useEffect(() => {
    { 
      let newData = null ;
      dataInside && dataInside[idx] && dataInside[idx].hours && 
      (
      setDataInside(() => {

        newData = [...dataInside];
        newData[idx] && newData[idx].hours && (newData[idx].hours=[hour0,hour1,hour2,hour3,hour4,hour5,hour6])
        newData[idx] = data;
        console.log(newData)
        return newData;
                          }
                    )
      )

      if (item && newData && (item.project !== newData.project ||
          item.projectCode !== newData.projectCode ||
          item.task !== newData.task ||
          item.taskCode !== newData.taskCode ||
          item.taskDesc !== newData.taskDesc ||
          item.hours[0] !== newData.hours[0] ||
          item.hours[1] !== newData.hours[1] ||
          item.hours[2] !== newData.hours[2] ||
          item.hours[3] !== newData.hours[3] ||
          item.hours[4] !== newData.hours[4] ||
          item.hours[5] !== newData.hours[5] ||
          item.hours[6] !== newData.hours[6]) 
          ){
            setSaveTheInsideData(true)
           }

      
    }
  },[hour0,hour1,hour2,hour3,hour4,hour5,hour6,allowAddProject,allowAddTask])

  
  

  if (allowAddProject) {
    return (
      <>
      <PlaceHolderRow data={data && data} />
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
                value={data.project}
                onChange={(e) =>
                  setData({ ...data, project: e.target.value })
                }
                type="text"
                name="p-name"
                id="project-name"
              />
            </div>
            <div>
              <label htmlFor="p-code">Code:</label>
              <input
                value={data.projectCode}
                onChange={(e) =>{
                  setData({ ...data, projectCode: e.target.value })
                  setChanging(true)
                }
                }
                type="text"
                name="p-code"
                id="project-code"
              />
            </div>
            <button
              id="submit"
              onClick={() => {
                setAllowAddProject(false)
                setChanging(true)
              }}
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
      <PlaceHolderRow data={data && data} />
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
                value={data && data.task}
                onChange={(e) => {
                  setData({ ...data, task: e.target.value })
                  setChanging(true)
                }}
                type="text"
                name="t-name"
                id="task-name"
              />
            </div>
            <div>
              <label htmlFor="t-code">Code:</label>
              <input
                value={data && data.taskCode}
                onChange={(e) => {
                  setData({ ...data, taskCode: e.target.value })
                  setChanging(true)
                }}
                type="text"
                name="t-code"
                id="task-code"
              />
            </div>
            <div>
              <label htmlFor="t-desc">Desc:</label>

              <textarea
                value={data && data.taskDesc}
                onChange={(e) => {
                  setData({ ...data, taskDesc: e.target.value })
                  setChanging(true)
                }
                }
                name="t-desc"
                id="task-desc"
              ></textarea>
            </div>
            <button
              id="submit"
              onClick={() => {
                setAllowAddTask(false)
                setChanging(true)
              }}
              type="button"
            >
              Submit
            </button>
          </form>
        </section>
      </>
    );
  } else
  { 
    return (
    <>
    {data &&
    <div className="newRow">
      <div className="innerNewRow">
        
          <div  onClick={() => setAllowAddProject(true)} className="addProject">
            <span className="p-name">{data && data.project}</span>
            <span className="p-code">{data && data.projectCode}</span>
          </div>
        
        
          <div onClick={() => setAllowAddTask(true)}  className="addTask">
            <div>
              <span className="t-name">{data && data.task}</span>
              <span className="t-code">{data && data.taskCode}</span>
            </div>
            <div>
              <span className="t-desc">{data && data.taskDesc}</span>
            </div>
          </div>
        
        <div className="inputHours-wrapper">
          <input
            value={hour0}

            onChange={(e) => {
              setHour0(parseInt(e.target.value))
              setChanging(true)
            }}

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
            }}
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
            }}
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
            }}
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
            }}
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
            }}
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
            }}
            type="number"
            min={0}
            className="inputHours"
            id="inputHours7"
          />
        </div>
      </div>
    </div>
    }
    </>
    );
  }
}
export default AllRow;