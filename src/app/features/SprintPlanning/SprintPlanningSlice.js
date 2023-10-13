import { createSlice } from "@reduxjs/toolkit";
import {
  createNewAttachmentThunk,
  createNewCommentThunk,
  createNewMilestoneThunk,
  createNewSprintThunk,
  createNewTaskThunk,
  moveTaskToMilestoneThunk,
  moveMultipleTasksToMilestoneThunk,
  deleteAttachmentThunk,
  deleteCommentThunk,
  deleteMilestoneThunk,
  deleteSprintThunk,
  deleteTaskThunk,
  getAttachmentInTaskByIdThunk,
  getAttachmentsInTaskThunk,
  getCommentInTaskByIdThunk,
  getCommentsInTaskThunk,
  getMilestonebyIdThunk,
  getMilestonebyStatusThunk,
  getMilestonesOfSprintThunk,
  getSprintByIdThunk,
  getSprintByStatusThunk,
  getSprintInfoThunk,
  getTaskByIdThunk,
  getTaskInMilestoneByIdThunk,
  getTasksInMilestoneByStatusThunk,
  getTasksInMilestoneThunk,
  updateAttachmentThunk,
  updateCommentThunk,
  updateMilestoneThunk,
  updateSprintThunk,
  updateTaskThunk,
  getSprintUsersThunk,
  moveMilestoneAcrossSprints,
  createSubTaskThunk,
  deleteSubTaskThunk,
} from "./AsyncThunks";

const initialState = {
  sprintData: null,
  sprintUsers: [],
  currentSprintData: null,
  currentSprintId: null,
  currentMilestoneData: null,
  currentTaskData: null,
  actionStatus: {},
};

