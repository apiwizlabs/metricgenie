import { ToolTip } from "../../../../components/Tooltip";
import EditIcon from "../../../../assets/edit.svg";
import DeleteIcon from "../../../../assets/delete.svg";
import ExportIcon from "../../../../assets/export.svg";
import { EditSprintFormModal } from "../../Components/EditSprintForm/EditSprintForm";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSprintThunk,
  getSprintInfoThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { isFulfilled } from "@reduxjs/toolkit";
import { useSearchParams } from "react-router-dom";
import { helpers } from "../../../../helpers";

export const SprintDetails = ({ sprintData }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const modifyDateFormat = (dateString) => {
    return dateString.split("-").reverse().join("/");
  };


  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.sprintPlanning);
  const [searchparams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="sprint-details__container">
        <div className="sprint-details-row">
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Name</h2>
            <p className="sprint-field-content">{sprintData.name}</p>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Summary</h2>
            <ToolTip name={sprintData.summary}>
              <p className="sprint-field-content">{sprintData.summary}</p>
            </ToolTip>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Description</h2>
            <ToolTip name={sprintData.description}>
              <p className="sprint-field-content">{sprintData.description}</p>
            </ToolTip>
          </div>
        </div>
        <div className="sprint-details-row">
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Start Date</h2>
            <p className="sprint-field-content">
              {modifyDateFormat(sprintData.startDate)}
            </p>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">End Date</h2>
            <p className="sprint-field-content">
              {modifyDateFormat(sprintData.endDate)}
            </p>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Status</h2>
            <p
              className={`sprint-field-content ${sprintData.status.toLowerCase()}`}>
              {sprintData.status}
            </p>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Completion Percentage</h2>
            <p className="sprint-field-content">
              {sprintData.completionPercentage.toFixed(2)}%
            </p>
          </div>
          <div className="sprint-detail-field">
            <h2 className="sprint-field-name">Total Milestones</h2>
            <p className="sprint-field-content">
              {sprintData.milestones?.length}
            </p>
          </div>
        </div>
        <div className="sprint-action-icon__container">
          <ToolTip name={"Export Sprint to Excel"}>
              <img
                src={ExportIcon}
                className="action-icon"
                onClick={() => {
                  helpers.exportSprintDataToExcel({ data: sprintData, fileName: `${sprintData.name}.xlsx`})
                }}
              />
          </ToolTip>
          <ToolTip name={"Edit Sprint"}>
            <img
              src={EditIcon}
              className="action-icon"
              onClick={() => {
                setShowEditModal((prev) => !prev);
              }}
            />
          </ToolTip>
          <ToolTip name={"Delete Sprint"}>
            <img
              src={DeleteIcon}
              className="action-icon"
              onClick={async (e) => {
                e.stopPropagation()
                if(window.confirm("Are you sure you want to delete this item?")){
                   const action = await dispatch(
                  deleteSprintThunk({ sprintId: sprintData._id })
                );
                console.log({ action });
                if (isFulfilled(action)) {
                  dispatch(getSprintInfoThunk());
                  const query = searchparams.get("sprintId");
                  if (query) {
                    setSearchParams({});
                  }
                }
                }
               
              }}
            />
          </ToolTip>
        </div>
      </div>
      <EditSprintFormModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        existingSprintDetails={sprintData}
      />
    </>
  );
};
