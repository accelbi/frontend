import { useEffect } from "react";

function MainFooter ({totalHours}) {
    const sum = totalHours.reduce((a, b) => a + b, 0);
    useEffect(() => {
      
    },[sum])
    return (
        <div className="inner-timeSheet-footer">
                <div className="totalHours-info">Total hours worked : {sum}hrs</div>
                <div className="word-Total">Total</div>
                <div className="totalHours-wrapper">
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[0]}
                    className="totalHours"
                    id="totalHours1"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[1]}
                    className="totalHours"
                    id="totalHours2"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[2]}
                    className="totalHours"
                    id="totalHours3"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[3]}
                    className="totalHours"
                    id="totalHours4"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[4]}
                    className="totalHours"
                    id="totalHours5"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[5]}
                    className="totalHours"
                    id="totalHours6"
                  />
                  <input
                    type="number"
                    disabled
                    min={0}
                    value={totalHours[6]}
                    className="totalHours"
                    id="totalHours7"
                  />
                </div>
              </div>
    )
}

export default MainFooter