import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/navbar";
import UsersTable from "../components/usersTable";
import AddUserModal from "../components/userFormModal";
import { ToastContainer, toast } from "react-toastify";
import { USERS_URL } from "../apiurls";
import ErrorPage from "./ErrorPage";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const token = sessionStorage.getItem("accessToken");
  const headers = {
    headers: {
      Authorization: token,
    },
  };
  const fetchUsers = () => {
    api
      .get(USERS_URL, headers)
      .then((response) => {
        setAuthorized(true);
        setUsers(response.data);
      })
      .catch((error) => {
        toast.error("401 Error Unauthorized access! 😭 Redirecting...");
        setAuthorized(false);
        setTimeout(() => {
          navigate("/profile");
        }, 6000);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const onApplyChanges = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div>
      <ToastContainer />
      <MyNavbar />

      {authorized ? (
        <div className="container my-4">
          <h1>Patients</h1>
          <UsersTable users={users} onApplyChanges={onApplyChanges} />
          <button
            className="whiteButton"
            variant="primary"
            onClick={handleShow}
          >
            Add New Patient
          </button>
          <AddUserModal
            show={show}
            handleClose={handleClose}
            onAddUser={onApplyChanges}
          />
        </div>
      ) : (
        <ErrorPage />
      )}
      <div className="blueBackground"></div>
    </div>
  );
};
export default Users;
