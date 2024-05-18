import Modal from "react-bootstrap/Modal";
import api from "../api";
import { DOCTORS_URL, SCHEDULES_URL } from "../apiurls";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export default function AddScheduleModal({ show, handleClose }) {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctor_id: "",
    day: "",
    start: "",
    finish: "",
  });

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    const inputValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      day: date.nativeEvent.target.value,
    });
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get(DOCTORS_URL);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(SCHEDULES_URL, formData);
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  useEffect(() => {
    fetchDoctors();
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="d-flex justify-content-between">
        <Form className="mx-auto" style={{ width: "200px" }}>
          <div className="d-flex align-items-center justify-content-center">
            <Form.Group
              className="mb-3 d-flex align-items-center flex-column"
              controlId="formBasicDoctor"
            >
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                style={{ width: "150%" }}
                aria-label="doctor"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select Doctor
                </option>
                {doctors.map((doctor, index) => (
                  <option key={index} value={doctor.id}>
                    {doctor.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between">
            <Form.Group
              className="mb-3 d-flex align-items-center flex-column"
              controlId="formBasicTimeStart"
            >
              <Form.Label>Start Time:</Form.Label>
              <input
                type="time"
                onChange={handleInputChange}
                id="start_time"
                name="start"
                min="07:00"
                max="23:59"
                step="900"
                value={formData.start}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 d-flex align-items-center flex-column"
              controlId="formBasicTimeEnd"
            >
              <Form.Label>End Time:</Form.Label>
              <input
                type="time"
                onChange={handleInputChange}
                id="finish"
                name="finish"
                min="07:00"
                max="23:59"
                step="900"
                value={formData.finish}
              />
            </Form.Group>
          </div>

          <Form.Group
            className="mb-3 d-flex align-items-center flex-column"
            controlId="formBasicDate"
          >
            <Form.Label>Select a Date:</Form.Label>
            <input
              type="date"
              name="day"
              selected={formData.day}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="mx-auto">
        <button className="whiteButton" onClick={handleClose}>
          Close
        </button>
        <button className="whiteButton" onClick={handleSubmit}>
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
}
