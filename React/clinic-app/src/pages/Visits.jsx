import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import AddUserModal from "../components/userFormModal";
import ErrorPage from "./ErrorPage";
import { VISITS } from "../apiurls";
import { toast, ToastContainer } from "react-toastify";
import VisitsTable from "../components/VisitsTable";
import DoctorVisitsTable from "../components/DoctorVisitsTable";
import fetchUserData from "../functions/apiFunctions";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [authorized, setAuthorized] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toastError = (text) => toast.error(text);
  const group = sessionStorage.getItem("userGroup");
  const isActive = sessionStorage.getItem("isActive");
  const accessToken = sessionStorage.getItem("accessToken");
  const onApply = () => {
    setRefresh((prev) => !prev);
  };

  const fetchVisits = async () => {
    try {
      if (isActive === "false") {
        setAuthorized(false);
        toast.error("You must be activated by the admin.");
        return;
      }
      const response = await api.get(VISITS);
      setVisits(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("401 Error Unauthorized access! 😭 Redirecting...");
      setAuthorized(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData(accessToken);
    fetchVisits();
  }, [refresh]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      {isActive === "false" && !authorized ? (
        <ErrorPage />
      ) : (
        <div className="container my-4">
          <h1>Visits</h1>
          {group === "Doctor" ? (
            <DoctorVisitsTable visits={visits} onApply={onApply} />
          ) : (
            <VisitsTable visits={visits} onApply={onApply} />
          )}
          <AddUserModal show={show} handleClose={handleClose} />
        </div>
      )}
      <div className="blueBackground"></div>
    </>
  );
};
export default Visits;
