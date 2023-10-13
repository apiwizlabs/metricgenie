import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from 'react-router-dom';
import { getTaskByIdThunk } from "../../../../app/features/SprintPlanning/AsyncThunks";
import addIcon from "../../../../assets/add.svg";
import clearIcon from "../../../../assets/clearIcon.svg";
import attachmentIcon from "../../../../assets/attachment.svg";
import deleteIcon from "../../../../assets/delete.svg";
import fullscreenIcon from "../../../../assets/fullscreen.svg";
import minimizeIcon from "../../../../assets/minimize.svg";
import sortAscIcon from '../../../../assets/sort-asc.svg';
import sortDescIcon from '../../../../assets/sort-desc.svg';
import sortIcon from '../../../../assets/sort.svg';
import { ToolTip } from "../../../../components/Tooltip";
import { AttachmentModal } from "../AttachmentModal";
import { DeleteModal } from "../DeleteModal";
import { EditViewTaskModal } from "../EditViewTaskModal";
import { TaskForm } from "../TaskForm/TaskForm";
import { TaskFilter } from "./Components/TaskFilter";
import { ViewFilter } from "./Components/ViewFilter";
import { ExportTaskModal } from "../EditViewTaskModal/ExportTaskModal";
import { TaskRow } from "./Components/TaskRow";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

