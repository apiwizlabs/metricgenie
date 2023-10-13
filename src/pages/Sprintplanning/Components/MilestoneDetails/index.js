import { useState, useEffect } from "react";
import { MilestoneCard } from "../MilestoneCard";
import { MilestoneForm } from "../MilestoneForm/MilestoneForm";
import { EditMilestoneForm } from "../EditMilestoneForm";
import addIcon from "../../../../assets/add.svg";
import { ToolTip } from "../../../../components/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import { TaskDetails } from "../TaskDetails";
import { MilestoneFilter } from "../../../../components/MilestoneFilter";
import { DeleteModal } from "../DeleteModal";
import {useSearchParams} from 'react-router-dom';
import { getMilestonebyIdThunk } from "../../../../app/features/SprintPlanning/AsyncThunks/index";
import { ExportMilestoneForm } from "./MilestoneExportForm";


export const MilestoneDetails = ({ sprintData }) => {
  const [showMilestoneModal, setMilestoneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [milestoneToEdit, setMilestonetoEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState({show:false})
  const { currentMilestoneData } = useSelector((state) => state.sprintPlanning);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showExportMilestoneModal, setShowExportMilestoneModal] = useState(false)
  const [milestoneToExport, setMilestoneToExport] = useState(false)


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


  const [filters, setFilters] =  useState(()=>{
    if(localStorage.getItem("FILTERSTATE")){
      return JSON.parse(localStorage.getItem("FILTERSTATE"))
    }else{
      return {
        type: [],
        priority: [],
        status: [],
        assignee: [],
        owner: []
      }
    }
  })

  // const [currMilestoneId, setCurrMilestoneId] = useState(searchParams.get("milestoneId"))

  useEffect(()=>{
    if(searchParams.get("milestoneId")){
      dispatch(getMilestonebyIdThunk({ sprintId: searchParams.get("sprintId"), milestoneId: searchParams.get("milestoneId") }));
    }
  },[])

  const [viewFilters, setViewFilters] =  useState(() =>{
    if(localStorage.getItem("VIEWFILTERS")) {
      return JSON.parse(localStorage.getItem("VIEWFILTERS"))    
    }else{
      return initColumnState
    }}) 


  return (
    <>
      <div className="milestone-details-container">
        <div className="d-flex milestone-filter">
          <h2 className="milestone-heading">Milestones</h2>
          <ToolTip name={"Create Milestone"} align={"top"}>
            <button
              className="milestone-creation-btn"
              onClick={() => {
                setMilestoneModal((prev) => !prev);
              }}
            >
              <img
                src={addIcon}
                className={`${
                  showMilestoneModal ? "modal-close-btn" : "modal-open-btn"
                }`}
              />
            </button>
          </ToolTip>
          <MilestoneFilter />
        </div>
        <div className="milestones__container">
          <div className="milestone-cards__container">
            {sprintData?.milestones && sprintData?.milestones?.length === 0 && (
              <p className="text-center">
                No milestones in this Sprint, Click on the Plus Button to create
                one
              </p>
            )}
            {sprintData &&
              sprintData?.milestones &&
              sprintData.milestones.map((milestone) => {
                return (
                <MilestoneCard
                // setShowDeleteModal={setShowDeleteModal}
                  setViewFilters={setViewFilters} setFilters={setFilters}
                  key={milestone._id}
                  milestone={milestone}
                  setShowModal={setShowEditModal}
                  setMilestonetoEdit={setMilestonetoEdit}
                  setMilestoneToExport={setMilestoneToExport}
                  setShowExportMilestoneModal={setShowExportMilestoneModal}
                />
              )})}
          </div>
        </div>
      </div>

      { showExportMilestoneModal && milestoneToExport && <ExportMilestoneForm show={showExportMilestoneModal} milestoneToExport={milestoneToExport} handleClose={()=>{
        setShowExportMilestoneModal(false)
        setMilestoneToExport(null)
      }} />}
   
      <MilestoneForm
        showModal={showMilestoneModal}
        setShowModal={setMilestoneModal}
      />
      <EditMilestoneForm
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        existingMilestoneDetails={milestoneToEdit}
      />
      {currentMilestoneData ? (
        <TaskDetails viewFilters={viewFilters} setViewFilters={setViewFilters} filters={filters} setFilters={setFilters} milestoneData={currentMilestoneData} />
      ) : (
        sprintData.milestones.length > 0 && (
          <p>Select a Milestone to view it's tasks</p>
        )
      )}
    </>
  );
};
