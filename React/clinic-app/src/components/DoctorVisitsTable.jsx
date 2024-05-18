import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { Button } from "react-bootstrap";
import api from "../api";
import { CURRENT_USER, SPECIALITIES_URL, VISITS } from "../apiurls";
import { Form } from "react-bootstrap";
import DescriptionModal from "./DescriptionModal";

export default function DoctorVisitsTable({ visits, onApply }) {
  const [show, setShow] = useState(false);
  const [chosenVisit, setChosenVisit] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const accessToken = sessionStorage.getItem("accessToken");

  const hideModal = () => {
    setShow(false);
  };
  const showModal = () => setShow(true);

  const handleAddDescriptionButton = (visit) => {
    showModal();
    setChosenVisit(visit);
    console.log(visit);
  };

  const getCurrentUser = async () => {
    const response = await api.get(CURRENT_USER, {
      headers: { Authorization: accessToken },
    });
    setCurrentUser(response.data);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  console.log(searchDate);
  return (
    <>
      <DescriptionModal
        visit={chosenVisit}
        show={show}
        handleClose={hideModal}
        onApply={onApply}
      />
      <div
        className="px-3 py-3 shadow rounded-3 mb-5"
        style={{ minHeight: "60vh", backgroundColor: "white" }}
      >
        <div className="d-flex mb-3 justify-content-between">
          <SearchBar
            haveSearch={false}
            haveDate={true}
            setDateSearch={(e) => setSearchDate(e.nativeEvent.target.value)}
          />
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Patient</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Description</th>
              <th className="d-flex justify-content-center" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visits
              .filter(
                (item) =>
                  item.is_reserved &&
                  item.doctor.username == currentUser.username &&
                  (searchDate === "" ||
                    new Date(item.visit_date).toLocaleDateString() ===
                      new Date(searchDate).toLocaleDateString()),
              )
              .map((visit, index) => (
                <tr key={visit.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{visit.user.username}</td>
                  <td>{new Date(visit.visit_date).toLocaleDateString()}</td>
                  <td>{new Date(visit.visit_date).toLocaleTimeString()}</td>
                  <td>{visit.description}</td>
                  <td className="d-flex justify-content-center">
                    <Button
                      className="primary"
                      onClick={() => handleAddDescriptionButton(visit)}
                    >
                      ADD DESCRIPTION
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
