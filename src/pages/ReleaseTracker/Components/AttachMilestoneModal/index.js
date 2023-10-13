import { isFulfilled } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./AttachMilestoneModal.css"
import {
  createReleaseThunk,
  addTasksToReleaseThunk,
  getReleaseByIdThunk,
} from "../../../../app/features/ReleaseTracker/AsyncThunks";

export const AttachMilestonesModal = (props) => {
  const { allMilestones, actionStatus, currentReleaseId } = useSelector(
    (state) => state.releases
  );

  const dispatch = useDispatch();

  const [milestonesList, setMilestonesList] = useState(null);

  // data structure of state
  // const milestonesList = {
  //   [milestontId]: {
  //     name: "miestone name",
  //     selected: false,
  //     tasks: {
  //       [taskId]: {
  //         name: "task_name",
  //         selected: false,
  //       },
  //     },
  //   },
  // };

  const milestoneSelectHandler = ({ milestoneId }) => {
    const temp = JSON.parse(JSON.stringify(milestonesList));
    temp[milestoneId].selected = !temp[milestoneId].selected;

    // now if milestone is selected, then if milestone has task, all child task will also be selected
    if (temp[milestoneId].tasks) {
      Object.keys(temp[milestoneId].tasks).forEach((taskId) => {
        temp[milestoneId].tasks[taskId].selected = temp[milestoneId].selected;
      });
    }

    setMilestonesList(temp);
  };

  const taskSelectHandler = ({ milestoneId, taskId }) => {
    const temp = JSON.parse(JSON.stringify(milestonesList));

    temp[milestoneId].tasks[taskId].selected =
      !temp[milestoneId].tasks[taskId].selected;

    const atleastOneTaskSelected = Object.entries(
      temp[milestoneId].tasks
    ).reduce((acc, [key, value]) => acc || value.selected, false);

    temp[milestoneId].selected = atleastOneTaskSelected;

    setMilestonesList(temp);
  };

  const getModifiedMilestonesList = (allMilestones) => {
    const res = {};
    allMilestones.map((milestone) => {
      if (milestone.tasks.length === 0) {
        res[milestone._id] = {
          name: milestone.name,
          selected: false,
        };
      } else {
        res[milestone._id] = {
          name: milestone.name,
          selected: false,
        };

        res[milestone._id].tasks = milestone.tasks.reduce(
          (acc, curr) => ({
            ...acc,
            [curr._id]: {
              name: curr.name,
              selected: false,
            },
          }),
          {}
        );
      }
    });

    return res;
  };

  const getCreateReleasePayload = (milestonesList) => {
    // send only the milestones which are selected for release
    return Object.entries(milestonesList).reduce(
      (acc, [milestoneId, milestoneValue]) =>
        milestoneValue.selected
          ? { ...acc, [milestoneId]: milestoneValue }
          : acc,
      {}
    );
  };
  useEffect(() => {
    if (allMilestones && allMilestones.length > 0) {
      setMilestonesList(getModifiedMilestonesList(allMilestones));
    }
  }, [allMilestones]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="add-tasks-modal-content"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Add Tasks</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {milestonesList &&
          Object.entries(milestonesList).map(([key, value]) => {
            if (value.tasks) {
              return (
                <React.Fragment key={key}>
                  <Form.Check
                    id={`milestone__${key}`}
                    label={value.name}
                    type="checkbox"
                    checked={value.selected}
                    onChange={() =>
                      milestoneSelectHandler({ milestoneId: key })
                    }
                  />
                  <div className="ms-4">
                    {Object.entries(value.tasks).map(([taskKey, taskValue]) => (
                      <Form.Check
                        type="checkbox"
                        id={`task__${taskKey}`}
                        label={taskValue.name}
                        checked={taskValue.selected}
                        onChange={() =>
                          taskSelectHandler({
                            milestoneId: key,
                            taskId: taskKey,
                          })
                        }
                      />
                    ))}
                  </div>
                </React.Fragment>
              );
            } else {
              return (
                <Form.Check
                  id={`milestone__${key}`}
                  label={value.name}
                  type="checkbox"
                  checked={value.selected}
                  onChange={() => milestoneSelectHandler({ milestoneId: key })}
                />
              );
            }
          })}
      </Modal.Body>
      <Modal.Footer className="new-release-modal-btn__container">
        <Button
          onClick={async () => {
            const res = getCreateReleasePayload(milestonesList);
            const action = await dispatch(
              addTasksToReleaseThunk({
                releaseId: currentReleaseId,
                releaseBody: getCreateReleasePayload(milestonesList),
              })
            );
            if (isFulfilled(action)) {
              // get release by id
              dispatch(getReleaseByIdThunk({ releaseId: currentReleaseId }));
              props.onHide();
              setMilestonesList(getModifiedMilestonesList(allMilestones));
              toast.success("Tasks attached to release");
            } else {
              toast.error("Cannot attach Task to release");
            }
          }}
        >
          {actionStatus.addTasksToRelease === "loading" ? "Saving..." : "Save"}
        </Button>
        <Button
          onClick={() => {
            props.onHide();
            setMilestonesList(getModifiedMilestonesList(allMilestones));
          }}
          variant="outline-primary"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
