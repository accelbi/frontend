import { getFormattedTodaysDateModified , getMondayDateOfAnyDayInTheWeek } from "../helperComps/HelperForDates";
import { useNavigate } from "react-router-dom";
function DisplayRow({ item , setReviewUrl , setReview , setName}) {
  const navigate = useNavigate();

  function reviewHandler () {
    setReviewUrl(item.review);
    setName(item.name);
    setReview(true);
  }

  return (
    <div className="MnewRow">
      <div className="MinnerNewRow">
        <span className="Mb-text" id="Mname">
          {item.name}
        </span>
        <span className="Mc Mb-text" id="Mid">
          {item.code}
        </span>
        <span className="Mb-text" id="Mtype">
          {item.type}
        </span>
        <div id="Minner-details">
          <span className="Mc Mb-text" id="Mthw">
            {item.totalHours}
          </span>
          <span className="Mc Mb-text" id="Mtp">
            {item.projects}
          </span>
          <span className="Mc Mb-text" id="Mtt">
            {item.tasks}
          </span>
          <span className="Mc Mb-text" id="Mla">
            {item.leave}
          </span>
        </div>
        <span className="Mb-text" id="Mstatus">
          {item.status === "pending" ? (
            <button onClick={reviewHandler} className="Mstatus-btn Mrev">Review</button>
          ) : item.status === "approved" ? (
            <button onClick={reviewHandler} className="Mstatus-btn Mapp">Approved</button>
          ) : item.status === "rejected" ? (
            <button onClick={reviewHandler} className="Mstatus-btn Mrej">Rejected</button>
          ) : null}
        </span>

        <span className="Mc Mss-text" id="Msd">
          {getFormattedTodaysDateModified(item.subDate)}
        </span>
      </div>
    </div>
  );
}
export default DisplayRow;
