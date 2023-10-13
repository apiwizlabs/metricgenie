import axios from "axios";
import { logout } from "../utils";
import { toast } from "react-toastify";

const config = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
};

let headers = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

let securedHeaders = {
  ...headers,
  authorization: `Bearer ${localStorage.getItem("token")}`,
};

let fileUploadHeaders = {
  ...securedHeaders,
  "Content-Type": "multipart/form-data",
};

const errorCalback = (error) => {
  const { response } = error;
  if (response.status === 403) {
    toast.error(`${response.data.message}, Logging out`);
    setTimeout(() => {
      logout();
    }, 1600);
    return
  }
  return response
};

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  headers: securedHeaders,
});

axiosInstance.interceptors.response.use((response) => response, errorCalback);

const sprintAxiosInstance = axios.create({
  baseURL: config.baseURL + "v1/sprints",
  headers: securedHeaders,
});

sprintAxiosInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

const backlogAxiosInstance = axios.create({
  baseURL: config.baseURL + "v1/backlog",
  headers: securedHeaders,
});

backlogAxiosInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

const bugsAxiosInstance = axios.create({
  baseURL: config.baseURL + "v1/bugs",
  headers: securedHeaders,
});

bugsAxiosInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

const releaseAxiosInstance = axios.create({
  baseURL: config.baseURL + "v1/releases",
  headers: securedHeaders,
});

releaseAxiosInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

const uploadFileInstance = axios.create({
  baseURL: config.baseURL + "v1",
  headers: fileUploadHeaders,
});

uploadFileInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

const downloadFileInstance = axios.create({
  baseURL: config.baseURL + "v1",
  headers: securedHeaders,
});

downloadFileInstance.interceptors.response.use(
  (response) => response,
  errorCalback
);

