import { createAsyncThunk } from "@reduxjs/toolkit";
import { ReleaseTrackerAPI } from "../../../../api/apiConfig";

export const getReleaseThunk = createAsyncThunk(
  "releases/getRelease",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.GET.getAllReleases();
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getReleaseByIdThunk = createAsyncThunk(
  "releases/getRleaseById",
  async ({ releaseId }, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.GET.getReleaseById({
        releaseId,
      });
      return {
        releaseId,
        data: response.data,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createReleaseThunk = createAsyncThunk(
  "releases/createRelease",
  async ({ releaseBody }, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.POST.createNewRelease({
        releaseBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateReleaseThunk = createAsyncThunk(
  "releases/updateRelease",
  async ({ releaseBody, releaseId }, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.PUT.updateRelease({
        releaseBody,
        releaseId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllMilestonesThunk = createAsyncThunk(
  "releases/getAllMilestone",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.GET.getAllMilestones();
      console.log({ response });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addTasksToReleaseThunk = createAsyncThunk(
  "releases/addTasksToRelease",
  async ({ releaseId, releaseBody }, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.POST.addTasksToRelease({
        releaseBody,
        releaseId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteReleaseTaskThunk = createAsyncThunk(
  "releases/deleteReleaseTaskById",
  async ({ taskId, releaseId }, { rejectWithValue }) => {
    try {
      const response = await ReleaseTrackerAPI.DELETE.deleteReleaseTask({
        taskId, releaseId
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteRelease = createAsyncThunk("releases/deleteRelease", async ({ releaseId }, { rejectWithValue }) => {
  try {
    const response = await ReleaseTrackerAPI.DELETE.deleteRelease({ releaseId })

    return {
      data: response,
      id: releaseId
    }
  } catch(err) {
    return rejectWithValue(err)
  }
})