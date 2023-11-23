function PlaceHolderRow(data) {
    
    data = data.data;
    return (

    <div className="newRow">
        <div className="innerNewRow">
          {data.project ? (
            <div
              className="addProject"
            >
              <span className="p-name">{data.project}</span>
              <span className="p-code">{data.projectCode}</span>
            </div>
          ) : (
            <div
              style={{ position: "relative" }}
              className="addProject"
            >
              + Click to add Details
            </div>
          )}
          {data.task ? (
            <div className="addTask">
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
              style={{ position: "relative" }}
              className="addTask"
            >
              + Click to add Details
            </div>
          )}
          <div className="inputHours-wrapper">
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours1"
            />
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours2"
            />
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours3"
            />
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours4"
            />
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours5"
            />
            <input
              value={0}
              type="number"
              className="inputHours"
              id="inputHours6"
            />
            <input
              value={0}
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