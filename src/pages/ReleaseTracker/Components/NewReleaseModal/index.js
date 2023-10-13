import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./NewReleaseModal.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReleaseThunk, getReleaseThunk } from "../../../../app/features/ReleaseTracker/AsyncThunks";
import { isFulfilled } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const NewReleaseModal = (props) => {
  const [newReleaseFormInput, setNewReleaseFormInput] = useState({
    name: "",
    startDate: "",
    releaseDate: "",
    description: "",
  });

  const getEmptyForm = () => {
    return {
      name: "",
      startDate: "",
      releaseDate: "",
      description: "",
    };
  };

  const newReleaseFormHandler = (evt, field) => {
    setNewReleaseFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
  };

  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.releases);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="new-release-modal-content"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Release
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label className="release-form-field">
              Name <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter release name"
              value={newReleaseFormInput.name}
              onChange={(evt) => newReleaseFormHandler(evt, "name")}
            />
          </Form.Group>

          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label className="release-form-field">
                  Start Date <span>*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter start date"
                  value={newReleaseFormInput.startDate}
                  onChange={(evt) => newReleaseFormHandler(evt, "startDate")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="release-form-field">
                  Release Date <span>*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter release date"
                  value={newReleaseFormInput.releaseDate}
                  onChange={(evt) => newReleaseFormHandler(evt, "releaseDate")}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label className="release-form-field">
              Description <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter release description"
              as={"textarea"}
              rows={5}
              value={newReleaseFormInput.description}
              onChange={(evt) => newReleaseFormHandler(evt, "description")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="new-release-modal-btn__container">
        <Button
          onClick={async () => {
            console.log(newReleaseFormInput);
            const action = await dispatch(
              createReleaseThunk({
                releaseBody: {
                  ...newReleaseFormInput,
                },
              })
            );

            if (isFulfilled(action)) {
              props.onHide();
              setNewReleaseFormInput(getEmptyForm());
              dispatch(getReleaseThunk());
              toast.success("New release Created");
            }
          }}
        >
          {actionStatus.createRelease === "loading" ? "Saving..." : "Save"}
        </Button>
        <Button
          onClick={() => {
            props.onHide();
            setNewReleaseFormInput(getEmptyForm());
          }}
          variant="outline-primary"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
