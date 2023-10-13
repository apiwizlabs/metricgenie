import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewCommentThunk,
  getCommentsInTaskThunk,
  updateCommentThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import Style from "./Comments.module.css";
import jwtDecode from "jwt-decode";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "react-bootstrap";

export const CommentUpdate = ({
  sprintId,
  milestoneId,
  taskId,
  commentId,
  message,
  setEditComment,
}) => {
  const [comment, setComment] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const { actionStatus } = useSelector((state) => state.sprintPlanning);
  const dispatch = useDispatch();

  useEffect(() => {
    setComment(message);
  }, [commentId]);

  const updateCommentHandler = async (updatedComment) => {
    const decoded = jwtDecode(localStorage.getItem("token"));

    const action = await dispatch(
      updateCommentThunk({
        sprintId,
        milestoneId,
        taskId,
        commentId,
        commentBody: {
          editedByEmail: decoded.email,
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
      <Button
        variant="light"
        size="sm"
        style={{
          width: "max-content",
        }}
        onClick={() => setIsPreview((prev) => !prev)}
      >
        {isPreview ? "Edit Markdown" : "Preview Markdown"}
      </Button>
      {isPreview ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} children={comment} />
      ) : (
        <textarea
          className={Style["comment-input"]}
          value={comment}
          onChange={(evt) => setComment(evt.target.value)}
        />
      )}
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
