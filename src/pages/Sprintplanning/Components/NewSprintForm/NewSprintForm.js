import { useEffect, useState } from "react";
import Style from "./NewSprintForm.module.css";
import {
  createNewSprintThunk,
  getSprintInfoThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";
import remarkGfm from "remark-gfm";
import { DescriptionField } from "../../../../components/DescriptionField";
import { toast } from "react-toastify";

export const NewSprintFormModal = (props) => {
  const { showModal, setShowModal } = props;
  const [sprintFormInput, setSprintFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    type: "ENGINEERING",
  });
  const [sprintFormError, setSprintFormError] = useState({
    type: false,
  });
  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.sprintPlanning);

  const validateForm = () => {
    return Object.keys(sprintFormInput).reduce((acc, curr) => {
      if (sprintFormError[curr] !== undefined) {
        return acc || sprintFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const sprintTextInputChangeHandler = (evt, field) => {
    setSprintFormInput((prev) => ({
      ...prev,
      [field]: evt.target.value,
    }));
    if (evt.target.value.length === 0) {
      setSprintFormError((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      setSprintFormError((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const createSprintHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      const action = await dispatch(
        createNewSprintThunk({
          sprintBody: {
            ...sprintFormInput,
          },
        })
      );
      if (isFulfilled(action)) {
        const { payload } = action
        if(payload.success) {
          setSprintFormInput({
            name: "",
            summary: "",
            description: "",
            startDate: "",
            endDate: "",
            status: "",
            type: "ENGINEERING",
          });
  
          setSprintFormError({});
          setShowModal(false);
          dispatch(getSprintInfoThunk());
        }else {
          toast.error(payload.message)
        }
      }
    }
  };

  return (
    <div
      className={`${Style["new-sprint__container"]} ${
        showModal && Style["show"]
      }`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
        setSprintFormInput({
          name: "",
          summary: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "",
          type: "ENGINEERING",
        });

        setSprintFormError({});
      }}
    >
      <div
        className={Style["new-sprint-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["new-sprint-modal-title"]}>
          Enter Sprint details
        </h1>
        <div className={Style["new-sprint-modal-input__container"]}>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Name <span>*</span>
            </label>
            <input
              placeholder="Enter Sprint Name"
              className={`${Style["modal-input"]} ${
                sprintFormError.name && Style["modal-input-error"]
              }`}
              type="text"
              value={sprintFormInput.name}
              onChange={(evt) => sprintTextInputChangeHandler(evt, "name")}
            />
          </div>
          <div className={Style["input-group__container"]}>
            <label className={Style["modal-input-label"]}>
              Summary <span>*</span>
            </label>
            <input
              placeholder="Enter Sprint Summary"
              className={`${Style["modal-input"]} ${
                sprintFormError.summary && Style["modal-input-error"]
              }`}
              type="text"
              value={sprintFormInput.summary}
              onChange={(evt) => sprintTextInputChangeHandler(evt, "summary")}
            />
          </div>
          <DescriptionField
            descriptionInput={sprintFormInput.description}
            descriptionError={sprintFormError.description}
            InputChangeHandler={sprintTextInputChangeHandler}
          />

          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]}>
              Sprint Type <span>*</span>
            </label>
            <div className={`${Style["radio-input-group__container"]}`}>
              <div className={`${Style["radio-input"]}`}>
                <input
                  type="radio"
                  id="Engineering"
                  value="ENGINEERING"
                  checked={sprintFormInput.type === "ENGINEERING"}
                  onClick={(evt) => sprintTextInputChangeHandler(evt, "type")}
                />
                <label for="Engineering">Engineering</label>
              </div>
              <div className={`${Style["radio-input"]}`}>
                <input
                  type="radio"
                  id="Internal"
                  value="INTERNAL"
                  checked={sprintFormInput.type === "INTERNAL"}
                  onClick={(evt) => sprintTextInputChangeHandler(evt, "type")}
                />
                <label for="Internal">Internal</label>
              </div>
            </div>
          </div>
          <div className={`${Style["input-group__container"]} d-flex flex-row`}>
            <div className={Style["modal-date-input__container"]}>
              <label className={Style["modal-input-label"]}>
                Start Date <span>*</span>
              </label>
              <input
                type={"date"}
                className={`${Style["modal-date-input"]} ${
                  sprintFormError.startDate && Style["modal-input-error"]
                }`}
                value={sprintFormInput.startDate}
                onChange={(evt) => {
                  setSprintFormInput((prev) => ({
                    ...prev,
                    startDate: evt.target.value,
                  }));
                  if (evt.target.value.length === 0) {
                    setSprintFormError((prev) => ({
                      ...prev,
                      startDate: true,
                    }));
                  } else {
                    setSprintFormError((prev) => ({
                      ...prev,
                      startDate: false,
                    }));
                  }
                }}
              />
            </div>
            <div className={Style["modal-date-input__container"]}>
              <label className={Style["modal-input-label"]}>
                End Date <span>*</span>
              </label>
              <input
                type={"date"}
                className={`${Style["modal-date-input"]} ${
                  sprintFormError.endDate && Style["modal-input-error"]
                }`}
                value={sprintFormInput.endDate}
                onChange={(evt) => {
                  setSprintFormInput((prev) => ({
                    ...prev,
                    endDate: evt.target.value,
                  }));
                  if (evt.target.value.length === 0) {
                    setSprintFormError((prev) => ({
                      ...prev,
                      endDate: true,
                    }));
                  } else {
                    setSprintFormError((prev) => ({
                      ...prev,
                      endDate: false,
                    }));
                  }
                }}
              />
            </div>
          </div>
          <div className={`${Style["input-group__container"]}`}>
            <label className={Style["modal-input-label"]} htmlFor="status">
              Status <span>*</span>
            </label>
            <select
              name="status"
              id="status"
              className={Style["modal-input"]}
              value={sprintFormInput.status}
              onChange={(evt) => {
                setSprintFormInput((prev) => ({
                  ...prev,
                  status: evt.target.value,
                }));

                if (evt.target.value.length === 0) {
                  setSprintFormError((prev) => ({
                    ...prev,
                    status: true,
                  }));
                } else {
                  setSprintFormError((prev) => ({
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
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className={Style["new-sprint-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
              setSprintFormInput({
                name: "",
                summary: "",
                description: "",
                startDate: "",
                endDate: "",
                status: "",
                type: "ENGINEERING",
              });
              setSprintFormError({});
            }}
          >
            Cancel
          </button>
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            disabled={validateForm()}
            onClick={createSprintHandler}
          >
            {actionStatus.createNewSprint === "loading"
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
