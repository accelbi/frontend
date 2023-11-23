function PlaceHolderRow(data) {
    
    data = data.data;
    return (

    <div className="newRow">
        <div className="innerNewRow">
          
            <div
              className="addProject"
            >
              <span className="p-name">{data && data.project}</span>
              <span className="p-code">{data && data.projectCode}</span>
            </div>
          
          
            <div className="addTask">
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
              value={data && data.hours[0]}
              type="number"
              className="inputHours"
              id="inputHours1"
            />
            <input
              value={data && data.hours[1]}
              type="number"
              className="inputHours"
              id="inputHours2"
            />
            <input
              value={data && data.hours[2]}
              type="number"
              className="inputHours"
              id="inputHours3"
            />
            <input
              value={data && data.hours[3]}
              type="number"
              className="inputHours"
              id="inputHours4"
            />
            <input
              value={data && data.hours[4]}
              type="number"
              className="inputHours"
              id="inputHours5"
            />
            <input
              value={data && data.hours[5]}
              type="number"
              className="inputHours"
              id="inputHours6"
            />
            <input
              value={data && data.hours[6]}
              type="number"
              className="inputHours"
              id="inputHours7"
            />
          </div>
        </div>
      </div>
    )
}
export default PlaceHolderRow;