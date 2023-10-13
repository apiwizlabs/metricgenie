import { createAsyncThunk } from "@reduxjs/toolkit";
import { BugTrackerAPI } from "../../../../api/apiConfig";

export const createBugThunk = createAsyncThunk(
  "bugs/createBug",
  async ({ bugBody }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.POST.createBug({ bugBody });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createAttachmentThunk = createAsyncThunk(
  "bugs/createAttachment",
  async ({ bugId, attachmentBody }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.POST.createAttachment({
        bugId,
        attachmentBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateBugThunk = createAsyncThunk(
  "bugs/updateBug",
  async ({ bugId, bugBody }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.PUT.updateBug({ bugId, bugBody });
      return {
        bugId,
        bugBody,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBugsThunk = createAsyncThunk(
  "bugs/getBugs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.GET.getAllBugs();
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBugByIdThunk = createAsyncThunk(
  "bugs/getBugById",
  async ({ bugId }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.GET.getBugById({ bugId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getBugAttachmentsThunk = createAsyncThunk(
  "bugs/getBugAttachments",
  async ({ bugId }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.GET.getBugAttachments({ bugId });
      return {
        data: response.data,
        bugId,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteBugThunk = createAsyncThunk(
  "bugs/deleteBug",
  async ({ bugId }, { rejectWithValue }) => {
    try {
      const response = await BugTrackerAPI.DELETE.deleteBug({ bugId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
