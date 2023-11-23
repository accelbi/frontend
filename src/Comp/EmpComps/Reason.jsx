import { FaRegCircleXmark } from "react-icons/fa6";
function Reason ({content , setShowReason}){
    return(
        <>
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
        <section style={{ zIndex: "10" }} id="reason-box">
          <div className="title dja">
            REASON
            <div id="addProject-close">
              <FaRegCircleXmark onClick={()=>setShowReason(false)} className="fa-regular fa-circle-xmark"/>
            </div>
          </div>
          <div id="reason">
            {content}
          </div>
        </section>
        </>
    )
}

export default Reason;

