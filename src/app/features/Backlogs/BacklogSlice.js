import { createSlice } from "@reduxjs/toolkit";
import {
  getAllBacklogThunk,
  getBacklogByIdThunk,
  getBacklogAttachmentByIdThunk,
  getCommentByIdThunk,
  getBacklogAttachmentsThunk,
  getCommentsInBacklogThunk,
  createBacklogThunk,
  updateBacklogThunk,
  deleteBacklogThunk,
  updateCommentThunk,
  createCommentThunk,
  deleteCommentThunk,
  createAttachmentThunk,
} from "./AsyncThunks";

const initialState = {
  backlogData: [],
  actionStatus: {},
};

const BacklogSlice = createSlice({
  name: "backlog",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllBacklogThunk.pending]: (state) => {
      state.actionStatus.getAllBacklog = "loading";
      state.actionStatus.getAllBacklogError = null;
    },
    [getAllBacklogThunk.fulfilled]: (state, action) => {
      state.backlogData = action.payload.data;
      state.actionStatus.getAllBacklog = "fulfilled";
      state.actionStatus.getAllBacklogError = null;
    },
    [getAllBacklogThunk.rejected]: (state) => {
      state.getAllBacklog = state.getAllBacklogError = "error";
    },
    [createBacklogThunk.pending]: (state) => {
      state.actionStatus.createBacklog = "loading";
      state.actionStatus.createBacklogError = null;
    },
    [createBacklogThunk.fulfilled]: (state) => {
      state.actionStatus.createBacklog = "fulfilled";
      state.actionStatus.createBacklogError = null;
    },
    [createBacklogThunk.rejected]: (state) => {
      state.actionStatus.createBacklog = state.actionStatus.createBacklogError =
        "error";
    },
    [updateBacklogThunk.pending]: (state) => {
      state.actionStatus.updateBacklog = "loading";
      state.actionStatus.updateBacklogError = null;
    },
    [updateBacklogThunk.fulfilled]: (state) => {
      state.actionStatus.updateBacklog = "fulfilled";
      state.actionStatus.updateBacklogError = null;
    },
    [updateBacklogThunk.rejected]: (state) => {
      state.actionStatus.updateBacklog = state.actionStatus.updateBacklogError =
        "error";
    },
    [deleteBacklogThunk.pending]: (state) => {
      state.actionStatus.deleteBacklog = "loading";
      state.actionStatus.deleteBacklogError = null;
    },
    [deleteBacklogThunk.fulfilled]: (state) => {
      state.actionStatus.deleteBacklog = "fulfilled";
      state.actionStatus.deleteBacklogError = null;
    },
    [deleteBacklogThunk.rejected]: (state) => {
      state.actionStatus.deleteBacklog = state.actionStatus.deleteBacklogError =
        "error";
    },
    [updateCommentThunk.pending]: (state) => {
      state.actionStatus.updateComment = "loading";
      state.actionStatus.updateCommentError = null;
    },
    [updateCommentThunk.fulfilled]: (state, action) => {
      const { backlogId, commentId, commentBody } = action.payload;

      const updatedbacklog = state.backlogData.map((backlog) => {
        if (backlog._id === backlogId) {
          return {
            ...backlog,
            comments: backlog.comments.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  message: commentBody.message,
                };
              }
              return comment;
            }),
          };
        }
        return backlog;
      });

      state.backlogData = updatedbacklog;
      state.actionStatus.updateComment = "fulfilled";
      state.actionStatus.updateCommentError = null;
    },
    [updateCommentThunk.rejected]: (state) => {
      state.actionStatus.updateComment = state.actionStatus.updateCommentError =
        "error";
    },
    [createCommentThunk.pending]: (state) => {
      state.actionStatus.createComment = "loading";
      state.actionStatus.createCommentError = null;
    },
    [createCommentThunk.fulfilled]: (state) => {
      state.actionStatus.createComment = "fulfilled";
      state.actionStatus.createCommentError = null;
    },
    [createCommentThunk.rejected]: (state) => {
      state.actionStatus.createComment = "error";
      state.actionStatus.createCommentError = null;
    },
    [getCommentsInBacklogThunk.pending]: (state) => {
      state.actionStatus.getComments = "loading";
      state.actionStatus.getCommentsError = null;
    },
    [getCommentsInBacklogThunk.fulfilled]: (state, action) => {
      const { backlogId, data } = action.payload;
      const updatedBacklogs = state.backlogData.map((backlog) => {
        if (backlog._id === backlogId) {
          return {
            ...backlog,
            comments: data.data.comments,
          };
        } else {
          return backlog;
        }
      });
      state.backlogData = updatedBacklogs;
      state.actionStatus.getComments = "fulfilled";
      state.actionStatus.getCommentsError = null;
    },
    [getCommentsInBacklogThunk.pending]: (state) => {
      state.actionStatus.getComments = "loading";
      state.actionStatus.getCommentsError = null;
    },
    [deleteCommentThunk.pending]: (state) => {
      state.deleteComment = "loading";
      state.deleteCommentError = null;
    },
    [deleteCommentThunk.fulfilled]: (state, action) => {
      const { backlogId, commentId } = action.payload;
      const updatedBacklogs = state.backlogData.map((backlog) => {
        if (backlog._id === backlogId) {
          return {
            ...backlog,
            comments: backlog.comments.filter(
              (comment) => comment._id !== commentId
            ),
          };
        }
        return backlog;
      });

      state.backlogData = updatedBacklogs;
      state.deleteComment = "fulfilled";
      state.deleteCommentError = null;
    },
    [deleteCommentThunk.rejected]: (state) => {
      state.deleteComment = state.deleteCommentError = "error";
    },
    [createAttachmentThunk.pending]: (state) => {
      state.createAttachment = "loading";
      state.createAttachmentError = null;
    },
    [createAttachmentThunk.fulfilled]: (state) => {
      state.createAttachment = "fulfilled";
      state.createAttachmentError = null;
    },
    [createAttachmentThunk.rejected]: (state) => {
      state.createAttachment = state.createAttachmentError = "error";
    },
    [getBacklogAttachmentsThunk.pending]: (state) => {
      state.actionStatus.getBacklogAttachments = "loading";
      state.actionStatus.getBacklogAttachmentsError = null;
    },
    [getBacklogAttachmentsThunk.fulfilled]: (state, action) => {
      const { data, backlogId } = action.payload;
      
      const updatedBacklog = state.backlogData.map((backlog) => {
        if (backlog._id === backlogId) {
          return {
            ...backlog,
            attachments: data.data.attachments,
          };
        }else{
          return backlog;
        }
      });
      state.backlogData = updatedBacklog;
      state.actionStatus.getBacklogAttachments = "fulfilled";
      state.actionStatus.getBacklogAttachments = null;
    },
    [getBacklogAttachmentsThunk.rejected]: (state) => {
      state.actionStatus.getBacklogAttachments =
        state.actionStatus.getBacklogAttachmentsError = "error";
    },
  },
});

export default BacklogSlice.reducer;
