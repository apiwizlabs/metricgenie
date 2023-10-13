import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  getSprintInfoThunk,
  moveMilestoneAcrossSprints,
  getSprintByIdThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { isFulfilled } from "@reduxjs/toolkit";
import { Loader } from "../../../../components/Loader";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify"

export const ExportMilestoneForm = ({
    handleClose,
    milestoneToExport,
    show
}) => {

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sprintData, actionStatus, currentSprintData } = useSelector(
    (state) => state.sprintPlanning
  );

  const [selectedSprint, setSelectedSprint] = useState(null);

  useEffect(() => {
    dispatch(getSprintInfoThunk());
  }, []);

  useEffect(() => {
    if (actionStatus.getSprintInfo === "fulfilled") {
      setSelectedSprint(sprintData[0]._id);
    }
  }, [sprintData]);

  const handleSprintChange = (e) => {
    setSelectedSprint(e.target.value);
  };

  const handleMoveMilestone = async () => {
    // current sprintid, selected sprint id and milestone id

    const action = await dispatch(moveMilestoneAcrossSprints({
        sprintId: searchParams.get("sprintId"),
        milestoneId: milestoneToExport,
        selectedSprintId: selectedSprint
    }))

    if(isFulfilled(action)){
        // get current sprint data
        handleClose()
        dispatch(getSprintByIdThunk({ sprintId: currentSprintData._id }));
        toast.success("Milestone Successfully exported")
    }else{
        toast.error("Milestone already exists in this sprint")
    }
    
  }

  return (
    <div className="export-task-modal-wrapper">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="d-flex justify-content-between">
          <Modal.Title>Move Milestone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {actionStatus.getSprintInfo === "loading" && <Loader />}
            {actionStatus.getSprintInfo === "fulfilled" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Choose Sprint </Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      setSelectedSprint(e.target.value);
                      handleSprintChange(e);
                    }}
                  >
                    {sprintData.map((sprint) => (
                      <option value={sprint._id}>{sprint.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {
            actionStatus.getSprintInfo === "fulfilled" && (
              <Button variant="primary" onClick={handleMoveMilestone}>
                { actionStatus.moveMilestoneAcrossSprints === "loading" ? "Exporting..." : "Export To Sprint"}
              </Button>
            )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
