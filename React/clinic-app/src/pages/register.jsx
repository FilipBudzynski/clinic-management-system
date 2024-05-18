import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RegisterCard from "../components/registerCard";
import LoginCard from "../components/loginCard";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsRegistering(location.pathname !== "/login");
  }, [location.pathname]);

  const gradientStyle = {
    backgroundImage: "linear-gradient(to bottom right, #8fbcff, #0d6efd)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Container className="p-4 d-flex justify-content-center mb-4 main-content">
          <Row>
            <Col md="6">
              <h1 className="my-5 display-3 fw-bold ls-tight px-3">
                The best offer <br />
                <span className="gradient-text" style={gradientStyle}>
                  for your clinic
                </span>
              </h1>

              <p className="px-3" style={{ color: "hsl(217, 10%, 50.8%)" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                quibusdam tempora at cupiditate quis eum maiores libero
                veritatis? Dicta facilis sint aliquid ipsum atque?
              </p>
            </Col>

            <Col
              md="6"
              className="px-5 d-flex align-items-center justify-content-center"
            >
              {isRegistering ? (
                <RegisterCard toggleAuthMode={toggleAuthMode} />
              ) : (
                <LoginCard toggleAuthMode={toggleAuthMode} />
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="blueBackground"></div>
    </>
  );
};
export default Register;
