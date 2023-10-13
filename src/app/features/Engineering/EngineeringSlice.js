import { createSlice } from "@reduxjs/toolkit";
import {
  getAllWorkspacesThunk,
  getSwagger2ActivityThunk,
  getSwagger3ActivityThunk,
  getMonitoringActivityThunk,
  getMocksActivityThunk,
  getKongActivityThunk,
  getApigeeActivityThunk,
  getTestsuiteActivityThunk,
  getUsersByWorkspaceThunk,
  getUsersThunk,
  getApigeexActivityThunk,
  getMonthlyUsersGrowth,
  getMonthlyWorkspaceGrowth,
  getYearlyUsersWorkspaceActivity,
} from "./AsyncThunks";

const initialState = {
  allWorkspaceData: [],
  yearlyActivityData: [],
  workspaceGrowthData: null,
  currentSelectedWorkspace: null,
  allWorkspaceFetchStatus: "idle",
  allWorkspaceFetchError: null,
  workspaceActivity: {},
  workspaceNameList: [],
  allUsersData: [],
  usersGrowthData: null,
  userDataFetchStatus: "idle",
  userDataFetchError: null,
  workspacUserData: null,
  kongFetchStatus: "idle",
  kongFetchError: null,
  swagger2FetchStatus: "idle",
  swagger2FetchError: null,
  swagger3FetchStatus: "idle",
  swagger3fetchError: null,
  testsuiteFetchStatus: "idle",
  testsuiteFetchError: null,
  mocksFetchStatus: "idle",
  mocksFetchError: null,
  monitorFetchStatus: "idle",
  monitorFetchError: null,
  apigeeFetchStatus: "idle",
  apigeeFetchError: null,
  kongFetchStatus: "idle",
  kongFetchError: null,
  userDataFetchStatus: "idle",
  userDataFetchError: null,
  apigeexFetchError: null,
  apigeexFetchStatus: "idle",
  workspaceGrowthFetchStatus: "idle",
  workspaceGrowthFetchError: null,
  userGrowthFetchStatus: "idle",
  userGrowthFetchError: null,
  yearlyActivityFetchStatus: "idle",
  yearlyActivityFetchError: null,
};

