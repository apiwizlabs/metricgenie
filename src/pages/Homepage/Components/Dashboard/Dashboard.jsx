import React from "react";
import { OpenInNew, RoundPeopleAlt } from "../../../../assets/allsvg";

import "./Dashboard.css";
import { cardData } from "../../../../data/cardData";
import { Dropdown, Badge } from "react-bootstrap";
import { SideNav } from "../../../../components/SideNav/SideNav";
import { ActivityCard } from "../../../../components/ActivityCard";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  getApigeeActivityThunk,
  getKongActivityThunk,
  getMocksActivityThunk,
  getMonitoringActivityThunk,
  getSwagger2ActivityThunk,
  getSwagger3ActivityThunk,
  getTestsuiteActivityThunk,
  getWorkspacePlanInfoThunk,
  getWorkspaceSeatInfoThunk,
  getTotalUsersCountThunk,
  getUsersByWorkspaceThunk,
  getApigeexActivityThunk,
  getAllWorkspacesThunk,
} from "../../../../app/features/Engineering/AsyncThunks";
import { DetailsModal } from "../../../../components/DetailsModal";
import { useState } from "react";
import SwaggerIcon from "../../../../assets/swagger.svg";
import Testsuite from "../../../../assets/testsuite.svg";
import Mocks from "../../../../assets/mocks.svg";
import Monitor from "../../../../assets/Monitor.svg";
import apigee from "../../../../assets/apigee.svg";
import kong from "../../../../assets/kong.svg";
import apigeex from "../../../../assets/apigeex.png";
import { helpers } from "../../../../helpers";
import downloadIcon from "../../../../assets/download-icon.svg";
import { Loader } from "../../../../components/Loader";
import { setCurrentWorkspace } from "../../../../app/features/Engineering/EngineeringSlice";
import Table from "react-bootstrap/Table";

