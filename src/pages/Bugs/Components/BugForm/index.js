import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBugThunk,
  getBugsThunk,
} from "../../../../app/features/Bugs/AsyncThunks";
import Style from "./bugForm.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import { getLoggedInUser } from "../../../../utils";
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'
import { DescriptionField } from "../../../../components/DescriptionField";

export const BugForm = (props) => {
  const { showModal, setShowModal } = props;
  const [bugsFormInput, setBugsFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    owner: getLoggedInUser().name,
    ownerEmail: getLoggedInUser().email,
    reportedBy: "",
    reportedByEmail: "",
    status: "",
    priority: "",
  });

  const [bugsFormError, setBugsFormError] = useState({
    owner: false,
    ownerEmail: false,
  });

  const dispatch = useDispatch();
  const { actionStatus, bugsData } = useSelector((state) => state.bugs);
  const { sprintUsers } = useSelector((state) => state.sprintPlanning);

  const getInitialState = () => {
    return {
      name: "",
      summary: "",
      description: "",
      owner: getLoggedInUser().name,
      ownerEmail: getLoggedInUser().email,
      reportedBy: "",
      reportedByEmail: "",
      status: "",
      priority: "",
    };
  };

  useEffect(() => {
    setBugsFormInput(getInitialState());
  }, [showModal]);

  const bugsTextInputChangeHandler = (evt, field) => {
    setBugsFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    if (evt.target.value.length === 0) {
      setBugsFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setBugsFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    const _bugsFormInput = JSON.parse(JSON.stringify(bugsFormInput));
    delete _bugsFormInput.worklog;
    return Object.keys(_bugsFormInput).reduce((acc, curr) => {
      if (bugsFormError[curr] !== undefined) {
        return acc || bugsFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const createBugHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const bugBody = { ...bugsFormInput };
      const action = await dispatch(
        createBugThunk({
          bugBody,
        })
      );
      if (isFulfilled(action)) {
        setBugsFormInput(getInitialState());

        setBugsFormError({});
        setShowModal(false);
        dispatch(getBugsThunk());
      }
    }
  };

  return (
    <div
      className={`${Style["bugs__container"]} ${showModal && Style["show"]}`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["bugs-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["bugs-modal-title"]}>Enter Bugs details</h1>
        <div className={Style["bugs-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name <span>*</span>
            </label>
            <input
              placeholder="Enter bugs Name"
              className={`${Style["modal-input"]} ${
                bugsFormError.name && Style["modal-input-error"]
              }`}
              type="text"
              value={bugsFormInput.name}
              onChange={(evt) => bugsTextInputChangeHandler(evt, "name")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary <span>*</span>
            </label>
            <input
              placeholder="Enter bugs Summary"
              className={`${Style["modal-input"]} ${
                bugsFormError.summary && Style["modal-input-error"]
              }`}
              type="text"
              value={bugsFormInput.summary}
              onChange={(evt) => bugsTextInputChangeHandler(evt, "summary")}
            />
          </div>
          <DescriptionField  
          descriptionInput={bugsFormInput.description} 
          descriptionError={bugsFormError.description} 
          InputChangeHandler={bugsTextInputChangeHandler} />
         
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner <span>*</span>
            </label>
            <input
              placeholder="Enter Owner Name"
              className={`${Style["modal-input"]} ${
                bugsFormError.owner && Style["modal-input-error"]
              }`}
              type="text"
              value={bugsFormInput.owner}
              disabled
              // onChange={(evt) => bugsTextInputChangeHandler(evt, "owner")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner Email <span>*</span>
            </label>
            <input
              placeholder="Enter Owner Email"
              className={`${Style["modal-input"]} ${
                bugsFormError.ownerEmail && Style["modal-input-error"]
              }`}
              type="email"
              value={bugsFormInput.ownerEmail}
              disabled
              // onChange={(evt) => bugsEmailInputChangeHandler(evt, "ownerEmail")}
            />
          </div>

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]} for="assignee">
              Reported By <span>*</span>
            </label>
            <select
              name="reportedBy"
              id="reportedBy"
              className={Style["modal-input"]}
              value={bugsFormInput.reportedBy}
              onChange={(evt) => {
                const reportedBy = evt.target.value;
                const reportedByEmail = sprintUsers.find(
                  (user) => user.name === reportedBy
                )?.email;

                setBugsFormInput((prev) => ({
                  ...prev,
                  reportedBy: evt.target.value,
                  reportedByEmail,
                }));

                if (evt.target.value.length === 0) {
                  setBugsFormError((prev) => ({
                    ...prev,
                    reportedBy: true,
                  }));
                } else {
                  setBugsFormError((prev) => ({
                    ...prev,
                    reportedBy: false,
                    reportedByEmail: false,
                  }));
                }
              }}
            >
              <option value={""} selected disabled>
                Select Bug Reporter
              </option>
              {sprintUsers?.map((user) => (
                <option value={user.name} key={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              ReportedBy Email <span>*</span>
            </label>
            <select
              name="reportedByEmail"
              id="reportedByEmail"
              className={Style["modal-input"]}
              value={bugsFormInput.reportedByEmail}
              onChange={(evt) => {
                setBugsFormInput((prev) => ({
                  ...prev,
                  reportedByEmail: evt.target.value,
                }));

                if (evt.target.value.length === 0) {
                  setBugsFormError((prev) => ({
                    ...prev,
                    reportedByEmail: true,
                  }));
                } else {
                  setBugsFormError((prev) => ({
                    ...prev,
                    reportedByEmail: false,
                  }));
                }
              }}
            >
              <option value={""} selected disabled>
                Select Bug Reporter Email
              </option>
              {sprintUsers?.map((user) => (
                <option value={user.email} key={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Status <span>*</span>
            </label>
            <select
              name="status"
              id="status"
              className={Style["modal-input"]}
              value={bugsFormInput.status}
              onChange={(evt) => {
                setBugsFormInput((prev) => ({
                  ...prev,
                  status: evt.target.value,
                }));

                if (evt.target.value.length === 0) {
                  setBugsFormError((prev) => ({
                    ...prev,
                    status: true,
                  }));
                } else {
                  setBugsFormError((prev) => ({
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
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Priority <span>*</span>
            </label>
            <select
              name="priority"
              id="priority"
              className={Style["modal-input"]}
              value={bugsFormInput.priority}
              onChange={(evt) => {
                setBugsFormInput((prev) => ({
                  ...prev,
                  priority: evt.target.value,
                }));

                if (evt.target.value.length === 0) {
                  setBugsFormError((prev) => ({
                    ...prev,
                    priority: true,
                  }));
                } else {
                  setBugsFormError((prev) => ({
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
          </div>
        </div>

        {/* Start of action buttons  */}
        <div className={Style["bugs-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            disabled={validateForm()}
            onClick={createBugHandler}
          >
            {actionStatus.createBug === "loading" ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
