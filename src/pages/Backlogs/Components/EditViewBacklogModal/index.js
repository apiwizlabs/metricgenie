import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBacklogThunk,
  getAllBacklogThunk,
} from "../../../../app/features/Backlogs/AsyncThunks";
import Style from "./EditViewBacklog.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'
import { DescriptionField } from "../../../../components/DescriptionField";

export const EditViewBacklogModal = (props) => {
  const { showModal, setShowModal, existingBacklog } = props;
  const [backlogFormInput, setBacklogFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    type: "BACKLOG",
    status: "BACKLOG",
  });

  const [editMode, setEditMode] = useState(false);

  const [backlogFormError, setBacklogFormError] = useState({
    name: false,
    summary: false,
    description: false,
    type: false,
    status: false,
  });

  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.backlogs);

  const backlogTextInputChangeHandler = (evt, field) => {
    setBacklogFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    if (evt.target.value.length === 0) {
      setBacklogFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setBacklogFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const validateForm = () => {
    const _backlogFormInput = JSON.parse(JSON.stringify(backlogFormInput));
    delete _backlogFormInput.worklog;
    return Object.keys(_backlogFormInput).reduce((acc, curr) => {
      if (backlogFormError[curr] !== undefined) {
        return acc || backlogFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const updateBacklogHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const backlogBody = { ...backlogFormInput };

      const action = await dispatch(
        updateBacklogThunk({
          backlogId: existingBacklog._id,
          backlogBody,
        })
      );
      if (isFulfilled(action)) {
        setShowModal(false);
        dispatch(getAllBacklogThunk());
      }
    }
  };

  useEffect(() => {
    if (existingBacklog) {
      const { name, summary, description, type, status } = existingBacklog;

      setBacklogFormInput({
        name,
        summary,
        description,
        type,
        status,
      });
      setBacklogFormError({
        name: false,
        summary: false,
        description: false,
        type: false,
        status: false,
      });
      setEditMode(false);
    }
  }, [existingBacklog]);

  return (
    <div
      className={`${Style["backlog__container"]} ${showModal && Style["show"]}`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["backlog-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["backlog-modal-title"]}>
          {editMode ? "Update Backlog details" : "View Backlog details"}
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
        <div className={Style["backlog-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter backlog Name"
                className={`${Style["modal-input"]} ${
                  backlogFormError.name && Style["modal-input-error"]
                }`}
                type="text"
                value={backlogFormInput.name}
                onChange={(evt) => backlogTextInputChangeHandler(evt, "name")}
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {backlogFormInput.name}
              </p>
            )}
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter backlog Summary"
                className={`${Style["modal-input"]} ${
                  backlogFormError.summary && Style["modal-input-error"]
                }`}
                type="text"
                value={backlogFormInput.summary}
                onChange={(evt) =>
                  backlogTextInputChangeHandler(evt, "summary")
                }
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {backlogFormInput.summary}
              </p>
            )}
          </div>

          <DescriptionField  
          editMode={editMode}
          isEditModeProp={true}
          descriptionInput={backlogFormInput.description} 
          descriptionError={backlogFormError.description} 
          InputChangeHandler={backlogTextInputChangeHandler} />

          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Type {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter Backlog Type"
                className={`${Style["modal-input"]} ${
                  backlogFormError.type && Style["modal-input-error"]
                }`}
                type="text"
                value={backlogFormInput.type}
                disabled
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {backlogFormInput.type}
              </p>
            )}
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Status {editMode && <span>*</span>}
            </label>
            {editMode ? (
              <input
                placeholder="Enter Backlog Type"
                className={`${Style["modal-input"]} ${
                  backlogFormError.type && Style["modal-input-error"]
                }`}
                type="text"
                value={backlogFormInput.status}
                disabled
              />
            ) : (
              <p className={Style["modal-detail-text"]}>
                {backlogFormInput.status}
              </p>
            )}
          </div>
        </div>

        <div className={Style["backlog-modal-action-btn__container"]}>
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
              onClick={updateBacklogHandler}
            >
              {actionStatus.updateBacklog === "loading"
                ? "Updating..."
                : "Update"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
