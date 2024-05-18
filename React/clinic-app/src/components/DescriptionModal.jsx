import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { VISITS } from "../apiurls";
import { useState } from "react";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";

export default function DescriptionModal({
  visit,
  show,
  handleClose,
  onApply,
}) {
  const [formData, setFormData] = useState({
    description: "",
    row_version: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddDescription = async (event) => {
    event.preventDefault();
    try {
      formData.row_version = visit.row_version;
      const response = await api.patch(`${VISITS}/${visit.id}`, formData);
      if (response.status === 200) {
        onApply();
      }
    } catch (error) {
      console.error(error);
      toast.error("Data was already changed before :(");
      onApply();
    }
    handleClose();
    console.log(formData);
  };

  return (
    <>
      <ToastContainer />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Control
                as="textarea"
                type="text"
                placeholder={visit.description}
                name="description"
                onChange={handleInputChange}
                value={formData.description}
                rows={7}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddDescription}>
            Zapisz
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