export const EngineeringAPI = {
  loginUser(data) {
    return axiosInstance.post("/login", {
      ...data,
    });
  },
  getTotalWorkspaceCount() {
    return axiosInstance.get("workspace/total");
  },
  getAllWorkspaces() {
    return axiosInstance.get("workspace");
  },
  getAllActiveWorkspaces() {
    return axiosInstance.get("workspace/active");
  },
  getAllInactiveworkspaces() {
    return axiosInstance.get("workspace/inactive");
  },
  getMonthlyWorkspaceGrowth() {
    return axiosInstance.get("workspace/growth");
  },
  getAllUsers() {
    return axiosInstance.get("users");
  },
  getTotalUsersCount() {
    return axiosInstance.get("users/total");
  },
  getMonthlyUsersGrowth() {
    return axiosInstance.get("users/growth");
  },
  getOverallUserWorkspaceActivity({ year }) {
    return axiosInstance.get(`activity/overall/workspace-users/${year}`);
  },
  getUsersByWorkspace({ workspace }) {
    return axiosInstance.get(`users/workspace/${workspace}`);
  },
  getPlanInfoOfWorkspace({ workspace }) {
    return axiosInstance.get(`workspace/planinfo/${workspace}`);
  },
  getWorkspaceSeatInfo({ workspace }) {
    return axiosInstance.get(`workspace/seatsinfo/${workspace}`);
  },
  getApiwizDownloadCount() {
    return axiosInstance.get("downloads/apiwiz");
  },
  getSwagger2ActivityByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/swagger`);
  },
  getSwagger3ActivityByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/swagger3`);
  },
  getTestsuiteActivityByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/testsuite`);
  },
  getMonitoringActivityByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/monitoring`);
  },
  getMocksActivityByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/mocks`);
  },
  getApigeeCountByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/apigee`);
  },
  getApigeeXCountByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/apigeex`);
  },
  getKongCountByWorkspace({ workspace }) {
    return axiosInstance.get(`activity/workspace/${workspace}/kong`);
  },
};

export const SprintPlanningAPI = {
  GET: {
    getSprintInfo() {
      return sprintAxiosInstance.get("/");
    },
    getSprintByStatus({ status }) {
      return sprintAxiosInstance.get(`/?status=${status}`);
    },
    getSprintById({ sprintId }) {
      return sprintAxiosInstance.get(`/${sprintId}?expand=true`);
    },
    getMilestonesOfSprint({ sprintId }) {
      return sprintAxiosInstance.get(`/${sprintId}/milestones?expand=true`);
    },
    getMilestonebyStatus({ sprintId, status }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones?status=${status}`
      );
    },
    getMilestonebyId({ sprintId, milestoneId }) {
      return sprintAxiosInstance.get(`/${sprintId}/milestones/${milestoneId}`);
    },
    getTasksInMilestone({ sprintId, milestoneId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks`
      );
    },
    getTaskById({sprintId, milestoneId, taskId}){
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}`
      )
    },
    getTasksInMilestoneByStatus({ sprintId, milestoneId, status }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks?status=${status}`
      );
    },
    getTaskInMilestoneById({ sprintId, milestoneId, taskId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}`
      );
    },
    getCommentsInTask({ sprintId, milestoneId, taskId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/comments`
      );
    },
    getCommentInTaskById({ sprintId, milestoneId, taskId, commentId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/comments/${commentId}`
      );
    },
    getAttachmentsInTask({ sprintId, milestoneId, taskId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/attachments`
      );
    },
    getAttachmentInTaskById({ sprintId, milestoneId, taskId, attachmentId }) {
      return sprintAxiosInstance.get(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/attachments/${attachmentId}`
      );
    },

    getSprintUsers() {
      return axiosInstance.get("/v1/sprintusers");
    },

    downloadImage({ fileKey }) {
      return downloadFileInstance.get(`/view/images/${fileKey}`, {
        responseType: "blob",
      });
    },
  },
  POST: {
    createNewSprint({ sprintBody }) {
      return sprintAxiosInstance.post("/", {
        ...sprintBody,
      });
    },
    createNewMilestone({ sprintId, milestoneBody }) {
      return sprintAxiosInstance.post(`/${sprintId}/milestones`, {
        ...milestoneBody,
      });
    },

    createNewTask({ sprintId, milestoneId, taskBody }) {
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks`,
        {
          ...taskBody,
        }
      );
    },
    createSubTask({ sprintId, milestoneId, taskId, taskBody }){
      return sprintAxiosInstance.post(`/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/add-subtask`,
      {
        ...taskBody
      })
    },
    moveTaskTobacklog({ sprintId, milestoneId, taskId }) {
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/move-to-backlog`
      );
    },
    moveTaskToMilestone({ sprintId, milestoneId, taskId, selectedMilestoneId }) {
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/move-to-milestone/${selectedMilestoneId}`
      );
    },
    moveMultipleTasksToMilestone({ sprintId, milestoneId, selectedMilestoneId, taskIdList }) {
      console.log(taskIdList, "task iddd lissst gegegge")
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks/move-multiple-tasks/${selectedMilestoneId}`,{
          taskIdList: taskIdList
        }
      );
    },
    createNewComment({ sprintId, milestoneId, taskId, commentBody }) {
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/comments`,
        {
          ...commentBody,
        }
      );
    },

    createNewAttachment({ sprintId, milestoneId, taskId, attachmentBody }) {
      return sprintAxiosInstance.post(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/attachments`,
        {
          ...attachmentBody,
        }
      );
    },

    uploadFile({ fileObj }) {
      const formData = new FormData();
      formData.append("file", fileObj, fileObj.name);
      return uploadFileInstance.post("/upload/single", formData);
    },
  },
  PUT: {
    updateSprint({ sprintId, sprintBody }) {
      return sprintAxiosInstance.put(`/${sprintId}`, {
        ...sprintBody,
      });
    },
    updateMilestone({ sprintId, milestoneId, milestoneBody }) {
      return sprintAxiosInstance.put(`/${sprintId}/milestones/${milestoneId}`, {
        ...milestoneBody,
      });
    },

    updateTask({ sprintId, milestoneId, taskId, taskBody }) {
      return sprintAxiosInstance.put(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}`,
        {
          ...taskBody,
        }
      );
    },

    updateComment({ sprintId, milestoneId, taskId, commentId, commentBody }) {
      return sprintAxiosInstance.put(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/comments/${commentId}`,
        {
          ...commentBody,
        }
      );
    },

    updateAttachment({
      sprintId,
      milestoneId,
      taskId,
      attachmentId,
      attachmentBody,
    }) {
      return sprintAxiosInstance.put(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/attachments/${attachmentId}`,
        {
          ...attachmentBody,
        }
      );
    },
  },
  DELETE: {
    deleteSprint({ sprintId }) {
      return sprintAxiosInstance.delete(`/${sprintId}`);
    },
    deleteMilestone({ sprintId, milestoneId }) {
      return sprintAxiosInstance.delete(
        `/${sprintId}/milestones/${milestoneId}`
      );
    },

    deleteTask({ sprintId, milestoneId, taskId }) {
      return sprintAxiosInstance.delete(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}`
      );
    },

    deleteSubTask({ sprintId, milestoneId, taskId, subTaskId }){
      return sprintAxiosInstance.delete(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/sub-tasks/${subTaskId}`
      )
    },

    deleteComment({
      sprintId,
      milestoneId,
      taskId,
      commentId,
      deletedByEmail,
    }) {
      return sprintAxiosInstance.delete(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/comments/${commentId}`,
        {
          data: { deletedByEmail },
        }
      );
    },

    deleteAttachment({ sprintId, milestoneId, taskId, attachmentId }) {
      return sprintAxiosInstance.delete(
        `/${sprintId}/milestones/${milestoneId}/tasks/${taskId}/attachments/${attachmentId}`
      );
    },
  },
  PATCH: {
    moveMilestoneAcrossSprint({ sprintId, milestoneId, selectedSprintId }){
      return sprintAxiosInstance.patch(`/${sprintId}/milestones/${milestoneId}/move-to-sprint/${selectedSprintId}`)
    }
  }
};

