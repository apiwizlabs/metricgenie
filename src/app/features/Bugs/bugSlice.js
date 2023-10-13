import { createSlice } from "@reduxjs/toolkit";
import { updateAttachmentThunk } from "../Backlogs/AsyncThunks";
import {
  getBugsThunk,
  getBugByIdThunk,
  getBugAttachmentsThunk,
  createBugThunk,
  createAttachmentThunk,
  updateBugThunk,
  deleteBugThunk,
} from "./AsyncThunks";

const initialState = {
  bugsData: [],
  actionStatus: {},
};

const BugSlice = createSlice({
  name: "bugs",
  initialState,
  reducers: {},
  extraReducers: {
    [getBugsThunk.pending]: (state) => {
      state.actionStatus.getBugs = "loading";
      state.actionStatus.getBugsError = null;
    },
    [getBugsThunk.fulfilled]: (state, action) => {
      state.bugsData = action.payload.data;
      state.actionStatus.getBugs = "fulfilled";
      state.actionStatus.getBugsError = null;
    },
    [getBugsThunk.rejected]: (state) => {
      state.actionStatus.getBugs = state.actionStatus.getBugsError = "error";
    },
    [getBugAttachmentsThunk.pending]: (state) => {
      state.getBugAttachments = "loading";
      state.getBugAttachmentsError = null;
    },
    [getBugAttachmentsThunk.fulfilled]: (state, action) => {
      const { bugId, data } = action.payload;
      const updatedBugs = state.bugsData.map((bug) => {
        if (bug._id === bugId) {
          return {
            ...bug,
            attachments: data.data.attachments,
          };
        }
        return bug;
      });

      state.bugsData = updatedBugs;
      state.getBugAttachments = "fulfilled";
      state.getBugAttachmentsError = null;
    },
    [getBugAttachmentsThunk.rejected]: (state) => {
      state.getBugAttachments = state.getBugAttachmentsError = "error";
    },
    [createBugThunk.pending]: (state) => {
      state.createBug = "loading";
      state.createBugError = null;
    },
    [createBugThunk.fulfilled]: (state) => {
      state.createBug = "fulfilled";
      state.createBugError = null;
    },
    [createBugThunk.rejected]: (state) => {
      state.createBug = state.createBugError = "error";
    },
    [createAttachmentThunk.pending]: (state) => {
      state.createAttachment = "loading";
      state.createAttachment = null;
    },
    [createAttachmentThunk.fulfilled]: (state) => {
      state.createAttachment = "fulfillec";
      state.createAttachment = null;
    },
    [createAttachmentThunk.rejected]: (state) => {
      state.createAttachment = state.createAttachment = "error";
    },
    [updateAttachmentThunk.pending]: (state) => {
      state.updateAttachment = "loading";
      state.updateAttachmentError = null;
    },
    [updateAttachmentThunk.fulfilled]: (state) => {
      state.updateAttachment = "fulfilled";
      state.updateAttachmentError = null;
    },
    [updateAttachmentThunk.rejected]: (state) => {
      state.updateAttachment = state.updateAttachmentError = "error";
    },
    [updateBugThunk.pending]: (state) => {
      state.updateBug = "loading";
      state.updateBugError = null;
    },
    [updateBugThunk.fulfilled]: (state) => {
      state.updateBug = "fulfilled";
      state.updateBugError = null;
    },
    [updateBugThunk.rejected]: (state) => {
      state.updateBug = state.updateBugError = "error";
    },
    [deleteBugThunk.pending]: (state) => {
      state.actionStatus.deleteBug = "loading";
      state.actionStatus.deleteBugError = null;
    },
    [deleteBugThunk.fulfilled]: (state) => {
      state.actionStatus.deleteBug = "fulfilled";
      state.actionStatus.deleteBugError = null;
    },
    [deleteBugThunk.rejected]: (state) => {
      state.actionStatus.deleteBug = state.actionStatus.deleteBugError =
        "error";
    },
  },
});

export default BugSlice.reducer;
