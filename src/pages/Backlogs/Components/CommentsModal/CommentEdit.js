import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentThunk, updateCommentThunk } from "../../../../app/features/Backlogs/AsyncThunks"
import Style from "./Comments.module.css";
import { getLoggedInUser } from "../../../../utils";
import { isFulfilled } from "@reduxjs/toolkit";

export const CommentUpdate = ({
  backlogId,
  commentId,
  message,
  setEditComment,
}) => {
  const [comment, setComment] = useState("");

  const { actionStatus } = useSelector((state) => state.backlogs);
  const dispatch = useDispatch();

  useEffect(() => {
    setComment(message);
  }, [commentId]);

  const updateCommentHandler = async (updatedComment) => {

    const action = await dispatch(
      updateCommentThunk({
        backlogId,
        commentId,
        commentBody: {
          editedByEmail: getLoggedInUser().email,
          message: updatedComment,
        },
      })
    );
    if (isFulfilled(action)) {
      setEditComment(null);
    }
  };

  return (
    <div className={Style["comment-edit__container"]}>
      <textarea
        className={Style["comment-input"]}
        value={comment}
        onChange={(evt) => setComment(evt.target.value)}
      />
      <div className={Style["action-btn__container"]}>
        <button
          className={`${Style["btn"]} ${Style["btn-secondary"]}`}
          onClick={() => {
            setEditComment(null);
          }}
        >
          Cancel
        </button>
        <button
          className={`${Style["btn"]} ${Style["btn-primary"]}`}
          onClick={() => {
            updateCommentHandler(comment);
          }}
        >
          {actionStatus.updateComment === "loading"
            ? "Updating..."
            : "Update comment"}
        </button>
      </div>
    </div>
  );
};