const sortedItems = useMemo(() => {
  let sortableItems = [...items];
  if (sortConfig !== null) {
    sortableItems.sort((a, b) => {
      if (a[(sortConfig.key)] < b[(sortConfig.key)]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[(sortConfig.key)] > b[(sortConfig.key)]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      if (new Date (a[('startDate')]) < new Date (b[('startDate')])) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (new Date (a[('startDate')]) > new Date (b[('startDate')])) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      if (new Date (a[('endDate')]) < new Date (b[('endDate')])) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (new Date (a[('endDate')]) > new Date (b[('endDate')])) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }
  return sortableItems;
}, [items, sortConfig]);
  const requestSort = (type) => {
    let key = type
   key=  key.toLowerCase().replace(' ','')

    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  return { items: sortedItems, requestSort, sortConfig,setSortConfig };
};

export const TaskDetails = ({ milestoneData, setViewFilters, viewFilters, filters, setFilters }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCommentModal, setShowCommentModal] = useState({ show: false });
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false });
  const [showAttachmentModal, setShowAttachmentModal] = useState({
    show: false,
  });
  const [currentEditableTask, setEditableTask] = useState(null);
  const [toggleFullscreen, setToggleFullscreen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(true);
  const [searchStr, setSearchStr] = useState("");
  const [isSortActive, setIsSortActive] = useState(null)
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
  

  const dispatch = useDispatch();
  const { currentSprintId, currentMilestoneData, sprintUsers, currentTaskData, actionStatus } = useSelector(
    (state) => state.sprintPlanning
  );
  const { items, requestSort,sortConfig,setSortConfig } = useSortableData(currentMilestoneData ? currentMilestoneData.tasks : []);
  const [allTasks, setAllTasks] = useState(currentMilestoneData ? currentMilestoneData.tasks : []);

useEffect(() => {
  setAllTasks(items)
}, [items])

  const getFilteredTasks = (allTasks, searchStr) => {
    if (searchStr.length === 0) {
      return allTasks;
    } else {
      return allTasks.filter(
        (task) =>
          task.owner.toLowerCase().includes(searchStr.toLowerCase()) ||
          task.assignee.toLowerCase().includes(searchStr.toLowerCase())
      );
    }
  };

  const searchTaskHandler = (evt) => {
    setSearchStr(evt.target.value);
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const filteredTasks = getFilteredTasks(allTasks, evt.target.value);
      setAllTasks(filteredTasks);
    }, 500);
  };

  const getAssigneeNameList = (sprintUsers) => {
    const res = [ ...sprintUsers.map((user) => user.name).sort()];
    return res;
  };

  useEffect(() => {
    setAllTasks(currentMilestoneData.tasks);
  }, [currentMilestoneData]);

  useEffect(()=>{
    if (actionStatus.getTaskById === "fulfilled"){
      setShowViewModal(true);
      setEditableTask(currentTaskData);
    }
  }, [currentTaskData])


  useEffect(() => {
    let filteredData = Object.keys(filters).reduce((acc, curr) => {
      return acc.filter((data) => {
        if(filters[curr].length > 0){
          for(let i of filters[curr]){
            if(data[curr] == i){
              return true;
            }
          } 
      return false}
      return true;}
    );
    }, currentMilestoneData.tasks);
    // filter on current searchstring too
    filteredData = getFilteredTasks(filteredData, searchStr);
    setAllTasks(filteredData);
  }, [filters, currentMilestoneData]);

  useEffect(()=>{
    localStorage.setItem("FILTERSTATE", JSON.stringify(filters))
  },[filters])

  useEffect(()=>{
    localStorage.setItem("VIEWFILTERS", JSON.stringify(viewFilters))
  },[viewFilters])


  useEffect( ()=>{
    if(searchParams.has('taskId')){
       dispatch(getTaskByIdThunk({
        taskId: searchParams.get('taskId'), 
        subTaskId: searchParams.get("subTaskId"), 
        milestoneId: searchParams.get('milestoneId'), 
        sprintId: searchParams.get('sprintId')
      }));
    }
  },[])
  const [selectedTasks, setSelectedTasks] = useState([])
  const [showExportTasksModal, setShowExportTasksModal] = useState(false)



  return (
    <>
        { showExportTasksModal && selectedTasks && selectedTasks.length > 0 && <ExportTaskModal show={showExportTasksModal} setShow={setShowExportTasksModal} selectedTasks={selectedTasks} />}
      <div className={`task-details__container ${toggleFullscreen}`}>
        <div className="new-task-btn__container">
          <div className="d-flex">
          <h2 className="milestone-heading">Tasks <span className="tasks-count">{allTasks ? allTasks.length : 0}</span></h2>
          <ToolTip name={"Add Task"} align="top">
            <button
              className="new-task-btn"
              onClick={() => {
                setShowCreateModal((prev) => !prev);
              }}
            >
              <img src={addIcon} />
            </button>
          </ToolTip>
          </div>
          {milestoneData && milestoneData.tasks.length > 0 && (
            <div className="task-filters">

              {selectedTasks && selectedTasks.length > 0 &&  (
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => {
                  setShowExportTasksModal(true)
                  }}
                >
                  Export Tasks
                </Button>
              ) }
              <Button
                variant="light"
                size="sm"
                onClick={() => {
                  setViewFilters(initColumnState)
                  setSortConfig(null)
                  setFilters({
                    type: [],
                    priority: [],
                    status: [],
                    assignee: [],
                    owner: []
                  });
                }}
              >
                <img src={clearIcon} />
              </Button>
              <ViewFilter
                viewFilters={viewFilters}
                setViewFilters={setViewFilters}
                viewOptions={initColumnState}
              />
              <TaskFilter
                filters={filters}
                setFilters={setFilters}
                filterType={"type"}
                filterOptions={[
                  "NONE",
                  "DESIGN",
                  "BACKEND",
                  "FRONTEND",
                  "QA",
                  "OPERATIONS",
                  "CONFIGURATION",
                  "MISCELLANEOUS",
                ]}
              />
              <TaskFilter
                filters={filters}
                setFilters={setFilters}
                filterType={"priority"}
                filterOptions={[  "NONE", "URGENT", "HIGH", "MEDIUM", "LOW"]}
              />
              <TaskFilter
                filters={filters}
                setFilters={setFilters}
                filterType={"status"}
                filterOptions={[
                  "NONE",
                  "READY",
                  "IN PROGRESS",
                  "CODE REVIEW",
                  "TESTING",
                  "READY FOR RELEASE",
                  "IN PROD",
                  "DONE",
                  "REJECT"
                ]}
              />
              <TaskFilter
                filters={filters}
                setFilters={setFilters}
                filterType={"owner"}
                filterOptions={getAssigneeNameList(sprintUsers)}
              />
              <TaskFilter
                filters={filters}
                setFilters={setFilters}
                filterType={"assignee"}
                filterOptions={getAssigneeNameList(sprintUsers)}
              />
               <Button
                variant="light"
                size="sm"
                onClick={() => setToggleFullscreen(prev => !prev)}
              >
               {toggleFullscreen ? 
               <img className="edit-icon" src={minimizeIcon} alt="minimize taskview" /> : 
               <img className="edit-icon" src={fullscreenIcon} alt="fullscreen taskview" />  } 
              </Button>
          
            </div>
          )}
        </div>
        {milestoneData.tasks.length === 0 && <p>No tasks in this milestone</p>}
        {milestoneData.tasks.length > 0 && (
          <div className={`task-details-table__container`}>
            <Table striped hover>
              <thead className="task-details-table-heading__container">
                <tr>
                <th></th>
                <th>Name</th>
                  {initColumnState.slice(1).map(filteredAttr => 
                    { if(viewFilters.includes(filteredAttr)){
                    
                        let title = filteredAttr.slice(0,1).toUpperCase() + filteredAttr.slice(1).toLowerCase()

                      if(filteredAttr.includes(" ")){
                       let formattedWords = filteredAttr.split(" ").reduce((acc, curr) => 
                        acc.concat(curr.slice(0,1).toUpperCase() + curr.slice(1).toLowerCase()),[])
                        title = formattedWords.join(" ")
                      }

                      return     <th
                      onClick={() =>
                          requestSort(title)
                      }
                  >
                      <span className="px-1" style={{userSelect:'none'}}>
                          {title}
                      </span>
                      <span className="px-1">
                              {sortConfig !==null &&sortConfig.key === title.toLowerCase().replace(' ','')?
                            sortConfig.direction === 'ascending' && sortConfig.key === title.toLowerCase().replace(' ','')
                              ?
                              <img src={sortDescIcon} alt='sort icon' height='18' width='18'/>
                              :<img src={sortAscIcon} alt='sort icon' height='18' width='18'/>
                              :<img src={sortIcon} alt='sort icon' height='18' width='18'/>}                        
                      </span>
                      </th>}
                    return null
                      })}
                <th>Action</th>
                <th>Select</th>
                </tr>
              </thead>
              <tbody className="task-detail-body__container">
                {allTasks &&
                  allTasks?.map((task, index) => (
                    <TaskRow  
                      // parentRowClickHandler={() => {
                      //   setShowViewModal(true);
                      //   setEditableTask(task);
                      //   setSearchParams(searchParams => {
                      //     searchParams.set("taskId",task._id);
                      //     return searchParams;
                      //   })
                      // }}
                      setShowViewModal={setShowViewModal}
                      setEditableTask={setEditableTask}
                      setSearchParams={setSearchParams}
                      initColumnState={initColumnState}
                      selectedTasks={selectedTasks}
                      setSelectedTasks={setSelectedTasks}
                      setShowAttachmentModal={setShowAttachmentModal}
                      setShowDeleteModal={setShowDeleteModal}
                      task={task}
                      viewFilters={viewFilters}
                      key={task._id}
                      toggleFullscreen={toggleFullscreen}
                    />

                  ))}

                {allTasks && allTasks.length === 0 && (
                  <tr>
                    <td className="empty-tasks-message" colSpan={"100%"}>
                      No Such tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      <TaskForm showModal={showCreateModal} setShowModal={setShowCreateModal} />
    { showViewModal && <EditViewTaskModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        existingTask={currentEditableTask}
      />}
      <DeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
      />
      {/* <CommentModal
        showModal={showCommentModal}
        setShowModal={setShowCommentModal}
      /> */}
      <AttachmentModal
        showModal={showAttachmentModal}
        setShowModal={setShowAttachmentModal}
      />
    </>
  );
};
