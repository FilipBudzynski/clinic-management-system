import api from "../api";
import MyNavbar from "../components/navbar";
import ProfileCard from "../components/profileCard";
import UserInfoModal from "../components/userInfoModal";
import { CURRENT_USER } from "../apiurls";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const Profile = () => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState({});

  const [refresh, setRefresh] = useState(false);

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    api
      .get(CURRENT_USER, {
        headers: { Authorization: accessToken },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        window.location.href = "/login";
        console.log(error);
      });
  }, [refresh]);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);
  const onApplyChanges = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <UserInfoModal
        show={show}
        handleClose={handleClose}
        onApplyChanges={onApplyChanges}
        userInfo={userData}
      />

      <MyNavbar />
      <Col className="">
        <ProfileCard userData={userData} />
        <Col lg="6" className="mb-4 mb-lg-0 mx-auto">
          <div className="mt-5 d-flex justify-content-start ">
            <a
              to="/edit-profile"
              className="btn rounded-4 btn-outline-primary me-2 btn-white-bg"
              onClick={handleOpen}
            >
              Edit Profile
            </a>
            <a
              onClick={handleLogout}
              className="btn rounded-4 btn-outline-danger"
            >
              Logout
            </a>
          </div>
        </Col>
      </Col>

      <div className="blueBackground"></div>
    </>
  );
};

export default Profile;
