import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../NewReleaseModal/NewReleaseModal.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateReleaseThunk, getReleaseThunk } from "../../../../app/features/ReleaseTracker/AsyncThunks";
import { isFulfilled } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const EditReleaseModal = (props) => {
  const {currentInfo} = props;
  const {name, description, startDate, releaseDate} = currentInfo;
  const [editReleaseFormInput, setEditReleaseFormInput] = useState({name, description, startDate, releaseDate});

  const editReleaseFormHandler = (evt, field) => {
    setEditReleaseFormInput((prev) => ({
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
          Edit Release
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
              value={editReleaseFormInput.name}
              onChange={(evt) => editReleaseFormHandler(evt, "name")}
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
                  value={editReleaseFormInput.startDate}
                  onChange={(evt) => editReleaseFormHandler(evt, "startDate")}
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
                  value={editReleaseFormInput.releaseDate}
                  onChange={(evt) => editReleaseFormHandler(evt, "releaseDate")}
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
              as={"textarea"}
              rows={5}
              placeholder="Enter release description"
              value={editReleaseFormInput.description}
              onChange={(evt) => editReleaseFormHandler(evt, "description")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="new-release-modal-btn__container">
        <Button
          onClick={async () => {
            console.log(editReleaseFormInput);
            let updatedContent = { ...currentInfo, ...editReleaseFormInput}
            delete updatedContent.cts;
            delete updatedContent.mts;
            delete updatedContent.__v;
            delete updatedContent._id;

            const action = await dispatch(
              updateReleaseThunk({
                releaseId: currentInfo._id,
                releaseBody: {
                  ...updatedContent,
                },
              })
            );

            if (isFulfilled(action)) {
              props.onHide();
              dispatch(getReleaseThunk());
              toast.success("Release Updated");
            }
          }}
        >
          
          {actionStatus.updateRelease === "loading" ? "Saving..." : "Save"}

        </Button>
        <Button
          onClick={() => {
            props.onHide();
          }}
          variant="outline-primary"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
