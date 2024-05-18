import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../api";
import { useState, useEffect } from "react";
import { UPDATE_USER } from "../apiurls";
import { ToastContainer, toast } from "react-toastify";

export default function UserInfoModal({
  show,
  userInfo,
  handleClose,
  onApplyChanges,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    is_active: true,
  });
  const sessionToken = sessionStorage.getItem("accessToken");
  const group = sessionStorage.getItem("userGroup");

  const updateUserUrl = UPDATE_USER + "/" + userInfo.id;
  const handleSubmit = async () => {
    await api
      .patch(updateUserUrl, formData, {
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
    setFormData({
      email: userInfo.email,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      is_active: Boolean(userInfo.is_active),
    });
  }, [userInfo, show]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    handleClose();
    handleSubmit();
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    handleClose();
    setIsEditMode(false);
  };

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  console.log();

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                disabled
                name="username"
                onChange={handleInputChange}
                value={userInfo.username}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                disabled={!isEditMode}
                name="first_name"
                onChange={handleInputChange}
                value={formData.first_name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                disabled={!isEditMode}
                name="last_name"
                onChange={handleInputChange}
                value={formData.last_name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                disabled={!isEditMode}
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Active</Form.Label>
              <Form.Check
                type="checkbox"
                id="check_is_active"
                disabled={!isEditMode}
                name="is_active"
                onChange={handleInputChange}
                checked={formData.is_active}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isEditMode ? (
            <Button variant="primary" onClick={handleSaveClick}>
              Save
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleEditClick}>
              Edit
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
