import { createAsyncThunk } from "@reduxjs/toolkit";
import { EngineeringAPI } from "../../../../api/apiConfig";

export const getWorkspaceCountThunk = createAsyncThunk(
  "engineering/getWorkspacecount",
  async () => {
    return EngineeringAPI.getTotalWorkspaceCount();
  }
);

export const getAllWorkspacesThunk = createAsyncThunk(
  "engineering/getAllworkspaces",
  async () => {
    return EngineeringAPI.getAllWorkspaces();
  }
);

export const getAllActiveWorkspaceThunk = createAsyncThunk(
  "engineering/getAllActiveWorkspaces",
  async () => {
    return EngineeringAPI.getAllActiveWorkspaces();
  }
);

export const getAllInactiveWorkspaceThunk = createAsyncThunk(
  "engineering/getAllInactiveworkspaces",
  async () => {
    return EngineeringAPI.getAllInactiveworkspaces();
  }
);

export const getMonthlyWorkspaceGrowth = createAsyncThunk(
  "engineering/getMonthlyWorkspaceGrowth",
  async () => {
    return EngineeringAPI.getMonthlyWorkspaceGrowth();
  }
);

export const getMonthlyUsersGrowth = createAsyncThunk(
  "engineering/getMonthlyUsersGrowth",
  async () => {
    return EngineeringAPI.getMonthlyUsersGrowth();
  }
);

export const getUsersThunk = createAsyncThunk(
  "engineering/getUsers",
  async () => {
    return EngineeringAPI.getAllUsers();
  }
);

export const getTotalUsersCountThunk = createAsyncThunk(
  "engineering/getTotalUsersCount",
  async () => {
    return EngineeringAPI.getTotalUsersCount();
  }
);

export const getUsersByWorkspaceThunk = createAsyncThunk(
  "engineering/getUsersByWorkspace",
  async ({ workspace }) => {
    return EngineeringAPI.getUsersByWorkspace({ workspace });
  }
);

export const getWorkspacePlanInfoThunk = createAsyncThunk(
  "engineering/getWorkspacePlanInfo",
  async ({ workspace }) => {
    return EngineeringAPI.getPlanInfoOfWorkspace({ workspace });
  }
);

export const getWorkspaceSeatInfoThunk = createAsyncThunk(
  "engineering/getWorkspaceSeatInfo",
  async ({ workspace }) => {
    return EngineeringAPI.getWorkspaceSeatInfo({ workspace });
  }
);

export const getApiwizDownloadThunk = createAsyncThunk(
  "engineering/getApiwizDownload",
  async ({ workspace }) => {
    return EngineeringAPI.getApiwizDownloadCount();
  }
);

export const getSwagger2ActivityThunk = createAsyncThunk(
  "engineering/getSwagger2Activity",
  async ({ workspace }) => {
    return EngineeringAPI.getSwagger2ActivityByWorkspace({ workspace });
  }
);

export const getSwagger3ActivityThunk = createAsyncThunk(
  "engineering/getSwagger3Activity",
  async ({ workspace }) => {
    return EngineeringAPI.getSwagger3ActivityByWorkspace({ workspace });
  }
);

export const getTestsuiteActivityThunk = createAsyncThunk(
  "engineering/getTestsuiteActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getTestsuiteActivityByWorkspace({ workspace });
  }
);

export const getMonitoringActivityThunk = createAsyncThunk(
  "engineering/getMonitoringActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getMonitoringActivityByWorkspace({ workspace });
  }
);

export const getMocksActivityThunk = createAsyncThunk(
  "engineering/getMocksActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getMocksActivityByWorkspace({ workspace });
  }
);

export const getApigeeActivityThunk = createAsyncThunk(
  "engineering/getApigeeActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getApigeeCountByWorkspace({ workspace });
  }
);

export const getApigeexActivityThunk = createAsyncThunk(
  "engineering/getApigeexActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getApigeeXCountByWorkspace({ workspace });
  }
);

export const getKongActivityThunk = createAsyncThunk(
  "engineering/getKongActivity",
  async ({ workspace }) => {
    return EngineeringAPI.getKongCountByWorkspace({ workspace });
  }
);

export const getYearlyUsersWorkspaceActivity = createAsyncThunk(
  "engineering/getYearlyUsersWorkspaceActivity",
  async ({ year }) => {
    return EngineeringAPI.getOverallUserWorkspaceActivity({ year });
  }
);
