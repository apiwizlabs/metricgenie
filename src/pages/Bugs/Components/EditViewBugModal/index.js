import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBugThunk,
  getBugsThunk,
} from "../../../../app/features/Bugs/AsyncThunks";
import Style from "./EditViewBug.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import { getLoggedInUser } from "../../../../utils";
import { SprintPlanningAPI } from "../../../../api/apiConfig";
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'
import { DescriptionField } from "../../../../components/DescriptionField";


export const EditViewBugModal = (props) => {
  const { showModal, setShowModal, existingBug } = props;

  const [bugFormInput, setBugFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    owner: getLoggedInUser().name,
    ownerEmail: getLoggedInUser().email,
    reportedBy: "",
    reportedByEmail: "",
    status: "",
    priority: "",
    tags: {}
  });

  const [taggedSprint, setTaggedSprint] = useState(null);
  const [taggedMilestone, setTaggedMilestone] = useState(null);
  const [taggedTask, settaggedtask] = useState(null);
  const [allSprints, setAllSprints] = useState(null);
  const [allMilestones, setAllMilestones] = useState(null);
  const [allTasks, setAllTasks] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [bugFormError, setBugFormError] = useState({
    name: false,
    summary: false,
    description: false,
    owner: false,
    ownerEmail: false,
    reportedBy: false,
    reportedByEmail: false,
    status: false,
    priority: false
  });

  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.bugs);
  const { sprintUsers } = useSelector((state) => state.sprintPlanning);

  const bugTextInputChangeHandler = (evt, field) => {
    setBugFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    if (evt.target.value.length === 0) {
      setBugFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setBugFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    const _bugFormInput = JSON.parse(JSON.stringify(bugFormInput));
    delete _bugFormInput.worklog;
    return Object.keys(_bugFormInput).reduce((acc, curr) => {
      if (bugFormError[curr] !== undefined) {
        return acc || bugFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const updateBugHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const bugBody = { ...bugFormInput };

      const action = await dispatch(
        updateBugThunk({
          bugId: existingBug._id,
          bugBody,
        })
      );

      if (isFulfilled(action)) {
        setShowModal(false);
        dispatch(getBugsThunk());
      }
    }
  };

  useEffect(() => {
    if (existingBug) {
      const {
        name,
        summary,
        description,
        owner,
        ownerEmail,
        reportedBy,
        reportedByEmail,
        status,
        tags,
        priority
      } = existingBug;

      setBugFormInput({
        name,
        summary,
        description,
        owner,
        ownerEmail,
        reportedBy,
        reportedByEmail,
        status,
        tags,
        priority
      });
      setBugFormError({
        name: false,
        summary: false,
        description: false,
        owner: false,
        ownerEmail: false,
        reportedBy: false,
        reportedByEmail: false,
        status: false,
        tags: false,
        priority: false
      });
      setEditMode(false);

      getSPrintData();
    }
  }, [existingBug]);

  const getSPrintData = () => {
    SprintPlanningAPI.GET.getSprintInfo()
      .then((res) => {
        setAllSprints(res.data.data);
      })
      .catch((err) => {
        console.log("Error in fetching sprints");
      });
  };

  const getSprintMilestones = (sprintId) => {
    SprintPlanningAPI.GET.getMilestonesOfSprint({ sprintId })
      .then((res) => {
        setAllMilestones(res.data.data.milestones);
      })
      .catch((err) => {
        console.log("Error getting milestones");
      });
  };

  return (
    <div
      className={`${Style["bug__container"]} ${showModal && Style["show"]}`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["bug-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["bug-modal-title"]}>
          {editMode ? "Update Bug details" : "View Bug details"}
        </h1>
        <div className={Style["editmode-btn__container"]}>
          {editMode ? (
            <button
              className={`${Style["btn"]} ${Style["btn-secondary"]}`}
              onClick={() => {
                setEditMode(false);
              }}
            >
              View
            </button>
          ) : (
            <button
              className={`${Style["btn"]} ${Style["btn-primary"]}`}
              onClick={() => {
                setEditMode(true);
              }}
            >
              Edit
            </button>
          )}
        </div>
        <div className={Style["bug-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter bug Name"
                className={`${Style["modal-input"]} ${
                  bugFormError.name && Style["modal-input-error"]
                }`}
                type="text"
                value={bugFormInput.name}
                disabled
                // onChange={(evt) => bugTextInputChangeHandler(evt, "name")}
              />
            ) : (
              <p className={Style["modal-detail-text"]}>{bugFormInput.name}</p>
            )}
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter bug Summary"
                className={`${Style["modal-input"]} ${
                  bugFormError.summary && Style["modal-input-error"]
                }`}
                type="text"
                value={bugFormInput.summary}
                onChange={(evt) => bugTextInputChangeHandler(evt, "summary")}
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.summary}
              </p>
            )}
          </div>
          <DescriptionField  
          isEditModeProp={true}
          editMode={editMode}
          descriptionInput={bugFormInput.description} 
          descriptionError={bugFormError.description} 
          InputChangeHandler={bugTextInputChangeHandler} />

          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Status {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <select
                name="status"
                id="status"
                className={Style["modal-input"]}
                value={bugFormInput.status}
                onChange={(evt) => {
                  setBugFormInput((prev) => ({
                    ...prev,
                    status: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setBugFormError((prev) => ({
                      ...prev,
                      status: true,
                    }));
                  } else {
                    setBugFormError((prev) => ({
                      ...prev,
                      status: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Status
                </option>
                <option value="ACTIVE">Active</option>
                <option value="BACKLOG">Backlog</option>
                <option value="DEV">Dev</option>
                <option value="QA">QA</option>
                <option value="PROD">Prod</option>
              </select>
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.status}
              </p>
            )}
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Priority {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <select
                name="priority"
                id="priority"
                className={Style["modal-input"]}
                value={bugFormInput.priority}
                onChange={(evt) => {
                  setBugFormInput((prev) => ({
                    ...prev,
                    priority: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setBugFormError((prev) => ({
                      ...prev,
                      priority: true,
                    }));
                  } else {
                    setBugFormError((prev) => ({
                      ...prev,
                      priority: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Priority
                </option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.priority}
              </p>
            )}
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter Owner"
                className={`${Style["modal-input"]} ${
                  bugFormError.owner && Style["modal-input-error"]
                }`}
                type="email"
                value={bugFormInput.owner}
                disabled
              />
            ) : (
              <p className={Style["modal-detail-text"]}>{bugFormInput.owner}</p>
            )}
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner Email {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter Owner Email"
                className={`${Style["modal-input"]} ${
                  bugFormError.ownerEmail && Style["modal-input-error"]
                }`}
                type="email"
                value={bugFormInput.ownerEmail}
                disabled
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.ownerEmail}
              </p>
            )}
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Reporter {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <select
                name="reportedBy"
                id="reportedBy"
                className={Style["modal-input"]}
                value={bugFormInput.reportedBy}
                onChange={(evt) => {
                  setBugFormInput((prev) => ({
                    ...prev,
                    reportedBy: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setBugFormError((prev) => ({
                      ...prev,
                      reportedBy: true,
                    }));
                  } else {
                    setBugFormError((prev) => ({
                      ...prev,
                      reportedBy: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Reporter
                </option>
                {sprintUsers?.map((user) => (
                  <option value={user.name} key={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.reportedBy}
              </p>
            )}
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Reporter Email {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <select
                name="reportedByEmail"
                id="reportedByEmail"
                className={Style["modal-input"]}
                value={bugFormInput.reportedByEmail}
                onChange={(evt) => {
                  setBugFormInput((prev) => ({
                    ...prev,
                    reportedByEmail: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setBugFormError((prev) => ({
                      ...prev,
                      reportedByEmail: true,
                    }));
                  } else {
                    setBugFormError((prev) => ({
                      ...prev,
                      reportedByEmail: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Reporter Email
                </option>
                {sprintUsers?.map((user) => (
                  <option value={user.email} key={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.reportedByEmail}
              </p>
            )}
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>Sprint Name</label>
            {editMode ? (
              <select
                name="sprintName"
                id="sprintName"
                className={Style["modal-input"]}
                value={taggedSprint ? taggedSprint.sprintId : taggedSprint}
                onChange={(evt) => {
                  const sprintId = evt.target.value;
                  const selectedSprint = allSprints.find(
                    (sprint) => sprint._id === sprintId
                  );
                  setTaggedSprint({ ...selectedSprint });
                  getSprintMilestones(sprintId);
                  // now make api call to fetch milestones by sprint Id

                  setBugFormInput((prev) => ({
                    ...prev,
                    tags: {
                      ...prev.tags,
                      sprintId,
                      sprintName: selectedSprint.name,
                    },
                  }));

                  setBugFormError((prev) => ({
                    ...prev,
                    tags: false,
                  }));
                }}
              >
                <option value={""} selected disabled>
                  Select a Sprint
                </option>
                {allSprints?.map((sprint) => (
                  <option value={sprint._id} key={sprint._id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className={Style["modal-detail-text"]}>
                {bugFormInput.tags.sprintName}
              </p>
            )}
          </div>
          {allMilestones && (
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Milestone Name
              </label>
              {editMode ? (
                <select
                  name="milestoneName"
                  id="milestoneName"
                  className={Style["modal-input"]}
                  value={
                    taggedMilestone
                      ? taggedMilestone.milestoneId
                      : taggedMilestone
                  }
                  onChange={(evt) => {
                    const milestoneId = evt.target.value;
                    const selectedMilestone = allMilestones.find(
                      (milestone) => milestone._id === milestoneId
                    );
                    setTaggedMilestone({ ...selectedMilestone });

                    setAllTasks(selectedMilestone.tasks);

                    setBugFormInput((prev) => ({
                      ...prev,
                      tags: {
                        ...prev.tags,
                        milestoneId,
                        milestoneName: selectedMilestone.name,
                      },
                    }));

                    setBugFormError((prev) => ({
                      ...prev,
                      tags: false,
                    }));
                  }}
                >
                  <option value={""} selected disabled>
                    Select a Milestone
                  </option>
                  {allMilestones?.map((milestone) => (
                    <option value={milestone._id} key={milestone._id}>
                      {milestone.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={Style["modal-detail-text"]}>
                  {bugFormInput.tags.milestoneName}
                </p>
              )}
            </div>
          )}

          {allTasks && (
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>Task Name</label>
              {editMode ? (
                <select
                  name="taskName"
                  id="taskName"
                  className={Style["modal-input"]}
                  value={taggedTask ? taggedTask.taskId : taggedTask}
                  onChange={(evt) => {
                    const taskId = evt.target.value;
                    const selectedTask = allTasks.find(
                      (task) => task._id === taskId
                    );
                    settaggedtask({ ...selectedTask });

                    setBugFormInput((prev) => ({
                      ...prev,
                      tags: {
                        ...prev.tags,
                        taskId,
                        taskName: selectedTask.name,
                      },
                    }));

                    setBugFormError((prev) => ({
                      ...prev,
                      tags: false,
                    }));
                  }}
                >
                  <option value={""} selected disabled>
                    Select a Task
                  </option>
                  {allTasks?.map((task) => (
                    <option value={task._id} key={task._id}>
                      {task.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={Style["modal-detail-text"]}>
                  {bugFormInput.tags.taskName}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={Style["bug-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          {editMode && (
            <button
              className={`${Style["btn"]} ${Style["btn-primary"]}`}
              disabled={validateForm()}
              onClick={updateBugHandler}
            >
              {actionStatus.updatebug === "loading" ? "Updating..." : "Update"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
