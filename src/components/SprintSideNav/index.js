import "./SprintNav.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSprintId } from "../../app/features/SprintPlanning/SprintPlanningSlice";
import { getSprintByIdThunk } from "../../app/features/SprintPlanning/AsyncThunks";
import addIcon from "../../assets/add.svg";
import { ToolTip } from "../../components/Tooltip";
import homeIcon from "../../assets/homeIcon.svg";
import { SprintFilter } from "../SprintFilter";
import { Loader } from "../Loader";

export const SprintNav = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setShowModal, showModal, sprintData } = props;
  const [searchStr, setSearchStr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ENGINEERING");
  const [sprintDataState, setSprintDataState] = useState(null);

  const getFilteredSprints = (sprintData, searchStr) => {
    return sprintData.filter((sprint) =>
      sprint.name.toLowerCase().includes(searchStr.toLowerCase())
    );
  };

  useEffect(() => {
    if(sprintData){
      const _sprintData = sprintData.filter(sprint => sprint.type === activeTab)
      setSprintDataState(_sprintData);
    }
  }, [sprintData]);

  const sprintTypeTabHandler = (tabType) => {
    setActiveTab(tabType);

    const _filteredSprints = sprintData.filter(
      (sprint) => sprint.type === tabType
    );
    setSprintDataState(_filteredSprints);
  };

  return (
    <div className="sidenav-container sprint-nav">
      <img
        src={homeIcon}
        className="home-icon"
        onClick={() => {
          console.log("CLEANED UP");
          localStorage.removeItem("VIEWFILTERS");
          localStorage.removeItem("FILTERSTATE");
          navigate("/");
        }}
      />
      <input
        placeholder="Enter sprint Name"
        className="sprint-nav-search"
        value={searchStr}
        onChange={(evt) => setSearchStr(evt.target.value)}
      />
      <SprintFilter />
      {/* Show a tab to switch between Engineering and Internal tab  */}
      <div className="sprint-type-tabs__container">
        <div
          className={`type-tab ${activeTab === "ENGINEERING" ? "active" : ""}`}
          onClick={() => {
            sprintTypeTabHandler("ENGINEERING");
          }}
        >
          Engineering
        </div>
        <div
          className={`type-tab ${activeTab === "INTERNAL" ? "active" : ""}`}
          onClick={() => {
            sprintTypeTabHandler("INTERNAL");
          }}
        >
          Internal
        </div>
      </div>
      <div className="all-sprints__container">
        <h1 className="sprint-title">Sprints</h1>
        {}
        {sprintDataState ? (
          getFilteredSprints(sprintDataState, searchStr)?.length === 0 ? (
            <p>No Sprints found</p>
          ) : (
            parseInt(getFilteredSprints(sprintDataState, searchStr)?.length) >
              0 &&
            getFilteredSprints(sprintDataState, searchStr).map((sprint) => (
              <div
                className={`sprint-name__container ${
                  sprint._id === searchParams.get("sprintId")
                    ? "active-sprint"
                    : ""
                }`}
                key={sprint._id}
                onClick={() => {
                  setSearchParams({ sprintId: sprint._id });
                  dispatch(setCurrentSprintId({ sprintId: sprint._id }));
                  dispatch(getSprintByIdThunk({ sprintId: sprint._id }));
                }}
              >
                <p>{sprint.name}</p>
                <div
                  className={`sprint-status-label ${sprint.status.toLowerCase()}`}
                >
                  {sprint.status.toLowerCase()}
                </div>
              </div>
            ))
          )
        ) : (
          <Loader />
        )}
      </div>
      <div className="new-sprint-btn__container">
        <ToolTip name={"Create Sprint"} align={"top"}>
          <button
            className="new-sprint-btn show-modal"
            onClick={() => {
              setShowModal((prev) => !prev);
            }}
          >
            <img
              src={addIcon}
              className={`${showModal ? "modal-close-btn" : "modal-open-btn"}`}
            />
          </button>
        </ToolTip>
      </div>
    </div>
  );
};
