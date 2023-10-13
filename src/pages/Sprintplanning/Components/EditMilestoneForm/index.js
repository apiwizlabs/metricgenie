import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSprintByIdThunk,
  updateMilestoneThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import Style from "./EditMilestoneForm.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import { DescriptionField } from "../../../../components/DescriptionField";
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'

export const EditMilestoneForm = (props) => {
  const { showModal, setShowModal, existingMilestoneDetails } = props;
  const [mileStoneFormInput, setMileStoneFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    owner: "",
    ownerEmail: "",
    status: "",
  });

  const [milestoneFormError, setMilestoneFormError] = useState({
    name: false,
    summary: false,
    description: false,
    owner: false,
    ownerEmail: false,
    status: false,
  });

  useEffect(() => {
    if (existingMilestoneDetails) {
      const { name, summary, description, owner, ownerEmail, status } =
        existingMilestoneDetails;
      setMileStoneFormInput({
        name,
        summary,
        description,
        owner,
        ownerEmail,
        status,
      });
    }
  }, [existingMilestoneDetails]);

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

  const editMilestoneHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const action = await dispatch(
        updateMilestoneThunk({
          milestoneBody: {
            ...mileStoneFormInput,
          },
          milestoneId: existingMilestoneDetails._id,
          sprintId: currentSprintData._id,
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
          Update Milestone details
        </h1>
        {existingMilestoneDetails?.releaseInfo &&
          existingMilestoneDetails?.releaseInfo.length > 0 && (
            <div className={Style["milestone-release-info"]}>
              <p>This milestone was part of a recent release</p>
              <p>
                Release name:{" "}
                {existingMilestoneDetails.releaseInfo[0].releaseName}
              </p>
              <p>
                Release Date:{" "}
                {existingMilestoneDetails.releaseInfo[0].releaseDate}
              </p>
            </div>
          )}
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
              disabled
              // onChange={(evt) => milestoneTextInputChangeHandler(evt, "name")}
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
            onClick={editMilestoneHandler}
          >
            {actionStatus.updateMilestone === "loading"
              ? "Updating..."
              : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};
