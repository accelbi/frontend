import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employee from "./Comp/Employee";
import Landing from "./Comp/Landing";
import Login from "./Comp/Login";
import Signup from "./Comp/Signup";
import Super from "./Comp/Super";
import Manager from "./Comp/Manager";
import Review from "./Comp/ManagerComps/Review";
import ForgotPassword from "./Comp/ForgotPassword";


function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/super" element={<Super />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword/:emailFromLoginForm" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/manager/review/:code/:MonDate" element={<Review />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
