import AllRow from "./AllRow";
import "../StyleAndAssets/addProject-form.css";
import "../StyleAndAssets/style.css";
import "../StyleAndAssets/timeSheet-newRow.css";
import NewRow from "./NewRow";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";

function Rows({
  sync ,
  setSync ,
  setLoading , 
  setSaveTheData,
  saveTheData,
  setChanging,
  date,
  url,
  setAddNewRow,
  addNewRow,
  code,
  setWeekToBeDisplayed,
  setTotalHours
}) {

  const [newRowHours , setNewRowHours] = useState([0, 0, 0, 0, 0, 0, 0])
  const [data, setData] = useState([]);
  const [dataInside, setDataInside] = useState([]);
  const [saveTheInsideData , setSaveTheInsideData] = useState(false)
  
  useEffect(() => {
    let newTotalHours = [0, 0, 0, 0, 0, 0, 0]

    {dataInside && dataInside.map((item) => {
       item && item.hours.forEach((hour, index) => {
          newTotalHours[index] += hour;
        });
      });

      newTotalHours.forEach((hour, index) => {
        newTotalHours[index] += newRowHours[index];
      })

      setTotalHours(newTotalHours);}
      console.log("dataInside", dataInside)
  }, [dataInside , newRowHours]);

  useEffect(() => {
    setLoading(true)
    if (saveTheData && saveTheInsideData ) {
      
      (async () => {
        await axios.post(
          `http://localhost:8000/api/update/employee/work/${code}/${date}`,
          { dataInside }
        );
      })();
      setAddNewRow(false);
      setSaveTheData(false);
      setSaveTheInsideData(false)
      console.log("data", data)
      console.log("dataInside", dataInside)
    }
    setLoading(false)
    setSync(!sync)
  }, [saveTheData]);

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const response = await axios.get(url);
        setData(response.data.data);
        console.log("response.data.data", response.data.data)
        setDataInside(response.data.data); 
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
      setLoading(false)
      
    })();
  }, [url , sync , date , saveTheData]);

  return (
    <>
    {data && data.map((item, index) => (
          <AllRow
          saveTheData={saveTheData}
            setSaveTheInsideData={(e)=>setSaveTheInsideData(e)}
            setChanging={(e) => setChanging(e)}
            weekToBeDisplayed={date}
            key={index}
            idx={index}
            setDataInside={(e) => setDataInside(e)}
            dataInside={dataInside}
            item={item}
          />
        ))}
      

      {addNewRow && (
        <NewRow
        setNewRowHours={(e)=>setNewRowHours(e)}
        setWeekToBeDisplayed={(e) => setWeekToBeDisplayed(e)}
          setChanging1={(e) => setChanging(e)}
          weekToBeDisplayed={date}
          code={code}
          saveTheData={saveTheData}
          setAddNewRow={(e) => setAddNewRow(e)}
          setSaveTheData={(e) => setSaveTheData(e)}
        />
      )}
    </>
  )
}

export default Rows;
