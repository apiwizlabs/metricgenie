import { useDispatch, useSelector } from "react-redux";
import Style from "./Deletemodal.module.css";
import {
  deleteTaskThunk,
  getSprintByIdThunk,
  deleteMilestoneThunk,
  deleteSubTaskThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { isFulfilled } from "@reduxjs/toolkit";

export const DeleteModal = (props) => {
  const { showModal, setShowModal, type } = props;
  const dispatch = useDispatch();
  const { currentSprintId, currentMilestoneData } = useSelector(
    (state) => state.sprintPlanning
  );

  const deleteTaskHandler = async (evt, taskId) => {
    evt.stopPropagation();
    let action = null;
    if (showModal.parentTaskId) {
      action = await dispatch(
        deleteSubTaskThunk({
          milestoneId: currentMilestoneData._id,
          sprintId: currentSprintId,
          taskId: showModal.parentTaskId,
          subTaskId: taskId,
        })
      );
    } else {
      action = await dispatch(
        deleteTaskThunk({
          milestoneId: currentMilestoneData._id,
          sprintId: currentSprintId,
          taskId,
        })
      );
    }

    if (isFulfilled(action)) {
      dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
    }
  };

  console.log("showModal in delete: ", showModal)

  return (
    <div
      className={`${Style["comments__container"]} ${
        showModal.show && Style["show"]
      }`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["comment-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["delete-modal-title"]}>Delete Confirmation </h1>
        <p className={Style["delete-modal-body"]}>
          Are you sure you want to delete this item?
        </p>

        <div className={Style["comment-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            onClick={(e) => {
              setShowModal(false);
              deleteTaskHandler(e, showModal.taskId);
            }}
          >
            Delete
          </button>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
