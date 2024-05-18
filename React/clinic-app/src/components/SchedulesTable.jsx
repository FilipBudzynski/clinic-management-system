import DoctorInfoModal from "./DoctorInfoModal";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import api from "../api";
import { DOCTORS_URL } from "../apiurls";
import Form from "react-bootstrap/Form";

export default function SchedulesTable({ schedules }) {
  const [show, setShow] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [scheduleToShow, setScheduleToShow] = useState({});
  const [search, setSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const handleClose = () => setShow(false);
  const fieldsToSearch = ["day", "doctor.username"];

  const handleShowSchedule = (scheduleData) => {
    setScheduleToShow(scheduleData);
    setShow(true);
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get(DOCTORS_URL);
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <>
      <div
        className="px-3 py-3 shadow rounded-3 mb-5"
        style={{ minHeight: "60vh", backgroundColor: "white" }}
      >
        <div className="d-flex mb-3 justify-content-between">
          <SearchBar
            haveSearch={false}
            haveSelect={true}
            selectValues={doctors.map((doctor) => doctor.username)}
            setSelectSearch={(e) => setDoctorSearch(e.target.value)}
            haveDate={true}
            setDateSearch={(e) => setDateSearch(e.nativeEvent.target.value)}
          />
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Doctor</th>
              <th scope="col">Day</th>
              <th scope="col">Starting</th>
              <th scope="col">Finishing</th>
            </tr>
          </thead>
          <tbody>
            {schedules
              .filter((item) => {
                const searchTerm = search.toLowerCase();
                return (
                  (doctorSearch === ""
                    ? item
                    : item.doctor.username.includes(doctorSearch)) &&
                  (dateSearch === "" ? item : item.day.includes(dateSearch))
                );
              })
              .map((schedule, index) => (
                <tr
                  key={schedule.id}
                  onClick={() => handleShowSchedule(schedule)}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{schedule.doctor.username}</td>
                  <td>{schedule.day}</td>
                  <td>{schedule.start}</td>
                  <td>{schedule.finish}</td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
