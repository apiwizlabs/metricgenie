import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBacklogThunk,
  getAllBacklogThunk,
} from "../../../../app/features/Backlogs/AsyncThunks";
import Style from "./backlogForm.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Button } from "react-bootstrap";
import { DescriptionField } from "../../../../components/DescriptionField";


export const BacklogForm = (props) => {
  const { showModal, setShowModal } = props;
  const [backlogFormInput, setbacklogFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    type: "BACKLOG",
    status: "BACKLOG",
  });

  const [backlogFormError, setBacklogFormError] = useState({
    type: false,
    status: false,
  });

  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.backlogs);

  const getInitialState = () => {
    return {
      name: "",
      summary: "",
      description: "",
      type: "BACKLOG",
      status: "BACKLOG",
    };
  };

  useEffect(() => {
    setbacklogFormInput(getInitialState());
    setBacklogFormError({
        type: false,
        status: false
    })
  }, [showModal]);

  const backlogTextInputChangeHandler = (evt, field) => {
    setbacklogFormInput((prev) => ({
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

  const createbacklogHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      // call backlog create thunk
      const backlogBody = { ...backlogFormInput };

      const action = await dispatch(
        createBacklogThunk({
          backlogBody,
        })
      );
      if (isFulfilled(action)) {
        setbacklogFormInput(getInitialState());

        setBacklogFormError({
          type: false,
          status: false,
        });
        setShowModal(false);
        dispatch(getAllBacklogThunk());
      }
    }
  };

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
        <h1 className={Style["backlog-modal-title"]}>Enter backlog details</h1>
        <div className={Style["backlog-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name <span>*</span>
            </label>
            <input
              placeholder="Enter backlog Name"
              className={`${Style["modal-input"]} ${
                backlogFormError.name && Style["modal-input-error"]
              }`}
              type="text"
              value={backlogFormInput.name}
              onChange={(evt) => backlogTextInputChangeHandler(evt, "name")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary <span>*</span>
            </label>
            <input
              placeholder="Enter backlog Summary"
              className={`${Style["modal-input"]} ${
                backlogFormError.summary && Style["modal-input-error"]
              }`}
              type="text"
              value={backlogFormInput.summary}
              onChange={(evt) => backlogTextInputChangeHandler(evt, "summary")}
            />
          </div>

          <DescriptionField  
          descriptionInput={backlogFormInput.description} 
          descriptionError={backlogFormError.description} 
          InputChangeHandler={backlogTextInputChangeHandler} />

          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Type <span>*</span>
            </label>
            <input
              placeholder="Enter Backlog Type"
              className={`${Style["modal-input"]} ${
                backlogFormError.type && Style["modal-input-error"]
              }`}
              type="text"
              value={backlogFormInput.type}
              disabled
            />
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} for="type">
              Status <span>*</span>
            </label>
            <input
              placeholder="Enter Backlog Type"
              className={`${Style["modal-input"]} ${
                backlogFormError.status && Style["modal-input-error"]
              }`}
              type="text"
              value={backlogFormInput.status}
              disabled
            />
          </div>
        </div>

        {/* Start of action buttons  */}
        <div className={Style["backlog-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
              setBacklogFormError({
                type: false,
                status: false,
              });
            }}
          >
            Cancel
          </button>
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            disabled={validateForm()}
            onClick={createbacklogHandler}
          >
            { actionStatus.createBacklog === "loading" ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
