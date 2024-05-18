import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { Button } from "react-bootstrap";
import api from "../api";
import { CURRENT_USER, SPECIALITIES_URL, VISITS } from "../apiurls";
import { Form } from "react-bootstrap";

export default function VisitsTable({ visits, onApply }) {
  const [show, setShow] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [specialitySearch, setSpecialitySearch] = useState("");
  const accessToken = sessionStorage.getItem("accessToken");
  const [requestData, setRequestData] = useState({
    visit_id: null,
    user_id: null,
  });

  const handleApplyToVisit = async () => {
    try {
      const response = await api.put(
        VISITS + "/" + requestData.visit_id,
        requestData,
        { params: { user_id: requestData.user_id } },
      );
      console.log(response);
      onApply();
    } catch (error) {
      console.error("Error updating visit:", error);
    }
  };

  const handleButtonClicked = async (visit_id) => {
    const response = await api.get(CURRENT_USER, {
      headers: { Authorization: accessToken },
    });
    setRequestData((prevData) => ({
      visit_id: visit_id,
      user_id: response.data.id,
    }));
  };
  useEffect(() => {
    handleApplyToVisit();
  }, [requestData]);

  const fetchSpecialities = async () => {
    try {
      const response = await api.get(SPECIALITIES_URL);
      setSpecialities(response.data);
      console.log(specialities);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  return (
    <>
      <div
        className="px-3 py-3 shadow rounded-3 mb-5"
        style={{ minHeight: "60vh", backgroundColor: "white" }}
      >
        <div className="d-flex mb-3 justify-content-between">
          <SearchBar
            haveSearch={false}
            haveSelect={true}
            selectValues={specialities}
            setSelectSearch={(e) => setSpecialitySearch(e.target.value)}
          />
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Doctor</th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits
              .filter(
                (item) =>
                  (specialitySearch === ""
                    ? item
                    : item.doctor.speciality.includes(specialitySearch)) &&
                  !item.is_reserved,
              )
              .map((visit, index) => (
                <tr key={visit.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{visit.doctor.username}</td>
                  <td>{visit.visit_date}</td>
                  <td>{visit.description}</td>
                  <td>
                    <Button
                      className="primary"
                      onClick={() => handleButtonClicked(visit.id)}
                    >
                      APPLY
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