const Dashboard = () => {
  const dispatch = useDispatch();
  // when reload happens take the workspace from route and fetch data for that
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentSelectedWorkspace,
    workspaceActivity,
    workspacUserData,
    userDataFetchStatus,
    workspaceNameList,
  } = useSelector((state) => state.engineering);

  const currWorkspace = searchParams.get("workspace");

  const [showDetails, setShowDetails] = useState({ show: false, userId: null });
  const [showDetailUserInfo, setShowDetailUserInfo] = useState({
    show: false,
    userId: null,
  });

  const [currentWorkspace, setWorkspacelistState] = useState(null);

  useEffect(() => {
    if (!currentSelectedWorkspace) {
      dispatch(setCurrentWorkspace({ workspace: currWorkspace }));
      dispatch(getAllWorkspacesThunk());
    }
  }, []);

  useEffect(() => {
    if (currentSelectedWorkspace) {
      dispatch(getSwagger2ActivityThunk({ workspace: currWorkspace }));
      dispatch(getSwagger3ActivityThunk({ workspace: currWorkspace }));
      dispatch(getTestsuiteActivityThunk({ workspace: currWorkspace }));
      dispatch(getMocksActivityThunk({ workspace: currWorkspace }));
      dispatch(getMonitoringActivityThunk({ workspace: currWorkspace }));
      dispatch(getApigeeActivityThunk({ workspace: currWorkspace }));
      dispatch(getKongActivityThunk({ workspace: currWorkspace }));
      dispatch(getUsersByWorkspaceThunk({ workspace: currWorkspace }));
      dispatch(getApigeexActivityThunk({ workspace: currWorkspace }));

      setWorkspacelistState(currentSelectedWorkspace);
    }
  }, [currentSelectedWorkspace]);

  console.log("workspace users: ", workspacUserData);
  const getWorkspaceLevelInfo = (workspaces) => {
    return workspaces.find(
      (workspace) => workspace.workspace.tenant === currWorkspace
    );
  };

  const getDataForCSV = (data) => {
    if (data) {
      let emptyRow = [
        {
          email: "",
          firstName: "",
          lastName: "",
          loginId: "",
          userStatus: "",
        },
      ];
      const _data = data?.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loginId: user.loginId,
        userStatus: user.userStatus,
      }));
      return [...emptyRow, ..._data];
    }
  };

  const getUserDetailsData = (user) => {
    const _user = {
      ...user,
    };
    delete _user.workspaces;
    delete _user.createdBy;
    delete _user.password;
    delete _user.workspaces;
    delete _user._class;
    delete _user._id;

    const workspaceLevelInfo = getWorkspaceLevelInfo(user.workspaces);
    _user.roles = workspaceLevelInfo?.roles;
    _user.userType = workspaceLevelInfo?.userType;
    _user.planId = workspaceLevelInfo?.workspace?.planId;
    _user.paymentSchedule = workspaceLevelInfo?.workspace?.paymentSchedule;
    _user.trialPeriod = workspaceLevelInfo?.workspace?.trialPeriod;
    _user.isTrial = workspaceLevelInfo?.workspace?.isTrial;

    console.log(_user);
    return _user;
  };

  return (
    <>
      <SideNav />
      <div className="main-content">
        <div className="dashboard-contents">
          <div className="workspace-name-selector">
            <Dropdown>
              <Dropdown.Toggle
                className="dropdown-workspace"
                id="dropdown-basic"
              >
                {currentWorkspace ? currentWorkspace : "Select Workspace"}
              </Dropdown.Toggle>

              <Dropdown.Menu className="workspace-names-container">
                {workspaceNameList &&
                  workspaceNameList.map((workspace) => (
                    <Dropdown.Item
                      key={workspace._id}
                      onClick={() => {
                        dispatch(
                          setCurrentWorkspace({ workspace: workspace.tenant })
                        );
                        setSearchParams({ workspace: workspace.tenant });
                      }}
                    >
                      {workspace.tenant}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="card-display">
            <h3 className="">Module wise activity count</h3>
          </div>
          <div className="cards">
            {/* OAS 2.0  */}
            <ActivityCard
              type={"OAS 2.0"}
              cardIcon={SwaggerIcon}
              count={workspaceActivity.swagger2}
            />

            {/* OAS  3.0  */}
            <ActivityCard
              type={"OAS 3.0"}
              cardIcon={SwaggerIcon}
              count={workspaceActivity.swagger3}
            />

            {/* Testsuite  */}
            <ActivityCard
              type={"Testsuite"}
              cardIcon={Testsuite}
              count={workspaceActivity.testsuite}
            />

            {/* Mocks  */}
            <ActivityCard
              type={"Mocks"}
              cardIcon={Mocks}
              count={workspaceActivity.mocks}
            />

            {/* Monitor  */}
            <ActivityCard
              type={"Monitoring"}
              cardIcon={Monitor}
              count={workspaceActivity.monitor}
            />

            {/* APigee  */}
            <ActivityCard
              type={"Apigee"}
              cardIcon={apigee}
              count={workspaceActivity.apigee}
            />

            {/* ApigeeX  */}
            <ActivityCard
              type={"ApigeeX"}
              cardIcon={apigeex}
              count={workspaceActivity.apigeex}
            />

            {/* Kong  */}
            <ActivityCard
              type={"Kong"}
              cardIcon={kong}
              count={workspaceActivity.kong}
            />
          </div>

          <div className="dashboard-container">
            <div className="table-title-container d-flex justify-content-between align-items-center">
              <h3 className="table-title">Users</h3>
              {/* <button className="download-btn"> */}
              <a
                href={`${helpers.getCSVDownloadableLink(
                  getDataForCSV(workspacUserData)
                )}`}
                download={`${currentSelectedWorkspace}-users.csv`}
              >
                <img src={downloadIcon} className="download-btn" />
              </a>
              {/* </button> */}
            </div>

            {workspacUserData && userDataFetchStatus === "fulfilled" && (
              <Table striped hover>
                <thead className="task-details-table-heading__container user-table-heading">
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Plan</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="task-detail-body__container">
                  {workspacUserData.map((user) => (
                    <tr className="task-detail-row" key={user._id}>
                      <td className="task-detail-item">
                        {user.firstName && user.lastName && (
                          <p className="table-values no-mg-bottom">
                            {`${user.firstName} ${user.lastName}`}
                          </p>
                        )}
                        <p className="text-grey">{user.email}</p>
                      </td>
                      <td className="task-detail-item position-relative ov-visible">
                        {/* Check if the roles is greater than 2 then show a button to show details  */}
                        <p className="roles-container ov-visible">
                          {getWorkspaceLevelInfo(user.workspaces) &&
                            getWorkspaceLevelInfo(user.workspaces)
                              ?.roles?.slice(0, 2)
                              ?.map((role) => <Badge>{role}</Badge>)}
                        </p>
                        <p
                          className="action-btn"
                          onClick={() => {
                            setShowDetails((prev) => ({
                              show: !prev.show,
                              userId: prev.userId ? null : user._id,
                            }));
                          }}
                        >
                          {getWorkspaceLevelInfo(user.workspaces)?.roles
                            ?.length > 2 && <OpenInNew />}
                        </p>
                        {showDetails.show &&
                          showDetails.userId === user._id && (
                            <DetailsModal
                              data={
                                getWorkspaceLevelInfo(user.workspaces)?.roles
                              }
                              type="badge"
                              setShow={setShowDetails}
                            />
                          )}
                      </td>
                      <td className="task-detail-item">
                        <p className="table-values text-green">
                          {user.userStatus}
                        </p>
                      </td>
                      <td className="task-detail-item">
                        <p className="table-values">
                          {getWorkspaceLevelInfo(user.workspaces)?.userType}
                        </p>
                      </td>
                      <td className="task-detail-item">
                        <p className="table-values no-mg-bottom">
                          {
                            getWorkspaceLevelInfo(user.workspaces)?.workspace
                              ?.planId
                          }
                        </p>
                        {getWorkspaceLevelInfo(user.workspaces)?.workspace
                          ?.isTrial && <p className="text-grey">Trial</p>}
                      </td>
                      <td className="task-detail-item position-relative">
                        <div
                          className="action-btn"
                          onClick={() => {
                            setShowDetailUserInfo((prev) => ({
                              show: !prev.show,
                              userId: prev.userId ? null : user._id,
                            }));
                          }}
                        >
                          <OpenInNew />
                        </div>
                        {showDetailUserInfo.show &&
                          showDetailUserInfo.userId === user._id && (
                            <DetailsModal
                              data={getUserDetailsData(user)}
                              type="workspace-users"
                              setShow={setShowDetailUserInfo}
                            />
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {userDataFetchStatus === "loading" && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export { Dashboard };
