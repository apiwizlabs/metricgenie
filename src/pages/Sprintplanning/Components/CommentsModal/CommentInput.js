import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewCommentThunk,
  getCommentsInTaskThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import Style from "./Comments.module.css";
import jwtDecode from "jwt-decode";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "react-bootstrap";

export const CommentInput = ({ sprintId, milestoneId, taskId }) => {
  const [comment, setComment] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const { actionStatus } = useSelector((state) => state.sprintPlanning);
  const dispatch = useDispatch();

  const addCommentHandler = async (comment) => {
    const decoded = jwtDecode(localStorage.getItem("token"));

    const action = await dispatch(
      createNewCommentThunk({
        sprintId,
        milestoneId,
        taskId,
        commentBody: {
          message: comment,
          owner: decoded.name,
          ownerEmail: decoded.email,
        },
      })
    );

    if (isFulfilled(action)) {
      dispatch(
        getCommentsInTaskThunk({
          sprintId,
          milestoneId,
          taskId,
        })
      );
      setComment("");
    }
  };

  return (
    <div className={Style["comment-input__container"]}>
      {isPreview ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          children={comment}
          className="markdown-preview-v2"
        />
      ) : (
        <textarea
          className={Style["comment-input"]}
          value={comment}
          onChange={(evt) => setComment(evt.target.value)}
        />
      )}
      <div
        style={{
          color: "#b6b4b4",
        }}
      >
        Markdown is supported
      </div>

      <div
        className="d-flex"
        style={{
          gap: "8px",
        }}
      >
        <button
          className={`${Style["btn"]} ${Style["btn-primary"]}`}
          onClick={() => {
            addCommentHandler(comment);
          }}
        >
          {actionStatus.createNewComment === "loading"
            ? "Commenting..."
            : "Add comment"}
        </button>
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
      </div>
    </div>
  );
};
