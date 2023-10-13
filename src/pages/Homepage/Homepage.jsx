import React, { useEffect } from "react";
import { useState } from "react";
import { Dashboard } from "./Components/Dashboard/Dashboard";
import { Workspace } from "./Components/Workspace/Workspace";
import { UsersList } from "./Components/UsersList/UsersList";
import { OverallActivity } from "./Components/OverallActivity/OverallActivity";
import { SideNav } from "../../components/SideNav/SideNav";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentWorkspace } from "../../app/features/Engineering/EngineeringSlice";
import "./Homepage.css";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";

const Homepage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentWorkspace({ workspace: null }));
  }, []);

  const [currentTab, setCurrentTab] = useState("workspace");

  const getCurrentUser = () => {
    const decoded = jwtDecode(localStorage.getItem("token"));
    return decoded;
  };

  return (
    <>
      <SideNav />
      <div className="main-content">
        <div className="tabs-container">
          <button
            className={`tab-btn ${
              currentTab === "workspace" ? "active-tab-btn" : ""
            }`}
            onClick={() => setCurrentTab("workspace")}
          >
            Workspace
          </button>
          <button
            className={`tab-btn ${
              currentTab === "users" ? "active-tab-btn" : ""
            }`}
            onClick={() => setCurrentTab("users")}
          >
            Users
          </button>
          <button
            className={`tab-btn ${
              currentTab === "overall" ? "active-tab-btn" : ""
            }`}
            onClick={() => setCurrentTab("overall")}
          >
            Overall Activity
          </button>
          <div className="user-profile__container">
            {/* <img src={getCurrentUser()?.picture} className="user-image" /> */}
            <p className="user-name">Welcome! {getCurrentUser()?.name}</p>
          </div>
        </div>

        {currentTab === "workspace" && <Workspace />}
        {currentTab === "users" && <UsersList />}
        {currentTab === "overall" && <OverallActivity />}
      </div>
    </>
  );
};
export { Homepage };
