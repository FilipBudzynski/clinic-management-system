import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import api from "../api";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TOKEN, CURRENT_USER } from "../apiurls";

const LoginCard = ({ toggleAuthMode }) => {
  const [validated, setValidated] = useState(false);
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    try {
      const requestTokenData = `username=${formData.username}&password=${formData.password}`;
      await api.post(TOKEN, requestTokenData).then((response) => {
        console.log(response.data);
        const accessToken = `${response.data.token_type} ${response.data.access_token}`;
        sessionStorage.setItem("accessToken", accessToken);
        notifySuccess();
        handleUserData(accessToken);
        window.location.href = "/";
      });
    } catch (error) {
      console.error(error.response.data);
      notifyError(error);
    }
  };

  const handleUserData = async (accessToken) => {
    await api
      .get(CURRENT_USER, {
        headers: { Authorization: accessToken },
      })
      .then((response) => {
        setUserData(response.data);
        sessionStorage.setItem("userGroup", response.data.groupe);
        sessionStorage.setItem("isActive", response.data.is_active);
        console.log(response.data);
      })
      .catch((error) => {
        window.location.href = "/login";
        console.log(error);
      });
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const notifySuccess = () => toast.success("Logged in succesfuly! 👌");
  const notifyError = (err) =>
    toast.error(`Error: ${JSON.stringify(err.response.data.detail)}`);

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
                <p className=" h2 mb-3 d-flex justify-content-center">
                  Log in!
                </p>
              </Row>
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
                Log in
              </Button>
              <div className="text-center">
                <p className="h5 mb-4">New here?</p>
                <p className="text-center blockquote-footer">
                  Join our Clinic Management System to streamline patient visits
                  and empower your medical practice. Register now for efficient
                  appointment management and organized patient records. Elevate
                  your clinic experience today!
                </p>
                <a
                  className="hoverOpacity text-dark text-decoration-none px-2"
                  onClick={toggleAuthMode}
                  style={{ cursor: "pointer" }}
                >
                  Register Now!
                </a>
              </div>
            </Form>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default LoginCard;
