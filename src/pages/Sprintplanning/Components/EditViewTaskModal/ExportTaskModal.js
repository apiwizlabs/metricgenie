import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getSprintInfoThunk, getMilestonesOfSprintThunk, moveTaskToMilestoneThunk, moveMultipleTasksToMilestoneThunk, getMilestonebyIdThunk } from '../../../../app/features/SprintPlanning/AsyncThunks';
import { useDispatch, useSelector } from "react-redux";
import { isFulfilled } from "@reduxjs/toolkit";
import { Loader } from "../../../../components/Loader" ;
import { useSearchParams } from "react-router-dom";


export const ExportTaskModal = ({show, setShow, exportToBacklog, selectedTasks}) => {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        sprintData,
        actionStatus,
        currentSprintData
      } = useSelector((state) => state.sprintPlanning);
    const handleClose = () => {
        setShow(false)
    }

    const [selectedSprint, setSelectedSprint] = useState(null)
    const [selectedMilestone, setSelectedMilestone] = useState(null)

    useEffect(()=>{
        dispatch(getSprintInfoThunk());
    },[])

    useEffect(()=>{
        console.log("umm?")
        if(actionStatus.getSprintInfo === "fulfilled"){
            dispatch(getMilestonesOfSprintThunk({sprintId: sprintData[0]._id}))
            setSelectedSprint(sprintData[0]._id)
        }
    },[sprintData])

    useEffect(()=>{
        if(actionStatus.getMilestone === "fulfilled"){
            setSelectedMilestone(currentSprintData.milestones[0]._id)
        }
    },[currentSprintData])

    const handleSprintChange = (e) => {
        setSelectedSprint(e.target.value)
        dispatch(getMilestonesOfSprintThunk({ sprintId: e.target.value }))
    }

   const handleMoveTask = async () => {
    if(selectedTasks){
        const movedTask = await dispatch(moveMultipleTasksToMilestoneThunk (
            {sprintId: searchParams.get("sprintId"), 
        milestoneId: searchParams.get("milestoneId"), 
        taskIdList: selectedTasks, selectedMilestoneId: selectedMilestone}))
        if(isFulfilled(movedTask)){
           window.location.reload()
            setShow(false)
        }
    }else{
        const movedTask = await dispatch(moveTaskToMilestoneThunk(
            {sprintId: searchParams.get("sprintId"), 
        milestoneId: searchParams.get("milestoneId"), 
        taskId: searchParams.get("taskId"), selectedMilestoneId: selectedMilestone}))
        if(isFulfilled(movedTask)){
           window.location.reload()
            setShow(false)
        }
    }}

    return (
        <div className='export-task-modal-wrapper'>
            <Modal show={show} onHide={handleClose}>
            <Modal.Header className='d-flex justify-content-between'>
            <Modal.Title>Move Task/s</Modal.Title>
            {exportToBacklog &&  <Button variant="outline-primary" onClick={()=>{exportToBacklog(); handleClose()}}>
                Export To Backlog
            </Button>}
            </Modal.Header>
            <Modal.Body>
            <Form>
                {actionStatus.getSprintInfo === "loading" && <Loader />}
                {actionStatus.getSprintInfo === "fulfilled" && 
                <>
                {console.log(sprintData, "SPRINT LISTT")}
                  <Form.Group className="mb-3">
                    <Form.Label>Choose Sprint </Form.Label>
                    <Form.Select onChange={(e)=>{
                        setSelectedSprint(e.target.value)
                        handleSprintChange(e)
                    }}>
                        {sprintData.map(sprint =>  <option value={sprint._id}>{sprint.name}</option> )}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    {actionStatus.getMilestone === "loading" && <Loader />}
                    {actionStatus.getMilestone === "fulfilled" && 
                    <>
                       <Form.Label>Choose Milestone</Form.Label>
                        <Form.Select onChange={(e)=>setSelectedMilestone(e.target.value)}>
                            {currentSprintData.milestones.map(milestone => {
                                return ( <option value={milestone._id}>{milestone.name}</option> )
                            })}
                        </Form.Select>
                    </> }
                </Form.Group>
                </>
                
                }
              
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            {actionStatus.getMilestone === "fulfilled" && actionStatus.getSprintInfo === "fulfilled" &&             
            <Button variant="primary" onClick={handleMoveTask}>
                Export To Milestone
            </Button>}
            </Modal.Footer>
      </Modal>
        </div>
    );
};

