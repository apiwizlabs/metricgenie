import { createAsyncThunk } from "@reduxjs/toolkit";
import { BacklogTrackerAPI } from "../../../../api/apiConfig";

export const getAllBacklogThunk = createAsyncThunk(
  "backlogs/getAllBacklog",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getAllBacklogs();
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBacklogByIdThunk = createAsyncThunk(
  "backlogs/getBacklogById",
  async ({ backlogId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getBacklogById({
        backlogId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCommentsInBacklogThunk = createAsyncThunk(
  "backlogs/getCommentsInBacklog",
  async ({ backlogId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getCommentsInBacklog({
        backlogId,
      });
      return {
        backlogId,
        data: response.data
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCommentByIdThunk = createAsyncThunk(
  "backlogs/getCommentById",
  async ({ backlogId, commentId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getBacklogCommentById({
        backlogId,
        commentId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBacklogAttachmentsThunk = createAsyncThunk(
  "backlogs/getBacklogAttachments",
  async ({ backlogId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getBacklogAttachments({
        backlogId,
      });
      return {
        data: response.data,
        backlogId
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBacklogAttachmentByIdThunk = createAsyncThunk(
  "backlogs/getBacklogAttachmentById",
  async ({ backlogId, attachmentId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.GET.getBacklogAttachmentById({
        backlogId,
        attachmentId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createBacklogThunk = createAsyncThunk(
  "backlogs/createBacklog",
  async ({ backlogBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.POST.createBacklog({
        backlogBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  "backlogs/createComment",
  async ({ backlogId, commentBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.POST.createNewComment({
        backlogId,
        commentBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createAttachmentThunk = createAsyncThunk(
  "backlogs/createAttachment",
  async ({ backlogId, attachmentBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.POST.createNewAttachment({
        backlogId,
        attachmentBody,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateBacklogThunk = createAsyncThunk(
  "backlogs/updateBacklog",
  async ({ backlogId, backlogBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.PUT.updateBacklog({
        backlogId,
        backlogBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "backlogs/updateComment",
  async ({ backlogId, commentId, commentBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.PUT.updateComment({
        backlogId,
        commentId,
        commentBody,
      });

      return {
        backlogId,
        commentId,
        commentBody
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAttachmentThunk = createAsyncThunk(
  "backlogs/updateAttachment",
  async ({ backlogId, attachmentId, attachmentBody }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.PUT.updateAttachment({
        backlogId,
        attachmentId,
        attachmentBody,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteBacklogThunk = createAsyncThunk(
  "backlogs/deleteBacklog",
  async ({ backlogId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.DELETE.deleteBacklog({
        backlogId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "backlogs/deleteComment",
  async ({ backlogId, commentId, deletedByEmail }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.DELETE.deleteComment({
        backlogId,
        commentId,
        deletedByEmail
      });
      return {
        backlogId,
        commentId
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAttachmentThunk = createAsyncThunk(
  "backlogs/deleteAttachment",
  async ({ backlogId, attachmentId }, { rejectWithValue }) => {
    try {
      const response = await BacklogTrackerAPI.DELETE.deleteAttachment({
        backlogId,
        attachmentId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