export const BacklogTrackerAPI = {
  GET: {
    getAllBacklogs() {
      return backlogAxiosInstance.get("/");
    },
    getBacklogById({ backlogId }) {
      return backlogAxiosInstance.get(`/${backlogId}`);
    },
    getCommentsInBacklog({ backlogId }) {
      return backlogAxiosInstance.get(`/${backlogId}/comments`);
    },
    getBacklogCommentById({ backlogId, commentId }) {
      return backlogAxiosInstance.get(`/${backlogId}/comments/${commentId}`);
    },

    getBacklogAttachments({ backlogId }) {
      return backlogAxiosInstance.get(`/${backlogId}/attachments`);
    },
    getBacklogAttachmentById({ backlogId, attachmentId }) {
      return backlogAxiosInstance.get(
        `/${backlogId}/attachments/${attachmentId}`
      );
    },
  },
  POST: {
    createBacklog({ backlogBody }) {
      return backlogAxiosInstance.post("/", {
        ...backlogBody,
      });
    },
    createNewComment({ backlogId, commentBody }) {
      return backlogAxiosInstance.post(`/${backlogId}/comments`, {
        ...commentBody,
      });
    },
    createNewAttachment({ backlogId, attachmentBody }) {
      return backlogAxiosInstance.post(`/${backlogId}/attachments`, {
        ...attachmentBody,
      });
    },
  },
  PUT: {
    updateBacklog({ backlogId, backlogBody }) {
      return backlogAxiosInstance.put(`/${backlogId}`, {
        ...backlogBody,
      });
    },
    updateComment({ backlogId, commentId, commentBody }) {
      return backlogAxiosInstance.put(`/${backlogId}/comments/${commentId}`, {
        ...commentBody,
      });
    },
    updateAttachment({ backlogId, attachmentId, attachmentBody }) {
      return backlogAxiosInstance.put(
        `/${backlogId}/attachments/${attachmentId}`,
        {
          ...attachmentBody,
        }
      );
    },
  },
  DELETE: {
    deleteBacklog({ backlogId }) {
      return backlogAxiosInstance.delete(`/${backlogId}`);
    },
    deleteComment({ backlogId, commentId, deletedByEmail }) {
      return backlogAxiosInstance.delete(
        `/${backlogId}/comments/${commentId}`,
        {
          data: { deletedByEmail },
        }
      );
    },
    deleteAttachment({ backlogId, attachmentId }) {
      return backlogAxiosInstance.delete(
        `/${backlogId}/attachments/${attachmentId}`
      );
    },
  },
};

export const BugTrackerAPI = {
  GET: {
    getAllBugs() {
      return bugsAxiosInstance.get();
    },
    getBugById({ bugId }) {
      return bugsAxiosInstance.get(`/${bugId}`);
    },
    getBugAttachments({ bugId }) {
      return bugsAxiosInstance.get(`/${bugId}/attachments`);
    },
  },
  POST: {
    createBug({ bugBody }) {
      return bugsAxiosInstance.post("/", {
        ...bugBody,
      });
    },
    createAttachment({ bugId, attachmentBody }) {
      return bugsAxiosInstance.post(`/${bugId}/attachments`, {
        ...attachmentBody,
      });
    },
  },
  PUT: {
    updateBug({ bugId, bugBody }) {
      return bugsAxiosInstance.put(`/${bugId}`, {
        ...bugBody,
      });
    },
  },
  DELETE: {
    deleteBug({ bugId }) {
      return bugsAxiosInstance.delete(`/${bugId}`);
    },
    deleteAttachment({ bugId, attachmentId }) {
      return bugsAxiosInstance.delete(`/${bugId}/attachments/${attachmentId}`);
    },
  },
};

export const ReleaseTrackerAPI = {
  GET: {
    getAllReleases() {
      return releaseAxiosInstance.get("/");
    },
    getReleaseById({ releaseId }){
      return releaseAxiosInstance.get(`/${releaseId}`)
    },
    getAllMilestones(){
      return axiosInstance.get(`v1/milestones/all`)
    }
  },
  POST: {
    createNewRelease({ releaseBody }) {
      return releaseAxiosInstance.post("/", {
        ...releaseBody,
      });
    },
    addTasksToRelease({ releaseId, releaseBody }){
      return releaseAxiosInstance.post(`/${releaseId}`, {
        ...releaseBody
      })
    }
  },
  PUT: {
    updateRelease({releaseBody, releaseId}) {
      return releaseAxiosInstance.put(`/${releaseId}`, {
        ...releaseBody,
      });
    }
  },
  DELETE: {
    deleteReleaseTask({taskId, releaseId}){
      return releaseAxiosInstance.delete(`/${releaseId}/${taskId}`)
    },

    deleteRelease({ releaseId }){
      return releaseAxiosInstance.delete(`/${releaseId}`)
    }
  }
};
