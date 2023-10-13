import { createAsyncThunk } from "@reduxjs/toolkit";
import { SprintPlanningAPI } from "../../../../api/apiConfig";

export const getSprintInfoThunk = createAsyncThunk(
  "sprintplanning/getSprintInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getSprintInfo();
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getSprintByStatusThunk = createAsyncThunk(
  "sprintplanning/getSprintByStatus",
  async ({ status }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getSprintByStatus({
        status,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getSprintByIdThunk = createAsyncThunk(
  "sprintplanning/getSprintById",
  async ({ sprintId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getSprintById({ sprintId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMilestonesOfSprintThunk = createAsyncThunk(
  "sprintplanning/getMilestonesOfSprint",
  async ({ sprintId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getMilestonesOfSprint({
        sprintId,
      });
      return {
        data: response.data,
        sprintId
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMilestonebyStatusThunk = createAsyncThunk(
  "sprintplanning/getMilestonebyStatus",
  async ({ sprintId, status }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getMilestonebyStatus({
        sprintId,
        status,
      });

      return {
        sprintId,
        data: response.data
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMilestonebyIdThunk = createAsyncThunk(
  "sprintplanning/getMilestonebyId",
  async ({ sprintId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getMilestonebyId({
        sprintId,
        milestoneId,
      });

      return {
        data: response.data,
        sprintId,
        milestoneId
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const getTasksInMilestoneThunk = createAsyncThunk(
  "sprintplanning/getTasksInMilestone",
  async ({ sprintId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getTasksInMilestone({
        milestoneId,
        sprintId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTaskByIdThunk = createAsyncThunk(
  "sprintplanning/getTaskById",
  async ({ milestoneId, taskId, sprintId, subTaskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getTaskById({
        taskId,
        milestoneId,
        sprintId
      });
      console.log("taskbyid",response.data)
      return {data: response.data, subTaskId};
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTasksInMilestoneByStatusThunk = createAsyncThunk(
  "sprintplanning/getTasksInMilestoneByStatus",
  async ({ sprintId, milestoneId, status }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getTasksInMilestoneByStatus({
        milestoneId,
        sprintId,
        status,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTaskInMilestoneByIdThunk = createAsyncThunk(
  "sprintplanning/getTaskInMilestoneById",
  async ({ sprintId, milestoneId, taskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getTaskInMilestoneById({
        milestoneId,
        sprintId,
        taskId,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCommentsInTaskThunk = createAsyncThunk(
  "sprintplaning/getCommentsInTask",
  async ({ sprintId, milestoneId, taskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getCommentsInTask({
        milestoneId,
        sprintId,
        taskId,
      });
      return {
        data: response.data,
        taskId,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCommentInTaskByIdThunk = createAsyncThunk(
  "sprintplanning/getCommentInTaskById",
  async ({ sprintId, milestoneId, taskId, commentId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getCommentInTaskById({
        commentId,
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAttachmentsInTaskThunk = createAsyncThunk(
  "sprintplanning/getAttachmentsInTask",
  async ({ sprintId, milestoneId, taskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getAttachmentsInTask({
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAttachmentInTaskByIdThunk = createAsyncThunk(
  "sprintplanning/getAttachmentInTaskById",
  async (
    { sprintId, milestoneId, taskId, attachmentId },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.GET.getAttachmentInTaskById({
        attachmentId,
        milestoneId,
        sprintId,
        taskId,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createNewSprintThunk = createAsyncThunk(
  "sprintplanning/createNewSprint",
  async ({ sprintBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.createNewSprint({
        sprintBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createNewMilestoneThunk = createAsyncThunk(
  "sprintplanning/createNewMilestone",
  async ({ sprintId, milestoneBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.createNewMilestone({
        milestoneBody,
        sprintId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createNewTaskThunk = createAsyncThunk(
  "sprintplanning/createNewTask",
  async ({ sprintId, milestoneId, taskBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.createNewTask({
        milestoneId,
        sprintId,
        taskBody,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createSubTaskThunk = createAsyncThunk(
  "sprintplanning/createSubTask",
  async ({ sprintId, milestoneId, taskId, taskBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.createSubTask({
        sprintId,
        milestoneId,
        taskId,
        taskBody
      })

      return response.data
    }catch(err){
      return rejectWithValue(err)
    }
  }
)

export const moveTaskToMilestoneThunk = createAsyncThunk(
  "sprintplanning/createNewTask",
  async ({ sprintId, milestoneId, taskId, selectedMilestoneId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.moveTaskToMilestone({
        milestoneId,
        sprintId,
        taskId,
        selectedMilestoneId
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const moveMilestoneAcrossSprints = createAsyncThunk(
  "sprintplanning/moveMilestoneAcrossSprints",
  async ({ sprintId, milestoneId, selectedSprintId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.PATCH.moveMilestoneAcrossSprint({
        sprintId,
        milestoneId,
        selectedSprintId
      })

      return response.data
    }catch(err){
      return rejectWithValue(err)
    }
  }
)

export const moveMultipleTasksToMilestoneThunk = createAsyncThunk(
  "sprintplanning/createNewTask",
  async ({ sprintId, milestoneId, selectedMilestoneId, taskIdList }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.POST.moveMultipleTasksToMilestone({
        milestoneId,
        sprintId,
        selectedMilestoneId,
        taskIdList
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createNewCommentThunk = createAsyncThunk(
  "sprintplanning/createNewComment",
  async (
    { sprintId, milestoneId, taskId, commentBody },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.POST.createNewComment({
        commentBody,
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createNewAttachmentThunk = createAsyncThunk(
  "sprintplanning/createNewAttachment",
  async (
    { sprintId, milestoneId, taskId, attachmentBody },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.POST.createNewAttachment({
        attachmentBody,
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateSprintThunk = createAsyncThunk(
  "sprintplannning/updateSprint",
  async ({ sprintId, sprintBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.PUT.updateSprint({
        sprintBody,
        sprintId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateMilestoneThunk = createAsyncThunk(
  "sprintplanning/updateMilestone",
  async ({ sprintId, milestoneId, milestoneBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.PUT.updateMilestone({
        milestoneBody,
        milestoneId,
        sprintId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "sprintplanning/updateTask",
  async ({ sprintId, milestoneId, taskId, taskBody }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.PUT.updateTask({
        milestoneId,
        sprintId,
        taskBody,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "sprintplanning/updateComment",
  async (
    { sprintId, milestoneId, taskId, commentId, commentBody },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.PUT.updateComment({
        commentBody,
        commentId,
        milestoneId,
        sprintId,
        taskId,
      });

      return {
        data: response.data,
        taskId,
        commentId,
        commentBody,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAttachmentThunk = createAsyncThunk(
  "sprintplanning/updateAttachment",
  async (
    { sprintId, milestoneId, taskId, attachmentId, attachmentBody },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.PUT.updateAttachment({
        attachmentBody,
        attachmentId,
        milestoneId,
        sprintId,
        taskId,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteSprintThunk = createAsyncThunk(
  "sprintplanning/deleteSprint",
  async ({ sprintId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteSprint({
        sprintId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteMilestoneThunk = createAsyncThunk(
  "sprintplanning/deleteMilestone",
  async ({ sprintId, milestoneId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteMilestone({
        milestoneId,
        sprintId,
      });
      return {
        data: response.data,
        milestoneId,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  "sprintplanning/deleteTask",
  async ({ sprintId, milestoneId, taskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteTask({
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteSubTaskThunk = createAsyncThunk(
  "sprintplanning/deleteSubTaskThunk",
  async ({ sprintId, milestoneId, taskId, subTaskId }, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteSubTask({
        milestoneId,
        sprintId,
        taskId,
        subTaskId
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "sprintplanning/deleteComment",
  async (
    { sprintId, milestoneId, taskId, commentId, deletedByEmail },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteComment({
        commentId,
        milestoneId,
        sprintId,
        taskId,
        deletedByEmail,
      });
      return { data: response.data, taskId, commentId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteAttachmentThunk = createAsyncThunk(
  "sprintplanning/deleteAttachment",
  async (
    { sprintId, milestoneId, taskId, attachmentId },
    { rejectWithValue }
  ) => {
    try {
      const response = await SprintPlanningAPI.DELETE.deleteAttachment({
        attachmentId,
        milestoneId,
        sprintId,
        taskId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getSprintUsersThunk = createAsyncThunk(
  "sprintplanning/getSprintUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await SprintPlanningAPI.GET.getSprintUsers();
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
