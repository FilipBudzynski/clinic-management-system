import DoctorInfoModal from "./DoctorInfoModal";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import api from "../api";
import { SPECIALITIES_URL } from "../apiurls";

export default function SearchBar({
  haveSearch = true,
  setSearch = () => {},
  haveSelect = false,
  selectValues = [],
  setSelectSearch = () => {},
  haveDate = false,
  setDateSearch = () => {},
}) {
  const preventSubmiting = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {haveSelect ? (
        <Form className="w-50 pe-5" onSubmit={preventSubmiting}>
          <Form.Select className="underline-search" onChange={setSelectSearch}>
            <option value="">All</option>
            {selectValues.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Form>
      ) : null}

      {haveSearch ? (
        <Form className="w-100 ps-5" onSubmit={preventSubmiting}>
          <Form.Control
            className="underline-search"
            placeholder="Search term"
            onChange={setSearch}
          />
        </Form>
      ) : null}

      {haveDate ? (
        <Form
          className="w-50 pe-5 ps-5 row justify-content-center"
          onSubmit={preventSubmiting}
        >
          <input
            className="ms-auto"
            type="date"
            name="day"
            // selected={}
            onChange={setDateSearch}
          />
        </Form>
      ) : null}
    </>
  );
}
