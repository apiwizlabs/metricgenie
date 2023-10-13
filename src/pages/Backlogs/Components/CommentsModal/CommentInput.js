import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentThunk, getCommentsInBacklogThunk } from "../../../../app/features/Backlogs/AsyncThunks"
import Style from "./Comments.module.css";
import { getLoggedInUser } from "../../../../utils"
import { isFulfilled } from "@reduxjs/toolkit";

export const CommentInput = ({ backlogId }) => {
  const [comment, setComment] = useState("");

  const { actionStatus } = useSelector((state) => state.backlogs);
  const dispatch = useDispatch();

  const addCommentHandler = async (comment) => {

    const action = await dispatch(
        createCommentThunk({
        backlogId,
        commentBody: {
          message: comment,
          owner: getLoggedInUser().name,
          ownerEmail: getLoggedInUser().email,
        },
      })
    );

    if (isFulfilled(action)) {
      dispatch(
        getCommentsInBacklogThunk({
          backlogId
        })
      );
      setComment("")
    }
  };

  return (
    <div className={Style["comment-input__container"]}>
      <textarea
        className={Style["comment-input"]}
        value={comment}
        onChange={(evt) => setComment(evt.target.value)}
      />
      <button
        className={`${Style["btn"]} ${Style["btn-primary"]}`}
        onClick={() => {
          addCommentHandler(comment);
        }}
      >
        {actionStatus.createComment === "loading"
          ? "Commenting..."
          : "Add comment"}
      </button>
    </div>
  );
};
