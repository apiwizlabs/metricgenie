import { useDispatch, useSelector } from "react-redux";
import { SideNav } from "../../components/SideNav/SideNav";
import {
  getAllBacklogThunk,
  deleteBacklogThunk,
} from "../../app/features/Backlogs/AsyncThunks";
import { BacklogForm } from "./Components/BacklogForm";
import Style from "./backlogs.module.css";
import { useEffect, useState } from "react";
import { ToolTip } from "../../components/Tooltip";
import { Table } from "react-bootstrap";
import deleteIcon from "../../assets/delete.svg";
import commentIcon from "../../assets/comment.svg";
import attachmentIcon from "../../assets/attachment.svg";
import { EditViewBacklogModal } from "./Components/EditViewBacklogModal";
import { isFulfilled } from "@reduxjs/toolkit";
import { Loader } from "../../components/Loader";
import { CommentModal } from "./Components/CommentsModal";
import { AttachmentModal } from "./Components/AttachmentModal";

export const Backlogs = (props) => {
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentEditableBacklog, setCurrentEditableBacklog] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState({ show: false });
  const [showAttachmentModal, setShowAttachmentModal] = useState({
    show: false,
  });

  const { backlogData, actionStatus } = useSelector((state) => state.backlogs);

  useEffect(() => {
    dispatch(getAllBacklogThunk());
  }, []);

  const deleteBacklogHandler = async (evt, backlogId) => {
    evt.stopPropagation();

    const action = await dispatch(
      deleteBacklogThunk({
        backlogId,
      })
    );

    if (isFulfilled(action)) {
      dispatch(getAllBacklogThunk());
    }
  };

  return (
    <>
      <SideNav />
      <div className="main-content">
        <h1 className={Style["page-title"]}>Active Backlogs</h1>

        <button
          className={`${Style["btn"]} ${Style["btn-primary"]} ${Style["new-backlog-btn"]}`}
          onClick={() => setShowCreateModal((prev) => !prev)}
        >
          New backlog
        </button>
        {actionStatus.getAllBacklog === "fulfilled" &&
          backlogData.length === 0 && <p>No Backlogs found</p>}
        {actionStatus.getAllBacklog === "loading" && <Loader />}
        {actionStatus.getAllBacklog === "fulfilled" &&
          backlogData.length > 0 && (
            <div className="details-table__container">
              <Table striped hover>
                <thead className="details-table-heading__container">
                  <tr>
                    <th>Name</th>
                    <th>Summary</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="detail-body__container">
                  {backlogData.map((backlog, index) => (
                    <tr
                      key={backlog._id}
                      className="detail-row"
                      onClick={() => {
                        setShowViewModal(true);
                        setCurrentEditableBacklog(backlog);
                      }}
                    >
                      <td className="detail-item">
                        {backlog.name?.length > 20
                          ? `${backlog.name.slice(0, 21)}...`
                          : backlog.name}
                      </td>
                      <td className="detail-item">
                        {backlog.summary?.length > 20
                          ? `${backlog.summary.slice(0, 21)}...`
                          : backlog.summary}
                      </td>
                      <td className="detail-item">
                        {backlog.description?.length > 20
                          ? `${backlog.description.slice(0, 21)}...`
                          : backlog.description}
                      </td>
                      <td className="detail-item">{backlog.type}</td>
                      <td className="detail-item">{backlog.status}</td>
                      <td className="detail-item">
                        <div className="actions__container d-flex gap-2">
                          <ToolTip name={"Delete"}>
                            <img
                              src={deleteIcon}
                              className="edit-icon"
                              onClick={(evt) =>
                               {evt.stopPropagation() 
                                if(window.confirm("Are you sure you want to delete this item?")){
                                  deleteBacklogHandler(evt, backlog._id)
                                }}
                              }
                            />
                          </ToolTip>
                          <ToolTip name={"Comment"}>
                            <img
                              src={commentIcon}
                              className="edit-icon"
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setShowCommentModal({
                                  backlogId: backlog._id,
                                  show: true,
                                });
                              }}
                            />
                          </ToolTip>
                          <ToolTip name={"Attach"}>
                            <img
                              src={attachmentIcon}
                              className="edit-icon"
                              onClick={(evt) => {
                                evt.stopPropagation();
                                setShowAttachmentModal({
                                  backlogId: backlog._id,
                                  show: true,
                                });
                              }}
                            />
                          </ToolTip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
      </div>
      <CommentModal
        showModal={showCommentModal}
        setShowModal={setShowCommentModal}
      />
      <EditViewBacklogModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        existingBacklog={currentEditableBacklog}
      />
      <AttachmentModal
        showModal={showAttachmentModal}
        setShowModal={setShowAttachmentModal}
      />
      <BacklogForm
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
      />
    </>
  );
};
