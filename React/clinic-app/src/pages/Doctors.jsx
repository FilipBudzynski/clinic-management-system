import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import { DOCTORS_URL } from "../apiurls";
import DoctorsTable from "../components/DoctorsTable";
import AddDoctorModal from "../components/DoctorAddModal";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const token = sessionStorage.getItem("accessToken");
  const headers = {
    headers: {
      Authorization: token,
    },
  };
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    await api
      .get(DOCTORS_URL, headers)
      .then((response) => {
        setAuthorized(true);
        setDoctors(response.data);
      })
      .catch((error) => {
        toast.error("401 Error Unauthorized access!");
        setAuthorized(false);
        setTimeout(() => {
          navigate("/profile");
        }, 6000);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [refresh]);

  const onApplyChanges = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />

      {authorized ? (
        <>
          <AddDoctorModal
            show={show}
            handleClose={handleClose}
            onApplyChanges={onApplyChanges}
          />
          <div className="container my-4 ">
            <h1>Doctors</h1>
            <DoctorsTable doctors={doctors} onApplyChanges={onApplyChanges} />
            <button
              className="whiteButton"
              variant="primary"
              onClick={handleShow}
            >
              Add Doctor
            </button>
          </div>
        </>
      ) : (
        <ErrorPage />
      )}

      <div className="blueBackground"></div>
    </div>
  );
};
export default Doctors;
