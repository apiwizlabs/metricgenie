import { configureStore } from "@reduxjs/toolkit";
import engineerinReducer from "./features/Engineering/EngineeringSlice"
import sprintReducer from "./features/SprintPlanning/SprintPlanningSlice"
import backlogReducer from "./features/Backlogs/BacklogSlice"
import bugsReducer from "./features/Bugs/bugSlice"
import releaseReducer from "./features/ReleaseTracker/ReleaseTrackerSlice"

export const Store = configureStore({
  reducer: {
    engineering: engineerinReducer,
    sprintPlanning: sprintReducer,
    backlogs: backlogReducer,
    bugs: bugsReducer,
    releases: releaseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});