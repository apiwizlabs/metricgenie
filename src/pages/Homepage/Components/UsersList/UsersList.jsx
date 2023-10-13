import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsersThunk,
  getMonthlyUsersGrowth,
} from "../../../../app/features/Engineering/AsyncThunks";
import { OpenInNew } from "../../../../assets/allsvg";
import { DetailsModal } from "../../../../components/DetailsModal";
import { Loader } from "../../../../components/Loader";
import { helpers } from "../../../../helpers";
import downloadIcon from "../../../../assets/download-icon.svg";
import { GrowthDataCard } from "../../../../components/GrowthDataCard";
import Table from "react-bootstrap/Table";

export const UsersList = () => {
  const {
    allUsersData,
    userDataFetchStatus,
    usersGrowthData,
    userGrowthFetchStatus,
  } = useSelector((state) => state.engineering);

  const [showDetails, setShowDetails] = useState({ show: false, userId: null });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getMonthlyUsersGrowth());
  }, []);

  const getWorkspaceAccessList = (workspaces) => {
    return workspaces.reduce(
      (acc, curr) => [
        ...acc,
        { workspace: curr.workspace.tenant, _id: curr.workspace._id },
      ],
      []
    );
  };

  const getCompanyName = (email) => {
    if (email) {
      var domain = email.substring(email.lastIndexOf("@") + 1);
      return domain.split(".")[0];
    }
    return "";
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
          company: "",
        },
      ];
      const _data = data?.map((user) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loginId: user.loginId,
        userStatus: user.userStatus,
        company: getCompanyName(user.email),
      }));
      return [...emptyRow, ..._data];
    }
  };

  return (
    <>
      {userGrowthFetchStatus === "fulfilled" && usersGrowthData && (
        <div className="growth-data__container">
          <GrowthDataCard data={usersGrowthData} />
        </div>
      )}
      {userDataFetchStatus === "loading" && <Loader />}
      {userDataFetchStatus === "fulfilled" && (
        <div className="workspace-container position-relative">
          <div className="table-title-container d-flex justify-content-between align-items-center">
            <div className="table-title">Users List</div>
            <a
              href={`${helpers.getCSVDownloadableLink(
                getDataForCSV(allUsersData)
              )}`}
              download={`userslist.csv`}
            >
              <img src={downloadIcon} className="download-btn" />
            </a>
          </div>
          <Table striped hover>
            <thead className="task-details-table-heading__container table-heading">
              <tr>
                <th>Email</th>
                <th>LoginId</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
                <th>Workspaces</th>
              </tr>
            </thead>
            <tbody className="task-detail-body__container">
              {allUsersData &&
                allUsersData.map((user) => (
                  <>
                    <tr className="task-detail-row" key={user._id}>
                      <td className="task-detail-item">{user.email}</td>
                      <td className="task-detail-item">{user.loginId}</td>
                      <td className="task-detail-item">{user.firstName}</td>
                      <td className="task-detail-item">{user.lastName}</td>
                      <td
                        className={`ask-detail-item ${
                          user.userStatus === "active"
                            ? "text-green"
                            : "text-red"
                        }`}
                      >
                        {user.userStatus}
                      </td>
                      <td className="task-detail-item position-relative">
                        {user.workspaces.length}

                        {getWorkspaceAccessList(user.workspaces).length > 0 && (
                          <p
                            className="action-btn"
                            onClick={() => {
                              setShowDetails((prev) => ({
                                show: !prev.show,
                                userId: prev.userId ? null : user._id,
                              }));
                            }}
                          >
                            <OpenInNew />
                          </p>
                        )}
                        {showDetails.show &&
                          showDetails.userId === user._id &&
                          getWorkspaceAccessList(user.workspaces).length >
                            0 && (
                            <DetailsModal
                              data={getWorkspaceAccessList(user.workspaces)}
                              type="workspace"
                              setShow={setShowDetails}
                            />
                          )}
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};
