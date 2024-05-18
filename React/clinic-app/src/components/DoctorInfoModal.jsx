import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../api";
import React, { useState, useEffect } from "react";
import { DOCTORS_URL, UPDATE_DOCTOR, SPECIALITIES_URL } from "../apiurls";
import { ToastContainer, toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function DoctorInfoModal({
  show,
  handleClose,
  onApplyChanges,
  doctorInfo,
}) {
  const [specialities, setSpecialities] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    speciality: "",
  });
  const sessionToken = sessionStorage.getItem("accessToken");
  const group = sessionStorage.getItem("userGroup");
  const updateDoctorURL = UPDATE_DOCTOR + "/" + doctorInfo.id;
  const handleSubmit = async () => {
    await api
      .patch(updateDoctorURL, formData, {
        headers: {
          Authorization: sessionToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        onApplyChanges();
        toast.success("Updated the user successfuly 🎉");
        console.log(response);
      })
      .catch((error) => {
        toast.error("Something went wrong with the update 😕");
        console.log(error);
      });
  };

  useEffect(() => {
    fetchSpecialities();
    setFormData({
      email: doctorInfo.email,
      first_name: doctorInfo.first_name,
      last_name: doctorInfo.last_name,
      speciality: doctorInfo.speciality,
    });
  }, [show]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };
  const fetchSpecialities = async () => {
    try {
      const response = await api.get(SPECIALITIES_URL);
      setSpecialities(response.data);
      console.log(specialities);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    handleClose();
    handleSubmit();
    setIsEditMode(false);
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 w-200" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                disabled
                name="username"
                onChange={handleInputChange}
                value={doctorInfo.username}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!isEditMode}
                    placeholder="First Name"
                    name="first_name"
                    onChange={handleInputChange}
                    value={formData.first_name}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={!isEditMode}
                    placeholder="Last Name"
                    name="last_name"
                    onChange={handleInputChange}
                    value={formData.last_name}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBasicSpeciality">
              <Form.Label>Speciality</Form.Label>
              <Form.Select
                aria-label="Speciality"
                disabled={!isEditMode}
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
              >
                <option value="" disabled hidden>
                  Select Speciality
                </option>
                {specialities.map((speciality, index) => (
                  <option key={index} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                disabled={!isEditMode}
                placeholder="Enter email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {group === "Admin" ? (
            <>
              {isEditMode ? (
                <Button variant="primary" onClick={handleSaveClick}>
                  Save
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
            </>
          ) : null}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
