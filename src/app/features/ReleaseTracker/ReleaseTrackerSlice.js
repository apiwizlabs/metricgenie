import { createSlice } from "@reduxjs/toolkit";
import {
  createReleaseThunk,
  getReleaseThunk,
  getReleaseByIdThunk,
  getAllMilestonesThunk,
  addTasksToReleaseThunk,
  updateReleaseThunk,
  deleteReleaseTaskThunk,
  deleteRelease,
} from "./AsyncThunks";

const initialState = {
  allReleases: [],
  allMilestones: null,
  currentReleaseId: null,
  currentRelease: null,
  actionStatus: {},
};

const ReleaseSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    setCurrentRelease: (state, action) => {
      const { releaseId } = action.payload;
      state.currentReleaseId = releaseId;
    },
  },
  extraReducers: {
    [getReleaseThunk.pending]: (state) => {
      state.actionStatus.getRelease = "loading";
      state.actionStatus.getReleaseError = null;
    },
    [getReleaseThunk.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.allReleases = data;
      state.actionStatus.getRelease = "fulfilled";
      state.actionStatus.getReleaseError = null;
    },
    [getReleaseThunk.rejected]: (state) => {
      state.actionStatus.getRelease = state.actionStatus.getReleaseError =
        "error";
    },
    [getReleaseByIdThunk.pending]: (state) => {
      state.actionStatus.getReleaseById = "loading";
      state.actionStatus.getReleaseByIdError = null;
    },
    [getReleaseByIdThunk.fulfilled]: (state, action) => {
      const { releaseId, data } = action.payload;
      state.currentReleaseId = releaseId;
      state.currentRelease = data.data;
      state.actionStatus.getReleaseById = "fulfilled";
      state.actionStatus.getReleaseByIdError = null;
    },
    [getReleaseByIdThunk.rejected]: (state) => {
      state.actionStatus.getReleaseById =
        state.actionStatus.getReleaseByIdError = "error";
    },
    [createReleaseThunk.pending]: (state) => {
      state.actionStatus.createRelease = "loading";
      state.actionStatus.createReleaseError = null;
    },
    [createReleaseThunk.fulfilled]: (state, action) => {
      state.actionStatus.createRelease = "fulfilled";
      state.actionStatus.createReleaseError = null;
    },
    [createReleaseThunk.rejected]: (state) => {
      state.actionStatus.createRelease = state.actionStatus.createReleaseError =
        "error";
    },
    [updateReleaseThunk.pending]: (state) => {
      state.actionStatus.updateRelease = "loading";
      state.actionStatus.updateReleaseError = null;
    },
    [updateReleaseThunk.fulfilled]: (state, action) => {
      state.actionStatus.updateRelease = "fulfilled";
      state.actionStatus.updateReleaseError = null;
    },
    [updateReleaseThunk.rejected]: (state) => {
      state.actionStatus.updateRelease = state.actionStatus.updateReleaseError =
        "error";
    },
    [getAllMilestonesThunk.pending]: (state) => {
      state.actionStatus.getAllMilestone = "loading";
      state.actionStatus.getAllMilestoneError = null;
    },
    [getAllMilestonesThunk.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.allMilestones = data;
      state.actionStatus.getAllMilestone = "fulfilled";
      state.actionStatus.getAllMilestoneError = null;
    },
    [getAllMilestonesThunk.rejected]: (state, action) => {
      state.actionStatus.getAllMilestone =
        state.actionStatus.getAllMilestoneError = "error";
    },
    [addTasksToReleaseThunk.pending]: (state) => {
      state.actionStatus.addTasksToRelease = "loading";
      state.actionStatus.addTasksToReleaseError = null;
    },
    [addTasksToReleaseThunk.fulfilled]: (state) => {
      state.actionStatus.addTasksToRelease = "fulfilled";
      state.actionStatus.addTasksToReleaseError = null;
    },
    [addTasksToReleaseThunk.rejected]: (state) => {
      state.actionStatus.addTasksToRelease =
        state.actionStatus.addTasksToReleaseError = "error";
    },
    [deleteReleaseTaskThunk.pending]: (state) => {
      state.actionStatus.deleteReleaseTask = "loading";
      state.actionStatus.deleteReleaseTaskError = null;
    },
    [deleteReleaseTaskThunk.fulfilled]: (state) => {
      state.actionStatus.deleteReleaseTask = "fulfilled";
      state.actionStatus.deleteReleaseTaskError = null;
    },
    [deleteReleaseTaskThunk.rejected]: (state) => {
      state.actionStatus.deleteReleaseTask =
        state.actionStatus.deleteReleaseTaskError = "error";
    },
    [deleteRelease.pending]: (state) => {
      state.actionStatus.deleteRelease = "loading";
      state.actionStatus.deleteReleaseError = null;
    },
    [deleteRelease.fulfilled]: (state, action) => {
      const { data, id } = action.payload
      console.log("delete release data, id: ", data, id)
      if(data.status === 200){
        const _newReleases = state.allReleases.filter(release => release._id !== id)
        state.allReleases = _newReleases
      }
      state.actionStatus.deleteRelease = "fulfilled"
      state.actionStatus.deleteReleaseError = null
    },
    [deleteRelease.rejected]: (state) => {
      state.actionStatus.deleteRelease = state.actionStatus.deleteReleaseError = "error"
    }
  },
});
export const { setCurrentRelease } = ReleaseSlice.actions;
export default ReleaseSlice.reducer;