const EngineeringSlice = createSlice({
  name: "engineering",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      const { workspace } = action.payload;
      state.currentSelectedWorkspace = workspace;
      state.workspaceActivity = {};
      state.workspacUserData = null;
    },
    resetData: (state) => {
      state.allWorkspaceData = [];
      state.allWorkspaceFetchError = null;
      state.allWorkspaceFetchStatus = "idle";
      state.currentSelectedWorkspace = null;
      state.workspaceActivity = {};
      state.workspacUserData = null;
      state.state.workspaceNameList = [];
    },
    logout: (state) => {
      localStorage.removeItem("token");
      window.location.href = "/";
      state.allWorkspaceData = [];
      state.allWorkspaceFetchError = null;
      state.allWorkspaceFetchStatus = "idle";
      state.currentSelectedWorkspace = null;
      state.workspaceActivity = {};
      state.workspacUserData = null;
      state.workspaceNameList = [];
    },
  },
  extraReducers: {
    [getAllWorkspacesThunk.pending]: (state) => {
      state.allWorkspaceFetchStatus = "loading";
      state.allWorkspaceFetchError = null;
    },
    [getAllWorkspacesThunk.fulfilled]: (state, action) => {
      console.log("data from all worskspace reducer: ", action.payload);
      console.log("workspace action meta: ", action)
      const allWorkspace = action.payload.data.data;
      state.allWorkspaceData = allWorkspace;
      state.workspaceNameList = allWorkspace.map((workspace) => ({
        _id: workspace._id,
        tenant: workspace.tenant,
      }));
      state.allWorkspaceFetchStatus = "fulfilled";
      state.allWorkspaceFetchError = null;
    },
    [getAllWorkspacesThunk.rejected]: (state) => {
      state.allWorkspaceFetchError = state.allWorkspaceFetchStatus = "error";
    },
    [getSwagger2ActivityThunk.pending]: (state) => {
      state.swagger2FetchStatus = "loading";
      state.swagger2FetchError = null;
    },
    [getSwagger2ActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        swagger2: action.payload.data.data,
      };
      state.swagger2FetchStatus = "fulfilled";
      state.swagger2FetchError = null;
    },
    [getSwagger2ActivityThunk.rejected]: (state) => {
      state.swagger2FetchStatus = state.swagger2FetchError = "errror";
    },
    [getSwagger3ActivityThunk.pending]: (state) => {
      state.swagger3FetchStatus = "loading";
      state.swagger3fetchError = null;
    },
    [getSwagger3ActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        swagger3: action.payload.data.data,
      };

      state.swagger3FetchStatus = "fulfilled";
      state.swagger3fetchError = null;
    },
    [getSwagger3ActivityThunk.rejected]: (state, action) => {
      state.swagger3FetchStatus = state.swagger3fetchError = "error";
    },
    [getTestsuiteActivityThunk.pending]: (state) => {
      state.testsuiteFetchStatus = "loading";
      state.testsuiteFetchError = null;
    },
    [getTestsuiteActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        testsuite: action.payload.data.data,
      };
      state.testsuiteFetchError = null;
      state.testsuiteFetchStatus = "fulfilled";
    },
    [getTestsuiteActivityThunk.rejected]: (state) => {
      state.testsuiteFetchError = state.testsuiteFetchStatus = "error";
    },
    [getMocksActivityThunk.pending]: (state) => {
      state.mocksFetchStatus = "loading";
      state.mocksFetchError = null;
    },
    [getMocksActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        mocks: action.payload.data.data,
      };
      state.mocksFetchError = null;
      state.mocksFetchStatus = "fulfilled";
    },
    [getMocksActivityThunk.rejected]: (state) => {
      state.mocksFetchError = state.mocksFetchStatus = "error";
    },
    [getMonitoringActivityThunk.pending]: (state) => {
      state.monitorFetchStatus = "loading";
      state.monitorFetchError = null;
    },
    [getMonitoringActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        monitor: action.payload.data.data,
      };
      state.monitorFetchError = null;
      state.monitorFetchStatus = "fulfilled";
    },
    [getMonitoringActivityThunk.rejected]: (state) => {
      state.monitorFetchError = state.monitorFetchStatus = "error";
    },
    [getApigeeActivityThunk.pending]: (state) => {
      state.apigeeFetchStatus = "loading";
      state.apigeeFetchError = null;
    },
    [getApigeeActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        apigee: action.payload.data.data,
      };
      state.apigeeFetchStatus = "fulfilled";
      state.apigeeFetchError = null;
    },
    [getApigeeActivityThunk.rejected]: (state) => {
      state.apigeeFetchStatus = state.apigeeFetchError = "error";
    },
    [getKongActivityThunk.pending]: (state) => {
      state.kongFetchStatus = "loading";
      state.kongFetchError = null;
    },
    [getKongActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        kong: action.payload.data.data,
      };
      state.kongFetchStatus = "fulfilled";
      state.kongFetchError = null;
    },
    [getKongActivityThunk.rejected]: (state) => {
      state.kongFetchError = state.kongFetchStatus = "error";
    },
    [getUsersByWorkspaceThunk.pending]: (state) => {
      state.userDataFetchStatus = "loading";
      state.userDataFetchError = null;
    },
    [getUsersByWorkspaceThunk.fulfilled]: (state, action) => {
      state.workspacUserData = action.payload.data.data;
      state.userDataFetchStatus = "fulfilled";
      state.userDataFetchError = null;
    },
    [getUsersByWorkspaceThunk.rejected]: (state) => {
      state.userDataFetchError = state.userDataFetchStatus = "error";
    },
    [getUsersThunk.pending]: (state) => {
      state.userDataFetchStatus = "loading";
      state.userDataFetchError = null;
    },
    [getUsersThunk.fulfilled]: (state, action) => {
      state.allUsersData = action.payload.data.data;
      state.userDataFetchStatus = "fulfilled";
      state.userDataFetchError = null;
    },
    [getUsersThunk.rejected]: (state) => {
      state.userDataFetchError = state.userDataFetchStatus = "error";
    },
    [getApigeexActivityThunk.pending]: (state) => {
      state.apigeexFetchStatus = "loading";
      state.apigeexFetchError = null;
    },
    [getApigeexActivityThunk.fulfilled]: (state, action) => {
      state.workspaceActivity = {
        ...state.workspaceActivity,
        apigeex: action.payload.data.data,
      };
      state.apigeexFetchStatus = "fulfilled";
      state.apigeexFetchError = null;
    },
    [getApigeexActivityThunk.rejected]: (state) => {
      state.apigeeFetchError = state.apigeexFetchStatus = "error";
    },
    [getMonthlyWorkspaceGrowth.pending]: (state) => {
      state.workspaceGrowthFetchStatus = "loading";
      state.workspaceGrowthFetchError = null;
    },
    [getMonthlyWorkspaceGrowth.fulfilled]: (state, action) => {
      const { data } = action.payload.data;
      state.workspaceGrowthData = data;
      state.workspaceGrowthFetchStatus = "fulfilled";
      state.workspaceGrowthFetchError = null;
    },
    [getMonthlyWorkspaceGrowth.rejected]: (state) => {
      state.workspaceGrowthFetchError = state.workspaceGrowthFetchStatus =
        "error";
    },
    [getMonthlyUsersGrowth.pending]: (state) => {
      state.workspaceGrowthFetchStatus = "loading";
      state.workspaceGrowthFetchError = null;
    },
    [getMonthlyUsersGrowth.fulfilled]: (state, action) => {
      const { data } = action.payload.data;
      state.usersGrowthData = data;
      state.userGrowthFetchStatus = "fulfilled";
      state.userGrowthFetchError = null;
    },
    [getMonthlyUsersGrowth.rejected]: (state) => {
      state.userGrowthFetchStatus = state.userGrowthFetchError = "error";
    },
    [getYearlyUsersWorkspaceActivity.pending]: (state) => {
      state.yearlyActivityFetchStatus = "loading";
      state.yearlyActivityFetchError = null;
    },
    [getYearlyUsersWorkspaceActivity.fulfilled]: (state, action) => {
      const { data } = action.payload.data;
      state.yearlyActivityData = data;
      state.yearlyActivityFetchStatus = "fulfilled";
      state.yearlyActivityFetchError = null;
    },
    [getYearlyUsersWorkspaceActivity.rejected]: (state) => {
      state.yearlyActivityFetchStatus = state.yearlyActivityFetchError =
        "error";
    },
  },
});

export const { resetData, setCurrentWorkspace, logout } =
  EngineeringSlice.actions;
export default EngineeringSlice.reducer;
