import { useDispatch, useSelector } from "react-redux";
import Style from "./Comments.module.css";
import { CommentInput } from "./CommentInput";
import deleteIcon from "../../../../assets/delete.svg";
import editIcon from "../../../../assets/edit.svg";
import jwtDecode from "jwt-decode";
import { ToolTip } from "../../../../components/Tooltip";
import { deleteCommentThunk } from "../../../../app/features/SprintPlanning/AsyncThunks";
import { useState } from "react";
import { CommentUpdate } from "./CommentEdit";

export const CommentModal = (props) => {
  const { showModal, setShowModal, type } = props;
  const [editComment, setEditComment] = useState(null);

  const { currentMilestoneData, currentSprintId, actionStatus } = useSelector(
    (state) => state.sprintPlanning
  );

  const dispatch = useDispatch();

  const getTaskComments = () => {
    if (currentMilestoneData) {
      const res = currentMilestoneData.tasks.find(
        (task) => task._id === showModal.taskId
      );
      return res ? res.comments : [];
    }
    return [];
  };

  const getLoggedInUser = () => {
    return jwtDecode(localStorage.getItem("token")).email;
  };

  const deleteComment = (comment) => {
    dispatch(
      deleteCommentThunk({
        sprintId: currentSprintId,
        milestoneId: currentMilestoneData._id,
        taskId: showModal.taskId,
        commentId: comment._id,
        deletedByEmail: getLoggedInUser(),
      })
    );
  };

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
        <h1 className={Style["comment-modal-title"]}>Comments</h1>

        <div className={Style["old-comments__container"]}>
          {getTaskComments()?.map((comment) => (
            <div key={comment._id} className={Style["old-comment__container"]}>
              <div className={Style["comment-owner__container"]}>
                <p>
                  Commented By{" "}
                  {getLoggedInUser() === comment.ownerEmail
                    ? "you"
                    : comment.owner}
                </p>
                {getLoggedInUser() === comment.ownerEmail && (
                  <div className={Style["action-btn__container"]}>
                    <>
                      {!editComment && (
                        <>
                          <ToolTip name={"Delete Comment"} align="top">
                            <img
                              src={deleteIcon}
                              className={`${Style["action-icon"]}`}
                              onClick={() => {
                                deleteComment(comment);
                              }}
                            />
                          </ToolTip>
                          <ToolTip name={"Edit Comment"} align="top">
                            <img
                              src={editIcon}
                              className={`${Style["action-icon"]}`}
                              onClick={() => {
                                setEditComment(comment._id);
                              }}
                            />
                          </ToolTip>
                        </>
                      )}
                    </>
                  </div>
                )}
              </div>
              <div className={Style["old-comment-message"]}>
                {(!editComment || editComment !== comment._id) && (
                  <p key={comment._id}>{comment.message}</p>
                )}
                {editComment && editComment === comment._id && (
                  <CommentUpdate
                    sprintId={currentSprintId}
                    milestoneId={currentMilestoneData._id}
                    taskId={showModal.taskId}
                    commentId={comment._id}
                    message={comment.message}
                    setEditComment={setEditComment}
                  />
                )}
              </div>
            </div>
          ))}
          <CommentInput
            milestoneId={currentMilestoneData._id}
            sprintId={currentSprintId}
            taskId={showModal.taskId}
          />
        </div>

        <div className={Style["comment-modal-action-btn__container"]}>
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