const SprintplanningSlice = createSlice({
  name: "sprintplanning",
  initialState,
  reducers: {
    setCurrentSprintId: (state, action) => {
      const { sprintId } = action.payload;
      state.currentSprintId = sprintId;
    },
    setCurrentMilestone: (state, action) => {
      const { milestone } = action.payload;
      state.currentMilestoneData = milestone;
    },
  },
  extraReducers: {
    [getSprintInfoThunk.pending]: (state) => {
      state.actionStatus.getSprintInfo = "loading";
      state.actionStatus.getSprintInfoError = null;
    },
    [getSprintInfoThunk.fulfilled]: (state, action) => {
      state.sprintData = action.payload.data;
      state.actionStatus.getSprintInfo = "fulfilled";
      state.actionStatus.getSprintInfoError = null;
    },
    [getSprintInfoThunk.rejected]: (state, action) => {
      console.log("getSprintInfo error: ", action.payload);
      state.actionStatus.getSprintInfo = "error";
      state.actionStatus.getSprintInfoError = "error";
    },
    [getSprintByStatusThunk.pending]: (state) => {
      state.actionStatus.getSprintInfo = "loading";
      state.actionStatus.getSprintInfoError = null;
    },
    [getSprintByStatusThunk.fulfilled]: (state, action) => {
      state.sprintData = action.payload.data;
      state.currentSprintData = null;
      state.currentSprintId = null;
      state.currentMilestoneData = null;
      state.actionStatus.getSprintInfo = "fulfilled";
      state.actionStatus.getSprintInfoError = null;
    },
    [getSprintByStatusThunk.rejected]: (state) => {
      state.actionStatus.getSprintInfo = state.actionStatus.getSprintInfoError =
        "error";
    },
    [getSprintByIdThunk.pending]: (state) => {
      state.actionStatus.getSprintById = "loading";
      state.actionStatus.getSprintByIdError = null;
    },
    [getSprintByIdThunk.fulfilled]: (state, action) => {
      const sprintData = action.payload.data[0];
      state.currentSprintData = sprintData;
      state.sprintData = state.sprintData.map((sprint) =>
        sprint._id === sprintData._id ? sprintData : sprint
      );
      if (state.currentMilestoneData) {
        const currentMilestone = state.currentMilestoneData;
        state.currentMilestoneData = sprintData.milestones.find(
          (milestone) => milestone._id === currentMilestone._id
        );
      } else {
        state.currentMilestoneData = null;
      }
      state.actionStatus.getSprintById = "fulfilled";
      state.actionStatus.getSprintByIdError = null;
    },
    [getSprintByIdThunk.rejected]: (state, action) => {
      console.log("getSprintById error: ", action.payload);
      state.actionStatus.getSprintById = "error";
      state.actionStatus.getSprintByIdError = "error";
    },
    [createNewSprintThunk.pending]: (state) => {
      state.actionStatus.createNewSprint = "loading";
      state.actionStatus.createNewSprintError = null;
    },
    [createNewSprintThunk.fulfilled]: (state, action) => {
      state.actionStatus.createNewSprint = "fulfilled";
      state.actionStatus.createNewSprintError = null;
    },
    [createNewSprintThunk.rejected]: (state, action) => {
      console.log("createNewSprint error: ", action.payload);
      state.actionStatus.createNewSprint = "error";
      state.actionStatus.createNewSprintError = "error";
    },
    [updateSprintThunk.pending]: (state) => {
      state.actionStatus.updateSprint = "loading";
      state.actionStatus.updateSprintError = null;
    },
    [updateSprintThunk.fulfilled]: (state) => {
      state.actionStatus.updateSprint = "fulfilled";
      state.actionStatus.updateSprintError = null;
    },
    [updateSprintThunk.rejected]: (state) => {
      state.actionStatus.updateSprint = "error";
      state.actionStatus.updateSprintError = "error";
    },
    [createNewMilestoneThunk.pending]: (state) => {
      state.actionStatus.createNewMilestone = "loading";
      state.actionStatus.createNewMilestoneError = null;
    },
    [createNewMilestoneThunk.fulfilled]: (state, action) => {
      state.actionStatus.createNewMilestone = "fulfilled";
      state.actionStatus.createNewMilestoneError = null;
    },
    [createNewMilestoneThunk.rejected]: (state) => {
      state.actionStatus.createNewMilestone = "error";
      state.actionStatus.createNewMilestoneError = "error";
    },
    [updateMilestoneThunk.pending]: (state) => {
      state.actionStatus.updateMilestone = "loading";
      state.actionStatus.updateMilestoneError = null;
    },
    [updateMilestoneThunk.fulfilled]: (state) => {
      state.actionStatus.updateMilestone = "fulfilled";
      state.actionStatus.updateMilestoneError = null;
    },
    [updateMilestoneThunk.rejected]: (state) => {
      state.actionStatus.updateMilestone = "error";
      state.actionStatus.updateMilestoneError = "error";
    },
    [createNewTaskThunk.pending]: (state) => {
      state.actionStatus.createNewTask = "loading";
      state.actionStatus.createNewTaskError = null;
    },
    [createNewTaskThunk.fulfilled]: (state) => {
      state.actionStatus.createNewTask = "fulfilled";
      state.actionStatus.createNewTaskError = null;
    },
    [createNewTaskThunk.rejected]: (state) => {
      state.actionStatus.createNewTask = "error";
      state.actionStatus.createNewTaskError = "error";
    },
    [createSubTaskThunk.pending]: (state) => {
      state.actionStatus.createSubTask = "loading";
      state.actionStatus.createSubTaskError = null;
    },
    [createSubTaskThunk.fulfilled]: (state) => {
      state.actionStatus.createSubTask = "fulfilled";
      state.actionStatus.createSubTaskError = null;
    },
    [createSubTaskThunk.rejected]: (state) => {
      state.actionStatus.createSubTask = "error";
      state.actionStatus.createSubTaskError = "error";
    },
    [moveTaskToMilestoneThunk.pending]: (state) => {
      state.actionStatus.moveTask= "loading";
      state.actionStatus.moveTaskError = null;
    },
    [moveTaskToMilestoneThunk.fulfilled]: (state) => {
      state.actionStatus.moveTask = "fulfilled";
      state.actionStatus.moveTaskError = null;
    },
    [moveTaskToMilestoneThunk.rejected]: (state) => {
      state.actionStatus.moveTask = "error";
      state.actionStatus.moveTaskError = "error";
    },
    [moveMilestoneAcrossSprints.pending]: (state) => {
      state.actionStatus.moveMilestoneAcrossSprints= "loading";
      state.actionStatus.moveMilestoneAcrossSprintsError = null;
    },
    [moveMilestoneAcrossSprints.fulfilled]: (state) => {
      state.actionStatus.moveMilestoneAcrossSprints = "fulfilled";
      state.actionStatus.moveMilestoneAcrossSprintsError = null;
    },
    [moveMilestoneAcrossSprints.rejected]: (state) => {
      state.actionStatus.moveMilestoneAcrossSprints = "error";
      state.actionStatus.moveMilestoneAcrossSprintsError = "error";
    },
    [moveMultipleTasksToMilestoneThunk.pending]: (state) => {
      state.actionStatus.moveTasks= "loading";
      state.actionStatus.moveTasksError = null;
    },
    [moveMultipleTasksToMilestoneThunk.fulfilled]: (state) => {
      state.actionStatus.moveTasks = "fulfilled";
      state.actionStatus.moveTasksError = null;
    },
    [moveMultipleTasksToMilestoneThunk.rejected]: (state) => {
      state.actionStatus.moveTasks = "error";
      state.actionStatus.moveTasksError = "error";
    },
    [getMilestonesOfSprintThunk.pending]: (state) => {
      state.actionStatus.getMilestone = "loading";
      state.actionStatus.getMilestoneError = null;
    },
    [getMilestonesOfSprintThunk.fulfilled]: (state, action) => {
      const { sprintId, data } = action.payload;
      state.currentSprintData = {
        ...state.currentSprintData,
        milestones: data.data.milestones,
      };
      state.actionStatus.getMilestone = "fulfilled";
      state.actionStatus.getMilestoneError = null;
    },
    [getMilestonesOfSprintThunk.rejected]: (state) => {
      state.actionStatus.getMilestone = state.actionStatus.getMilestoneError =
        "error";
    },
    [getMilestonebyStatusThunk.pending]: (state) => {
      state.actionStatus.getMilestone = "loading";
      state.actionStatus.getMilestoneError = null;
    },
    [getMilestonebyStatusThunk.fulfilled]: (state, action) => {
      const { sprintId, data } = action.payload;
      state.currentSprintData = {
        ...state.currentSprintData,
        milestones: data.data,
      };
      state.currentMilestoneData = null;
      state.actionStatus.getMilestone = "fulfilled";
      state.actionStatus.getMilestoneError = null;
    },
    [getMilestonebyStatusThunk.rejected]: (state) => {
      state.actionStatus.getMilestone = state.actionStatus.getMilestoneError =
        "error";
    },
    [getMilestonebyIdThunk.pending]: (state) => {
      state.actionStatus.getMilestoneById = "loading";
      state.actionStatus.getMilestoneByIdError = null;
    },
    [getMilestonebyIdThunk.fulfilled]: (state, action) => {
      const { data, sprintId, milestoneId } = action.payload
      state.currentMilestoneData = data.data;
      // update the milestone data inside the currentSprintData too
      const _currentSprintData = JSON.parse(JSON.stringify(state.currentSprintData))

      let _milestones = JSON.parse(JSON.stringify(_currentSprintData.milestones))

      _milestones = _milestones.map(milestone => milestone._id === milestoneId ? data.data : milestone )

      _currentSprintData.milestones = _milestones

      state.currentSprintData = _currentSprintData

      state.actionStatus.getMilestoneById = "fulfilled";
      state.actionStatus.getMilestoneByIdError = null;
    },
    [getMilestonebyIdThunk.pending]: (state) => {
      state.actionStatus.getMilestoneById = "error";
      state.actionStatus.getMilestoneByIdError = "error";
    },
    [updateTaskThunk.pending]: (state) => {
      state.actionStatus.updateTask = "loading";
      state.actionStatus.updateTaskError = null;
    },
    [updateTaskThunk.fulfilled]: (state) => {
      state.actionStatus.updateTask = "fulfilled";
      state.actionStatus.updateTaskError = null;
    },
    [updateTaskThunk.rejected]: (state) => {
      state.actionStatus.updateTask = "error";
      state.actionStatus.updateTaskError = "error";
    },
    [getTaskByIdThunk.pending]: (state) => {
      state.actionStatus.getTaskById = "loading";
      state.actionStatus.getTaskByIdError = null;
    },
    [getTaskByIdThunk.fulfilled]: (state, action) => {
      // here check if searchParam has subTaskId, then set the subTaskId as current Task
     
      const {data, subTaskId} = action.payload;
      if(subTaskId){
        const subTaskData = data?.data?.subTasks?.find(_data => _data._id === subTaskId)
        state.currentTaskData = subTaskData
      }else{
        state.currentTaskData = data.data;
      }
      state.actionStatus.getTaskById = "fulfilled";
        state.actionStatus.getTaskByIdError = null;
    },
    [getTaskByIdThunk.rejected]: (state) => {
      state.actionStatus.getTaskById = "error";
      state.actionStatus.getTaskByIdError = "error";
    },

    [deleteSprintThunk.pending]: (state) => {
      state.actionStatus.deleteSprint = "loading";
      state.actionStatus.deleteSprintError = null;
    },
    [deleteSprintThunk.fulfilled]: (state) => {
      state.currentSprintData = null;
      state.currentSprintId = null;
      state.currentMilestoneData = null;
      state.currentTaskData = null;
      state.actionStatus.deleteSprint = "fulfilled";
      state.actionStatus.deleteSprintError = null;
    },
    [deleteSprintThunk.rejected]: (state) => {
      state.actionStatus.deleteSprint = "error";
      state.actionStatus.deleteSprintError = "error";
    },
    [deleteMilestoneThunk.pending]: (state) => {
      state.actionStatus.deleteMilestone = "loading";
      state.actionStatus.deleteMilestoneError = null;
    },
    [deleteMilestoneThunk.fulfilled]: (state, action) => {
      const { data, milestoneId } = action.payload;
      if (milestoneId === state.currentMilestoneData._id) {
        state.currentMilestoneData = null;
      }
      console.log("deleted milestone id: ", milestoneId);
      state.actionStatus.deleteMilestone = "fulfilled";
      state.actionStatus.deleteMilestoneError = null;
    },
    [deleteMilestoneThunk.rejected]: (state) => {
      state.actionStatus.deleteMilestone = "error";
      state.actionStatus.deleteMilestoneError = "error";
    },
    [deleteTaskThunk.pending]: (state) => {
      state.actionStatus.deleteTask = "loading";
      state.actionStatus.deleteTaskError = null;
    },
    [deleteTaskThunk.fulfilled]: (state, action) => {
      state.actionStatus.deleteTask = "fulfilled";
      state.actionStatus.deleteTaskError = null;
    },
    [deleteTaskThunk.rejected]: (state) => {
      state.actionStatus.deleteTask = "error";
      state.actionStatus.deleteTaskError = "error";
    },
    [deleteSubTaskThunk.pending]: (state) => {
      state.actionStatus.deleteSubTask = "loading";
      state.actionStatus.deleteSubTaskError = null;
    },
    [deleteSubTaskThunk.fulfilled]: (state, action) => {
      state.actionStatus.deleteSubTask = "fulfilled";
      state.actionStatus.deleteSubTaskError = null;
    },
    [deleteSubTaskThunk.rejected]: (state) => {
      state.actionStatus.deleteSubTask = "error";
      state.actionStatus.deleteSubTaskError = "error";
    },
    [createNewCommentThunk.pending]: (state) => {
      state.actionStatus.createNewComment = "loading";
      state.createNewCommentError = null;
    },
    [createNewCommentThunk.fulfilled]: (state) => {
      state.actionStatus.createNewComment = "fulfilled";
      state.actionStatus.createNewCommentError = null;
    },
    [createNewCommentThunk.rejected]: (state) => {
      state.actionStatus.createNewComment = "error";
      state.actionStatus.createNewCommentError = "error";
    },
    [getCommentsInTaskThunk.pending]: (state) => {
      state.actionStatus.getCommentsInTask = "loading";
      state.actionStatus.getCommentsInTaskError = null;
    },
    [getCommentsInTaskThunk.fulfilled]: (state, action) => {
      const { taskId, data } = action.payload;
      const updatedTask = state.currentMilestoneData.tasks.map((task) => {
        if (task._id === taskId) {
          return {
            ...task,
            comments: data.data.comments,
          };
        } else {
          return task;
        }
      });

      state.currentMilestoneData = {
        ...state.currentMilestoneData,
        tasks: updatedTask,
      };
      state.actionStatus.getCommentsInTask = "fulfilled";
      state.actionStatus.getCommentsInTaskError = null;
    },
    [getCommentsInTaskThunk.rejected]: (state) => {
      state.actionStatus.getCommentsInTask = "error";
      state.actionStatus.getCommentsInTaskError = "error";
    },
    [deleteCommentThunk.pending]: (state) => {
      state.actionStatus.deleteComment = "loading";
      state.actionStatus.deleteCommentError = null;
    },
    [deleteCommentThunk.fulfilled]: (state, action) => {
      const { taskId, commentId } = action.payload;

      const updatedTask = state.currentMilestoneData.tasks.map((task) => {
        if (task._id === taskId) {
          return {
            ...task,
            comments: task.comments.filter(
              (comment) => comment._id !== commentId
            ),
          };
        } else {
          return task;
        }
      });

      state.currentMilestoneData = {
        ...state.currentMilestoneData,
        tasks: updatedTask,
      };
      state.actionStatus.deleteComment = "fulfilled";
      state.actionStatus.deleteCommentError = null;
    },
    [deleteCommentThunk.rejected]: (state) => {
      state.actionStatus.deleteComment = "error";
      state.actionStatus.deleteCommentError = "error";
    },
    [updateCommentThunk.pending]: (state) => {
      state.actionStatus.updateComment = "loading";
      state.actionStatus.updateCommentError = null;
    },
    [updateCommentThunk.fulfilled]: (state, action) => {
      const { taskId, commentId, commentBody } = action.payload;

      const updatedTask = state.currentMilestoneData.tasks.map((task) => {
        if (task._id === taskId) {
          return {
            ...task,
            comments: task.comments.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  message: commentBody.message,
                };
              } else {
                return comment;
              }
            }),
          };
        } else {
          return task;
        }
      });

      state.currentMilestoneData = {
        ...state.currentMilestoneData,
        tasks: updatedTask,
      };

      state.actionStatus.updateComment = "fulfilled";
      state.actionStatus.updateCommentError = null;
    },
    [updateCommentThunk.rejected]: (state) => {
      state.actionStatus.updateComment = "error";
      state.actionStatus.updateCommentError = "error";
    },
    [createNewAttachmentThunk.pending]: (state) => {
      state.createNewAttachment = "loading";
      state.createNewAttachmentError = null;
    },
    [createNewAttachmentThunk.fulfilled]: (state) => {
      state.createNewAttachment = "fulfilled";
      state.createNewAttachmentError = null;
    },
    [createNewAttachmentThunk.rejected]: (state) => {
      state.createNewAttachment = "error";
      state.createNewAttachmentError = "error";
    },
    [getSprintUsersThunk.pending]: (state) => {
      state.getSprintUsers = "loading";
      state.getSprintUsersError = null;
    },
    [getSprintUsersThunk.fulfilled]: (state, action) => {
      state.sprintUsers = action.payload.data;
      state.getSprintUsers = "fulfilled";
      state.getSprintUsers = null;
    },
    [getSprintUsersThunk.rejected]: (state) => {
      state.getSprintUsers = "error";
      state.getSprintUsersError = "error";
    },
  },
});
export const { setCurrentSprintId, setCurrentMilestone } =
  SprintplanningSlice.actions;
export default SprintplanningSlice.reducer;
