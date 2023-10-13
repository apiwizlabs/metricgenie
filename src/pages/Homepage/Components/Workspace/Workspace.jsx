import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { OpenInNew } from "../../../../assets/allsvg";
import "./Workspace.css";
import {
  getAllWorkspacesThunk,
  getMonthlyWorkspaceGrowth,
} from "../../../../app/features/Engineering/AsyncThunks";
import { setCurrentWorkspace } from "../../../../app/features/Engineering/EngineeringSlice";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../../components/Loader";
import { GrowthDataCard } from "../../../../components/GrowthDataCard";
import Table from "react-bootstrap/Table";

const Workspace = (props) => {
  const {
    allWorkspaceData,
    allWorkspaceFetchStatus,
    workspaceGrowthFetchStatus,
    workspaceGrowthData,
  } = useSelector((state) => state.engineering);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllWorkspacesThunk());
    dispatch(getMonthlyWorkspaceGrowth());
  }, []);

  return (
    <>
      {workspaceGrowthFetchStatus === "fulfilled" && workspaceGrowthData && (
        <div className="growth-data__container">
          <GrowthDataCard data={workspaceGrowthData} />
        </div>
      )}
      {allWorkspaceFetchStatus === "loading" && <Loader />}
      {allWorkspaceFetchStatus === "fulfilled" && (
        <div className="workspace-container position-relative">
          <div className="table-title-container">
            <div className="table-title">Workspaces</div>
          </div>
          <Table striped hover>
            <thead className="task-details-table-heading__container table-heading">
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Seats</th>
                <th>Trial Period</th>
                <th>Schedule</th>
                <th>Plan</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="task-detail-body__container">
              {allWorkspaceData &&
                allWorkspaceData.map((workspace) => (
                  <tr className="task-detail-row" key={workspace._id}>
                    <td className="task-detail-item">{workspace.tenant}</td>
                    <td
                      className={`task-detail-item ${
                        workspace.status === "active"
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {workspace.status}
                    </td>
                    <td className="task-detail-item">{workspace.seats}</td>
                    <td className="task-detail-item">
                      {workspace.trialPeriod}
                    </td>
                    <td className="task-detail-item">
                      {workspace.paymentSchedule}
                    </td>
                    <td className="task-detail-item">
                      {workspace.planId}
                      {workspace.isTrial && <p className="text-grey">Trial</p>}
                    </td>
                    <td className="task-detail-item">
                      {workspace.expiresOn
                        ? new Date(workspace.expiresOn).toDateString()
                        : ""}
                    </td>
                    <td className="task-detail-item">
                      <div
                        onClick={() => {
                          dispatch(
                            setCurrentWorkspace({ workspace: workspace.tenant })
                          );
                          navigate(
                            `/workspace/dashboard?workspace=${workspace.tenant}`
                          );
                        }}
                        className="action-btn"
                      >
                        <OpenInNew />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export { Workspace };
