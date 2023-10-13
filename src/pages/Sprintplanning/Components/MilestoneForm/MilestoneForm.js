import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewMilestoneThunk,
  getSprintByIdThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import Style from "./MilestoneForm.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import { getLoggedInUser } from "../../../../utils"
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'
import { DescriptionField } from "../../../../components/DescriptionField";

export const MilestoneForm = (props) => {
  const { showModal, setShowModal } = props;
  const [mileStoneFormInput, setMileStoneFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    owner: getLoggedInUser().name,
    ownerEmail: getLoggedInUser().email,
    status: "",
  });

  const [milestoneFormError, setMilestoneFormError] = useState({
    owner: false,
    ownerEmail: false
  });

  const milestoneTextInputChangeHandler = (evt, field) => {
    setMileStoneFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    if (evt.target.value.length === 0) {
      setMilestoneFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setMilestoneFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const milestoneEmailInputChangeHandler = (evt, field) => {
    setMileStoneFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (evt.target.value.length === 0 || !emailRegex.test(evt.target.value)) {
      setMilestoneFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setMilestoneFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    return Object.keys(mileStoneFormInput).reduce((acc, curr) => {
      if (milestoneFormError[curr] !== undefined) {
        return acc || milestoneFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const dispatch = useDispatch();
  const { currentSprintData, actionStatus } = useSelector(
    (state) => state.sprintPlanning
  );

  const createMilestoneHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const action = await dispatch(
        createNewMilestoneThunk({
          sprintId: currentSprintData._id,
          milestoneBody: {
            ...mileStoneFormInput,
          },
        })
      );
      if (isFulfilled(action)) {
        setMileStoneFormInput({
          name: "",
          summary: "",
          description: "",
          owner: "",
          ownerEmail: "",
          status: "",
        });

        setMilestoneFormError({});
        setShowModal(false);
        dispatch(getSprintByIdThunk({ sprintId: currentSprintData._id }));
      }
    }
  };

  return (
    <div
      className={`${Style["milestone__container"]} ${
        showModal && Style["show"]
      }`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["milestone-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["milestone-modal-title"]}>
          Enter Milestone details
        </h1>
        <div className={Style["milestone-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name <span>*</span>
            </label>
            <input
              placeholder="Enter Milestone Name"
              className={`${Style["modal-input"]} ${
                milestoneFormError.name && Style["modal-input-error"]
              }`}
              type="text"
              value={mileStoneFormInput.name}
              onChange={(evt) => milestoneTextInputChangeHandler(evt, "name")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary <span>*</span>
            </label>
            <input
              placeholder="Enter Milestone Summary"
              className={`${Style["modal-input"]} ${
                milestoneFormError.summary && Style["modal-input-error"]
              }`}
              type="text"
              value={mileStoneFormInput.summary}
              onChange={(evt) =>
                milestoneTextInputChangeHandler(evt, "summary")
              }
            />
          </div>
          <DescriptionField  
          descriptionInput={mileStoneFormInput.description} 
          descriptionError={milestoneFormError.description} 
          InputChangeHandler={milestoneTextInputChangeHandler} />

          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner <span>*</span>
            </label>
            <input
              placeholder="Enter Owner Name"
              className={`${Style["modal-input"]} ${
                milestoneFormError.owner && Style["modal-input-error"]
              }`}
              type="text"
              value={mileStoneFormInput.owner}
              disabled
              // onChange={(evt) => milestoneTextInputChangeHandler(evt, "owner")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Owner Email <span>*</span>
            </label>
            <input
              placeholder="Enter Owner Email"
              className={`${Style["modal-input"]} ${
                milestoneFormError.ownerEmail && Style["modal-input-error"]
              }`}
              type="email"
              value={mileStoneFormInput.ownerEmail}
              disabled
              // onChange={(evt) =>
              //   milestoneEmailInputChangeHandler(evt, "ownerEmail")
              // }
            />
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} htmlFor="status">
              Status <span>*</span>
            </label>
            <select
              name="status"
              id="status"
              className={Style["modal-input"]}
              value={mileStoneFormInput.status}
              onChange={(evt) => {
                setMileStoneFormInput((prev) => ({
                  ...prev,
                  status: evt.target.value,
                }));

                if (evt.target.value.length === 0) {
                  setMilestoneFormError((prev) => ({
                    ...prev,
                    status: true,
                  }));
                } else {
                  setMilestoneFormError((prev) => ({
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
        </div>

        <div className={Style["milestone-modal-action-btn__container"]}>
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
            onClick={createMilestoneHandler}
          >
            {actionStatus.createNewMilestone === "loading"
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
