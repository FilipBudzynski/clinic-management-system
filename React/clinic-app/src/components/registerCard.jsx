import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import api from "../api";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { USERS_URL } from "../apiurls";

const RegisterCard = ({ toggleAuthMode }) => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    is_admin: false,
    is_active: false,
  });
  const postUserLink = "/users/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    try {
      await api.post(USERS_URL, formData);
      notifySuccess();
    } catch (error) {
      notifyError();
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const notifySuccess = () =>
    toast.success("Your Account has been created! 👌");
  const notifyError = () => toast.error("Something went wrong 😫");

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <Card className="my-5 border-0 shadow" style={{ width: "450px" }}>
        <Card.Body className="p-5">
          <Row>
            <Form noValidate validated={validated}>
              <Row>
                <span className="h2 mb-4 d-flex justify-content-center">
                  Register Now!
                </span>
              </Row>
              <p className="text-center blockquote-footer">
                Save time, streamline appointments, and access personalized
                care. Join our new system for hassle-free healthcare. Your
                well-being, simplified.
              </p>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                      onChange={handleInputChange}
                      value={formData.first_name}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      name="last_name"
                      onChange={handleInputChange}
                      value={formData.last_name}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </Form.Group>
              <Button
                className="w-100 mb-4"
                size="md"
                variant="primary"
                onClick={handleSubmit}
              >
                sign up
              </Button>
              <div className="text-center">
                <span
                  className="hoverOpacity text-dark text-decoration-none px-2"
                  onClick={toggleAuthMode}
                  style={{ cursor: "pointer" }}
                >
                  Have an account already?
                </span>
              </div>
            </Form>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default RegisterCard;
