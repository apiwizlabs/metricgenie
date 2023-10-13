import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import "./styles/main.scss";
import {
  Backlogs,
  Dashboard,
  Homepage,
  Login,
  SprintPlanning,
  Bugs,
  ReleaseTracker,
  ReleaseDetail,
} from "./pages";
import { LoginSuccess } from "./pages/Login/success";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer
        autoClose={1500}
        closeOnClick
        draggable
        transition={Slide}
        limit={1}
      />
      <div className="main-page-content">
        <Routes>
          <Route path="/" element={<Navigate to={"/workspace"} />} />
          <Route
            path="/workspace"
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route
            path="/workspace/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/sprintplanning"
            element={
              <PrivateRoute>
                <SprintPlanning />
              </PrivateRoute>
            }
          />
          <Route
            path="/backlogs"
            element={
              <PrivateRoute>
                <Backlogs />
              </PrivateRoute>
            }
          />
          <Route
            path="/bugs"
            element={
              <PrivateRoute>
                <Bugs />
              </PrivateRoute>
            }
          />
          <Route
            path="/releases"
            element={
              <PrivateRoute>
                <ReleaseTracker />
              </PrivateRoute>
            }
          />
          <Route
            path="/releases/:releaseId"
            element={
              <PrivateRoute>
                <ReleaseDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
