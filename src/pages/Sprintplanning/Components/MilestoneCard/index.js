import { ToolTip } from "../../../../components/Tooltip";
import EditIcon from "../../../../assets/edit.svg";
import DeleteIcon from "../../../../assets/delete.svg";
import Style from "./MilestoneCard.module.css";
import { useState } from "react";
import { EditMilestoneForm } from "../EditMilestoneForm";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMilestone } from "../../../../app/features/SprintPlanning/SprintPlanningSlice";
import {
  deleteMilestoneThunk,
  getSprintByIdThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { isFulfilled } from "@reduxjs/toolkit";
import { DeleteModal } from "../DeleteModal";
import {useSearchParams} from "react-router-dom";
import ExportIcon from "../../../../assets/export.svg";

export const MilestoneCard = (props) => {
  const { milestone, setShowModal, setMilestonetoEdit,setViewFilters, setFilters, setMilestoneToExport, setShowExportMilestoneModal } = props;
  const dispatch = useDispatch();
  const { currentMilestoneData, currentSprintId } = useSelector(
    (state) => state.sprintPlanning
  );
  // const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();

  const initColumnState = [
    "NONE",
    "ID",
    "OWNER",
    "ASSIGNEE",
    "START DATE",
    "END DATE",
    "TYPE",
    "PRIORITY",
    "STATUS"]
  // const deleteMilestoneHandler = async (evt) => {
  //   evt.stopPropagation();

  //   const action = await dispatch(
  //     deleteMilestoneThunk({
  //       sprintId: currentSprintId,
  //       milestoneId: milestone._id,
  //     })
  //   );

  //   if (isFulfilled(action)) {
  //     dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
  //   }
  // };

  return (
    <div
      className={`${Style["milestonecard__container"]} ${
        currentMilestoneData?._id === milestone._id
          ? Style["active-milestone"]
          : ""
      }`}
      onClick={() => {
        const params = new URLSearchParams()
        console.log("CLEANED UP")
        localStorage.removeItem("VIEWFILTERS");
        localStorage.removeItem("FILTERSTATE");
        setViewFilters(initColumnState)
        setFilters({
          type: [],
          priority: [],
          status: [],
          assignee: [],
          owner: []
        })
        dispatch(setCurrentMilestone({ milestone }));
        const currentSprintId = searchParams.get('sprintId')
        setSearchParams({
          sprintId: currentSprintId,
          milestoneId: milestone._id
        })
      }}
    >
      <div className={Style["milestone-edit-icon__container"]}>
        <ToolTip name={"Export Milestone"} align={"top"}>
          <img
            src={ExportIcon}
            className="edit-icon"
            onClick={(evt) => {
              evt.stopPropagation();
              // show milestone export Modal for sprints
              setMilestoneToExport(milestone._id)
              setShowExportMilestoneModal(true)
            }}
          />
        </ToolTip>
        <ToolTip name={"Edit Milestone"} align={"top"}>
          <img
            src={EditIcon}
            className="edit-icon"
            onClick={(evt) => {
              evt.stopPropagation();
              setShowModal((prev) => !prev);
              setMilestonetoEdit({ ...milestone });
            }}
          />
        </ToolTip>
        <ToolTip name={"Delete Milestone"} align={"top"}>
          <img
            src={DeleteIcon}
            className="edit-icon"
            onClick={async (e)=>{
              e.stopPropagation()
             if(window.confirm("Are you sure you want to delete this item?")){
              console.log(milestone._id,"milestone id")
              const action = await dispatch(
                deleteMilestoneThunk({
                  sprintId: currentSprintId,
                  milestoneId: milestone._id,
                })
              );
              if (isFulfilled(action)) {
                dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
              }
             }}
            }

          />
        </ToolTip>
      </div>
      <p className={Style["milestonecard-detail"]}>
      Name: {milestone.name.length > 50
          ? `${milestone.name.slice(0, 50)}...`
          : milestone.name}
      </p>
      <p className={Style["milestonecard-detail"]}>
        Owner: {milestone.ownerEmail}
      </p>
      <p className={Style["milestonecard-detail"]}>
        Status: {milestone.status}
      </p>
      <p className={Style["milestonecard-detail"]}>
        Tasks Done: {milestone.tasksDoneCount}
      </p>
      <p className={Style["milestonecard-detail"]}>
        Total Tasks:{" "}
        {currentMilestoneData?._id === milestone._id
          ? currentMilestoneData?.tasks?.length
          : milestone.tasks?.length}
      </p>
    </div>
  );
};
