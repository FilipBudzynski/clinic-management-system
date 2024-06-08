import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/navbar";
import AddUserModal from "../components/userFormModal";
import { VISITS } from "../apiurls";
import { toast, ToastContainer } from "react-toastify";
import CurrentUserVisitsTable from "../components/CurrentUserVisitsTable";

const UserVisits = () => {
  const [visits, setVisits] = useState([]);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toastError = (text) => toast.error(text);

  const onApply = () => {
    setRefresh((prev) => !prev);
  };

  const fetchVisits = async () => {
    try {
      const response = await api.get(VISITS);
      setVisits(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toastError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [refresh]);

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="container my-4">
        <h1>My Visits</h1>
        <CurrentUserVisitsTable visits={visits} onApply={onApply} />
      </div>
      <div className="blueBackground"></div>
    </div>
  );
};
export default UserVisits;
