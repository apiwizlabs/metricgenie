import { useEffect, useState } from "react";
import { SprintNav } from "../../components/SprintSideNav";
import { NewSprintFormModal } from "./Components/NewSprintForm/NewSprintForm";
import { TaskForm } from "./Components/TaskForm/TaskForm";
import { SprintDetails } from "./Components/SprintDetails";
import { MilestoneDetails } from "./Components/MilestoneDetails";
import { TaskDetails } from "./Components/TaskDetails";
import "./sprint.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getSprintByIdThunk,
  getSprintInfoThunk,
  getSprintUsersThunk,
} from "../../app/features/SprintPlanning/AsyncThunks";
import { Loader } from "../../components/Loader";
import { useSearchParams } from "react-router-dom";
import { setCurrentSprintId } from "../../app/features/SprintPlanning/SprintPlanningSlice";

export const SprintPlanning = (props) => {
  const [showSprintCreationModal, setSprintCreationModal] = useState(false);
  const [showMilestoneModal, setMilestoneModal] = useState(false);
  const [showTaskModal, setShowtaskModal] = useState(false);
  const dispatch = useDispatch();
  const {
    sprintData,
    actionStatus,
    currentSprintId,
    currentSprintData,
    currentMilestoneData,
  } = useSelector((state) => state.sprintPlanning);
  const { getSprintById } = actionStatus;

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getSprintInfoThunk());
    dispatch(getSprintUsersThunk());

    if (searchParams.get("sprintId")) {
      const sprintId = searchParams.get("sprintId");
      dispatch(setCurrentSprintId({ sprintId }));
      dispatch(getSprintByIdThunk({ sprintId }));
    }
    if (currentSprintId) {
      setSearchParams({ sprintId: currentSprintId });
    }
  }, []);
  
  useEffect(()=>{
    return ()=>{
      console.log("CLEANED UP")
      localStorage.removeItem("VIEWFILTERS");
      localStorage.removeItem("FILTERSTATE");
    }
  },[])


  return (
    <>
      <SprintNav
        setShowModal={setSprintCreationModal}
        showModal={showSprintCreationModal}
        sprintData={sprintData}
      /> 
      <div className="main-content sprint-page__container">
        {!currentSprintId || getSprintById === "error" ? (
          <h1 className="fs-5 text-center">Select a Sprint to View details</h1>
        ) : (
          <>
            {!getSprintById || (getSprintById === "loading" && <Loader />)}
            {getSprintById && getSprintById === "fulfilled" && (
              <>
                <SprintDetails sprintData={currentSprintData} />
                <MilestoneDetails sprintData={currentSprintData} />
              </>
            )}
          </>
        )}
      </div>
      <NewSprintFormModal
        showModal={showSprintCreationModal}
        setShowModal={setSprintCreationModal}
      />
    </>
  );
};
