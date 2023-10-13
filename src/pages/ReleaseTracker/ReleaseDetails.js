import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import deleteIcon from "../../assets/delete.svg";
import { ToolTip } from "../../components/Tooltip";
import {
  getReleaseByIdThunk,
  getAllMilestonesThunk,
  deleteReleaseTaskThunk
} from "../../app/features/ReleaseTracker/AsyncThunks";
import { Loader } from "../../components/Loader";
import { SideNav } from "../../components/SideNav/SideNav";
import Style from "./ReleaseTracker.module.css";
import { AttachMilestonesModal } from "./Components/AttachMilestoneModal";
import { Table } from "react-bootstrap";
import { EditViewTaskModal } from "../Sprintplanning/Components/EditViewTaskModal";
import { isFulfilled } from "@reduxjs/toolkit";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export const ReleaseDetail = (props) => {
  const params = useParams();
  const [showMilestoneAttachModal, setShowMilestoneAttachModal] =
    useState(false);
  const [selectedTaskToView, setSelectTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const dispatch = useDispatch();
  const { actionStatus, currentRelease} = useSelector(
    (state) => state.releases
  );

  const deleteReleaseTaskHandler = async (e, taskId) => {
    e.stopPropagation();
   const action = await dispatch(
      deleteReleaseTaskThunk({
        taskId,
        releaseId: params.releaseId
      })
    );
    if(isFulfilled(action)){
      dispatch(getReleaseByIdThunk({ releaseId: params.releaseId }));
    }
  }

  useEffect(()=>{
    dispatch(getReleaseByIdThunk({ releaseId: params.releaseId }));
    dispatch(getAllMilestonesThunk());
  },[])

  return (
    <>
      <SideNav />
      <div className="main-content position-relative">
        {actionStatus.getReleaseById === "loading" && <Loader />}
        {/* <p>{params.releaseId}</p> */}
        <div className={Style["release-meta-details__container"]}>
          <div className={Style["release-meta-detail"]}>
            {actionStatus.getReleaseById === "fulfilled" && (
              <>
                <p>Release Name: {currentRelease?.name}</p>
                <p>Start Date: {currentRelease?.startDate}</p>
                <p>Release Date: {currentRelease?.releaseDate}</p>
                <div>
                  Description: 
                  <ReactMarkdown remarkPlugins={[remarkGfm]} children={currentRelease?.description}/>
                </div>
              </>
            )}
          </div>
          <button
            className={`${Style["btn"]}`}
            onClick={() => {
              setShowMilestoneAttachModal(true);
            }}
          >
            Add Tasks
          </button>
        </div>
        {/* Show the same task view Modal, but disbale the edit and export button by passsing a prop  */}
        {actionStatus.getReleaseById === "fulfilled" &&
          currentRelease.tasks.length > 0 && (
            <>
            { currentRelease && currentRelease.milestones && 
              <>
                <p className="release-milestone-header">Milestones in this release</p>
                <div className="release-miletone-names__container">
                  {
                    currentRelease?.milestones?.map(({ name, _id }) => <span key={_id} className="milestone-name">{name}</span>)
                  }
                </div>
              </>
            }
            <div className="details-table__container">
              <p>Tasks in this release</p>
              <Table striped hover>
                <thead className="details-table-heading__container">
                  <tr>
                    <th>Name</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="detail-body__container">
                  {currentRelease.tasks &&
                    currentRelease.tasks?.map((task, index) => (
                      <TaskItem task={task} 
                      deleteReleaseTaskHandler={deleteReleaseTaskHandler}
                      setShowTaskModal={setShowTaskModal} 
                      setSelectTask={setSelectTask} />
                    ))}

                  {currentRelease && currentRelease.tasks.length === 0 && (
                    <tr className="detail-row">No data found</tr>
                  )}
                </tbody>
              </Table>
            </div>
            </>
          )}
      </div>
      <EditViewTaskModal
        showModal={showTaskModal}
        setShowModal={setShowTaskModal}
        existingTask={selectedTaskToView}
        page={"releases"}
      />
      <AttachMilestonesModal
        show={showMilestoneAttachModal}
        onHide={() => setShowMilestoneAttachModal(false)}
      />
    </>
  );
};


const TaskItem = ({task, setShowTaskModal, setSelectTask, deleteReleaseTaskHandler}) => {
  const [truncationState, setTruncationState] = useState(true);


  return (
    <tr onMouseEnter={() => setTruncationState(false)}
    onMouseLeave={() => setTruncationState(true)} 
    key={task._id} className="detail-row">
      <td className={`detail-item detail-item-link task-name ${!truncationState && "task-hover"}`}
        onClick={() => {
          setShowTaskModal(true);
          setSelectTask(task);
        }}
      >
        {task.name}
      </td>    
  <td className="detail-item">
        <p>{task.assignee}</p>
      </td>
      <td className="detail-item">
        <p>{task.status}</p>
      </td>
      <td className="detail-item">
        <p>
          {task.description.length > 20
            ? `${task.description.slice(0, 21)}...`
            : task.description}
        </p>
      </td>
      <td>
      <ToolTip name={"Delete"}>
        <img
          src={deleteIcon}
          className="edit-icon"
          onClick={(evt) =>
            {evt.stopPropagation() 
            if(window.confirm("Are you sure you want to delete this item?")){
              deleteReleaseTaskHandler(evt, task._id)
            }}
          }
        />
      </ToolTip>
      </td>
      
    </tr>
  )
}