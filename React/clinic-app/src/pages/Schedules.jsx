import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import { SCHEDULES_URL } from "../apiurls";
import SchedulesTable from "../components/SchedulesTable";
import AddScheduleModal from "../components/AddScheduleModal";

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [show, setShow] = useState(false);
  // NOTE: not needed now, dont have add modal
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const fetchSchedules = async () => {
    const response = await api.get(SCHEDULES_URL);
    setSchedules(response.data);
  };

  useEffect(() => {
    fetchSchedules();
  }, [show]);

  return (
    <div>
      <AddScheduleModal show={show} handleClose={handleClose} />
      <Navbar />
      <div className="container my-4 ">
        <h1>Scheduels</h1>
        <SchedulesTable schedules={schedules} />
        <button className="whiteButton" onClick={handleShow}>
          Add Schedule
        </button>
      </div>

      <div className="blueBackground"></div>
    </div>
  );
};
export default Schedules;
