import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SideNav } from "../../components/SideNav/SideNav";
import { NewReleaseModal } from "./Components/NewReleaseModal";
import { EditReleaseModal } from "./Components/EditReleaseModal";
import { deleteRelease, getReleaseThunk } from "../../app/features/ReleaseTracker/AsyncThunks";
import Style from "./ReleaseTracker.module.css";
import { Loader } from "../../components/Loader";
import { ToolTip } from "../../components/Tooltip";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setCurrentRelease } from "../../app/features/ReleaseTracker/ReleaseTrackerSlice";
import deleteIcon from "../../assets/delete.svg";

export const ReleaseTracker = (props) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditableRelease, setCurrentEditableRelease ] = useState(null);

  const dispatch = useDispatch();
  const { allReleases, actionStatus } = useSelector((state) => state.releases);

  useEffect(() => {
    dispatch(getReleaseThunk());
  }, []);

  return (
    <>
      <SideNav />
      <div className="main-content">
        <button
          className={`${Style["btn"]} ${Style["btn-primary"]} ${Style["new-release-btn"]}`}
          onClick={() => setShowNewModal(true)}
        >
          New Release
        </button>

        <h1 className={Style["page-title"]}>All Releases</h1>
        {actionStatus.getRelease === "fulfilled" &&
          allReleases.length === 0 && <p>No Releases found</p>}
        {actionStatus.getRelease === "loading" && <Loader />}
        {actionStatus.getRelease === "fulfilled" && allReleases.length > 0 && (
          <div className="details-table__container">
            <Table striped hover>
              <thead className="details-table-heading__container">
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>Release Date</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="detail-body__container">
                {allReleases &&
                  allReleases?.map((release, index) => (
                    <tr
                      key={release._id}
                      className="detail-row"
                      onClick={() => {
                        setShowEditModal(true);
                        setCurrentEditableRelease(release);
                      }}
                    >
                      <td className="detail-item detail-item-link">
                        <Link
                          to={`/releases/${release._id}`}
                          onClick={() => {
                            dispatch(
                              setCurrentRelease({ releaseId: release._id })
                            );
                          }}
                        >
                          {release.name}
                        </Link>
                      </td>
                      <td className="detail-item">
                        <p>{release.startDate}</p>
                      </td>
                      <td className="detail-item">
                        <p>{release.releaseDate}</p>
                      </td>
                      <td className="detail-item">
                        {release.description?.length > 80 ? (
                          <ToolTip align={"bottom"} name={release.description}>
                            <p>{`${release.description.slice(0, 80)}...`}</p>
                          </ToolTip>
                        ) : (
                          <p>{release.description}</p>
                        )}
                      </td>
                      <td className="detail-item">
                        <div className="actions__container">
                          <img src={deleteIcon}  className="edit-icon" onClick={(evt) => {
                            evt.stopPropagation();
                            const confirm = window.confirm("Are you sure you want to delete the release?")
                            if(confirm){
                              dispatch(deleteRelease({ releaseId : release._id }))
                            }
                          }} />
                        </div>
                      </td>
                    </tr>
                  ))}

                {allReleases && allReleases.length === 0 && (
                  <tr className="detail-row">No data found</tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {currentEditableRelease && <EditReleaseModal
        show={showEditModal}
        currentInfo={currentEditableRelease}
        onHide={() => {
          setCurrentEditableRelease(null)
          setShowEditModal(false)
        }}
      />}
      
      <NewReleaseModal
        show={showNewModal}
        onHide={() => setShowNewModal(false)}
      />
    </>
  );
};
