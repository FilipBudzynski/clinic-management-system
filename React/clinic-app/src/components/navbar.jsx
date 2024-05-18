import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Container } from "react-bootstrap";

export default function MyNavbar() {
  const token = sessionStorage.getItem("accessToken");
  const group = sessionStorage.getItem("userGroup");
  return (
    <Navbar
      expand="lg"
      className="px-5 bg-body-tertiary d-flex justify-content-between"
    >
      <Container className="px-5">
        <Navbar.Brand href="/" className="gradient-text">
          Clinic-Application
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {group === "Admin" ? (
              <>
                <Nav.Link href="/">Patients</Nav.Link>
                <Nav.Link href="/doctors">Doctors</Nav.Link>
                <Nav.Link href="/schedules">Schedules</Nav.Link>
                <Nav.Link href="/my_visits">My Visits</Nav.Link>
              </>
            ) : null}
            <Nav.Link href="/visits">Visits</Nav.Link>

            {group === "User" ? (
              <Nav.Link href="/my_visits">My Visits</Nav.Link>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Container className="d-flex justify-content-end px-5 mx-5">
        <Navbar.Collapse className="justify-content-end">
          {token ? (
            <Navbar.Text>
              <Nav.Link href="/profile">Your Profile</Nav.Link>
            </Navbar.Text>
          ) : (
            <Navbar.Text>
              <a href="/login">Login</a>
            </Navbar.Text>
          )}
        </Navbar.Collapse>{" "}
      </Container>
    </Navbar>
  );
}
