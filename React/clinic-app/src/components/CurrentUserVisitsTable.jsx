import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { Button } from "react-bootstrap";
import api from "../api";
import { CANCEL_VISITS, CURRENT_USER } from "../apiurls";
import DescriptionModal from "./DescriptionModal";

export default function CurrentUserVisitsTable({ visits, onApply }) {
  const [show, setShow] = useState(false);
  const [chosenVisit, setChosenVisit] = useState({});
  const [visitToCancel, setVisitToCancel] = useState({});
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
  };

  const handleCancelButton = (visit) => {
    setVisitToCancel(visit);
  };

  const handleCancelVisit = async (visit_id, visit_row_version) => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel the visit?",
    );
    try {
      const response = await api.put(
        CANCEL_VISITS + visit_id + "/" + visit_row_version,
      );
      onApply();
    } catch (error) {
      console.error("Error cancelling visit:", error);
    }
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

  useEffect(() => {}, [visitToCancel]);

  console.log(visitToCancel);
  const group = sessionStorage.getItem("userGroup");
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
              <th scope="col">Doctor</th>
              <th scope="col">Speciality</th>
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
              .filter((item) => {
                if (group === "Doctor") {
                  return (
                    item.doctor.username === currentUser.username &&
                    item.is_reserved &&
                    (searchDate === "" ||
                      new Date(item.visit_date).toLocaleDateString() ===
                        new Date(searchDate).toLocaleDateString())
                  );
                } else if (group === "User") {
                  return (
                    item.user?.username === currentUser.username &&
                    item.is_reserved &&
                    (searchDate === "" ||
                      new Date(item.visit_date).toLocaleDateString() ===
                        new Date(searchDate).toLocaleDateString())
                  );
                }
              })
              .map((visit, index) => (
                <tr key={visit.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{visit.doctor.username}</td>
                  <td>{visit.doctor.speciality}</td>
                  <td>{new Date(visit.visit_date).toLocaleDateString()}</td>
                  <td>{new Date(visit.visit_date).toLocaleTimeString()}</td>
                  <td>{visit.description}</td>
                  <td className="d-flex justify-content-center">
                    {group === "Doctor" ? (
                      <Button
                        className="primary"
                        onClick={() => handleAddDescriptionButton(visit)}
                      >
                        ADD DESCRIPTION
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="primary"
                          onClick={() => handleAddDescriptionButton(visit)}
                        >
                          EDIT DESCRIPTION
                        </Button>

                        <Button
                          onClick={() =>
                            handleCancelVisit(visit.id, visit.row_version)
                          }
                        >
                          CANCEL
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
