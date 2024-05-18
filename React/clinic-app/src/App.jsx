import { Routes, Route } from "react-router-dom";
import Users from "./pages/users";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Doctors from "./pages/Doctors";
import Schedules from "./pages/Schedules";
import Visits from "./pages/Visits";
import "react-toastify/dist/ReactToastify.css";
import UserVisits from "./pages/UserVisits";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/my_visits" element={<UserVisits />} />
      </Routes>

      <div className="footer">
        <p>
          123 Medical Street, Cityville | Phone: (123) 456-7890 | Email:
          info@clinicmanagement.com
        </p>

        <p className="my-0">
          &copy; 2024 Clinic Management System | All rights reserved
        </p>
      </div>
    </>
  );
}

export default App;
