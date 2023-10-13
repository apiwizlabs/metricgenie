import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewTaskThunk,
  createSubTaskThunk,
  getMilestonebyIdThunk,
  getSprintByIdThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import {
  getAllBacklogThunk,
  deleteBacklogThunk,
} from "../../../../app/features/Backlogs/AsyncThunks";
import { SourceControl } from "./SourceControl";
import Style from "./TaskForm.module.css";
import { isFulfilled } from "@reduxjs/toolkit";
import { Pipeline } from "./Pipeline";
import { Dependency } from "./Dependency";
import { getLoggedInUser } from "../../../../utils";
import { Loader } from "../../../../components/Loader";
import infoIcon from "../../../../assets/info.svg";
import { ToolTip } from "../../../../components/Tooltip";
import ReactMarkdown from 'react-markdown';
import { Button } from "react-bootstrap";
import remarkGfm from 'remark-gfm'
import { DescriptionField } from "../../../../components/DescriptionField";
import { filterArrayByName } from "../../../../helpers";
import { toast } from "react-toastify";

export const TaskForm = (props) => {
  const { showModal, setShowModal, parentTaskId } = props;
  const [taskFormInput, setTaskFormInput] = useState({
    name: "",
    summary: "",
    description: "",
    owner: getLoggedInUser().name,
    ownerEmail: getLoggedInUser().email,
    assignee: "",
    assigneeEmail: "",
    startDate: "",
    endDate: "",
    type: "",
    priority: "",
    status: "",
    estimatedEffort: "",
    worklog: {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    },
  });
  const [taskImportedFrom, setTaskImportedFrom] = useState(null); // this only sets only when import is clicked after chosing a backlog
  const [backlogToImport, setBacklogToImport] = useState("");
  const [taskTab, setTaskTab] = useState("TASK")
  const [ togglePreviewNew, setTogglePreviewNew ] = useState(false)
  const [rfcTemplate, setRfctemplate] = useState("")

  const [taskFormError, setTaskFormError] = useState({
    owner: false,
    ownerEmail: false,
  });

  const [showImportForm, setShowImportForm] = useState(false);

  const dispatch = useDispatch();
  const { currentMilestoneData, currentSprintData, actionStatus, sprintUsers } =
    useSelector((state) => state.sprintPlanning);

  const {
    actionStatus: { getAllBacklog },
    backlogData,
  } = useSelector((state) => state.backlogs);

  const getInitialState = () => {
    return {
      name: "",
      summary: "",
      description: "",
      owner: getLoggedInUser().name,
      ownerEmail: getLoggedInUser().email,
      assignee: "",
      assigneeEmail: "",
      startDate: "",
      endDate: "",
      type: "",
      priority: "",
      status: "",
      estimatedEffort: "",
      worklog: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      },
    };
  };

  useEffect(() => {
    setTaskFormInput(getInitialState());
    setRfctemplate("")
    setShowImportForm(false);
    setBacklogToImport("");
  }, [showModal]);
  
  // const [desc, setDesc] = useState("")

  const taskTextInputChangeHandler = (evt, field) => {

      setTaskFormInput((prev) => ({
        ...prev,
        [field]: evt.target.value,
      }));
      if (evt.target.value.length === 0) {
        setTaskFormError((prev) => ({
          ...prev,
          [field]: true,
        }));
      } else {
        setTaskFormError((prev) => ({
          ...prev,
          [field]: false,
        }));
      }
  };

  const validateSourceControl = (sources) => {
    if (sources.length === 0) {
      return false;
    } else {
      return taskFormError.sourceControl.reduce(
        (acc, curr) =>
          acc ||
          ["repoName", "branchName", "link"].reduce((acc, currKey) => {
            if (curr[currKey] !== undefined) {
              return acc || curr[currKey];
            } else {
              return true;
            }
          }, false),
        false
      );
    }
  };

  const validatePipeline = (pipelines) => {
    if (pipelines.length === 0) {
      return false;
    } else {
      return taskFormError.pipeline.reduce((acc, curr) => {
        if (curr.buildUrl !== undefined) {
          return acc || curr.buildUrl;
        } else {
          return true;
        }
      }, false);
    }
  };
  
  const validateDependency = (dependencies) => {
    if (dependencies.length === 0) {
      return false;
    } else {
      return taskFormError.dependency.reduce((acc, curr) => {
        if (curr.link !== undefined) {
          return acc || curr.link;
        } else {
          return true;
        }
      }, false);
    }
  };

  const validateForm = () => {
    const _taskFormInput = JSON.parse(JSON.stringify(taskFormInput));
    delete _taskFormInput.worklog;
    return Object.keys(_taskFormInput).reduce((acc, curr) => {
      if (taskFormError[curr] !== undefined) {
        if (curr === "sourceControl") {
          return acc || validateSourceControl(taskFormInput.sourceControl);
        } else if (curr === "pipeline") {
          return acc || validatePipeline(taskFormInput.pipeline);
        } else if (curr === "dependency") {
          return acc || validateDependency(taskFormInput.dependency);
        }
        return acc || taskFormError[curr];
      } else {
        return true;
      }
    }, false);
  };

  const createTaskHandler = async (evt) => {
    if (validateForm()) {
      evt.preventDefault();
    } else {
      // call task create thunk
      const taskBody = { ...taskFormInput, rfcTemplate };
      if (taskFormInput.sourceControl) {
        const _sourceControl = taskFormInput.sourceControl.map(
          ({ repoName, branchName, link }) => ({ repoName, branchName, link })
        );
        taskBody.sourceControl = _sourceControl;
      }
      if (taskFormInput.pipeline) {
        const _pipeline = taskFormInput.pipeline.map(({ buildUrl }) => ({
          buildUrl,
        }));

        taskBody.pipeline = _pipeline;
      }
      if (taskFormInput.dependency) {
        const _dependency = taskFormInput.dependency.map(({ link }) => ({
          link,
        }));

        taskBody.dependency = _dependency;
      }
      // delete the importedFromBacklog field before sending
      if (taskBody.importedFromBacklog) {
        delete taskBody.importedFromBacklog;
        // add the existing comments and attachments of the task
        taskBody.comments = taskImportedFrom.comments;
        taskBody.attachments = taskImportedFrom.attachments;
      }

      let action = null

      // Creating sub task within same task 
      if(parentTaskId){
        action = await dispatch(
          createSubTaskThunk({
            milestoneId: currentMilestoneData._id,
            sprintId: currentSprintData._id,
            taskId: parentTaskId,
            taskBody
          })
        )
      }
      // Creating new task inside the milestone 
      else {
          action = await dispatch(
          createNewTaskThunk({
            milestoneId: currentMilestoneData._id,
            sprintId: currentSprintData._id,
            taskBody,
          })
        );
      }

      if (isFulfilled(action)) {
        if (taskFormInput.importedFromBacklog) {
          dispatch(
            deleteBacklogThunk({ backlogId: taskFormInput.importedFromBacklog })
          );
        }
        setTaskFormInput(getInitialState());

        setTaskFormError({});
        setShowModal(false);

        if(parentTaskId){
          dispatch(getMilestonebyIdThunk({ sprintId: currentSprintData._id, milestoneId: currentMilestoneData._id }))
          toast.success("Sub Task created")
        }else{
          dispatch(getSprintByIdThunk({ sprintId: currentSprintData._id }));
        }
      }

    }
  };

  const getBacklogs = async () => {
    const action = await dispatch(getAllBacklogThunk());
  };

  const populateBacklogData = () => {
    const { name, summary, description, comments, attachments, _id } =
      backlogToImport;
    setTaskFormInput((prev) => ({
      ...prev,
      name,
      summary,
      description,
      importedFromBacklog: _id,
    }));
    setTaskFormError((prev) => ({
      ...prev,
      name: false,
      summary: false,
      description: false,
      importedFromBacklog: false,
    }));
  };

  return (
    <div
      className={`${Style["task__container"]} ${showModal && Style["show"]}`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["task-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <div className={`${Style["tasks-tabs__container"]}`}>
          <div className={`${Style["task-tab"]} ${taskTab === "TASK" ? Style["active"] : ""}`} onClick={() => {
            setTaskTab("TASK")
          }}>
            Task Details
          </div>
          <div className={`${Style["task-tab"]} ${taskTab === "RFC" ? Style["active"] : ""}`} onClick={() => {
            setTaskTab("RFC")
            setShowImportForm(false)
          }}>
            RFC Template
          </div>
        </div>
        {/* <h1 className={Style["task-modal-title"]}>Enter Task details</h1> */}
        {!taskImportedFrom && taskTab === "TASK" && (
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]} position-top-right`}
            onClick={() => {
              setShowImportForm((prev) => !prev);
              getBacklogs();
              setBacklogToImport("");
            }}
          >
            {showImportForm ? "Close Import form" : "Import From backlog"}
          </button>
        )}
        {/* Task Details Form  */}
        { taskTab === "TASK" &&
          <div className={Style["task-modal-input__container"]}>
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Name <span>*</span>
              </label>
              <input
                placeholder="Enter Task Name"
                className={`${Style["modal-input"]} ${
                  taskFormError.name && Style["modal-input-error"]
                }`}
                type="text"
                value={taskFormInput.name}
                onChange={(evt) => taskTextInputChangeHandler(evt, "name")}
              />
            </div>
            
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Summary <span>*</span>
              </label>
              <input
                placeholder="Enter Task Summary"
                className={`${Style["modal-input"]} ${
                  taskFormError.summary && Style["modal-input-error"]
                }`}
                type="text"
                value={taskFormInput.summary}
                onChange={(evt) => taskTextInputChangeHandler(evt, "summary")}
              />
            </div>

            <DescriptionField  
            descriptionInput={taskFormInput.description} 
            descriptionError={taskFormError.description} 
            InputChangeHandler={taskTextInputChangeHandler} />

            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Owner <span>*</span>
              </label>
              <input
                placeholder="Enter Owner Name"
                className={`${Style["modal-input"]} ${
                  taskFormError.owner && Style["modal-input-error"]
                }`}
                type="text"
                value={taskFormInput.owner}
                disabled
              />
            </div>
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Owner Email <span>*</span>
              </label>
              <input
                placeholder="Enter Owner Email"
                className={`${Style["modal-input"]} ${
                  taskFormError.ownerEmail && Style["modal-input-error"]
                }`}
                type="email"
                value={taskFormInput.ownerEmail}
                disabled
              />
            </div>
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]} for="assignee">
                Assignee <span>*</span>
              </label>
              <select
                name="assignee"
                id="assignee"
                className={Style["modal-input"]}
                value={taskFormInput.assignee}
                onChange={(evt) => {
                  const assigneeName = evt.target.value
                  const assigneeEmail = sprintUsers.find(user => user.name === assigneeName)?.email
                  setTaskFormInput((prev) => ({
                    ...prev,
                    assignee: evt.target.value,
                    assigneeEmail
                  }));

                  if (evt.target.value.length === 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      assignee: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      assignee: false,
                      assigneeEmail: false
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Assignee
                </option>
                {sprintUsers && filterArrayByName(sprintUsers)?.map((user) => (
                  <option value={user.name} key={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Assignee Email <span>*</span>
              </label>
              <select
                name="assigneeEmail"
                id="assigneeEmail"
                className={Style["modal-input"]}
                value={taskFormInput.assigneeEmail}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    assigneeEmail: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      assigneeEmail: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      assigneeEmail: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Assignee Email
                </option>
                {sprintUsers && filterArrayByName(sprintUsers)?.map((user) => (
                  <option value={user.email} key={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${Style["input-group__container"]} d-flex flex-row`}>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>
                  Start Date <span>*</span>
                </label>
                <input
                  type={"date"}
                  className={`${Style["modal-date-input"]} ${
                    taskFormError.startDate && Style["modal-input-error"]
                  }`}
                  value={taskFormInput.startDate}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      startDate: evt.target.value,
                    }));
                    if (evt.target.value.length === 0) {
                      setTaskFormError((prev) => ({
                        ...prev,
                        startDate: true,
                      }));
                    } else {
                      setTaskFormError((prev) => ({
                        ...prev,
                        startDate: false,
                      }));
                    }
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>
                  End Date <span>*</span>
                </label>
                <input
                  type={"date"}
                  className={`${Style["modal-date-input"]} ${
                    taskFormError.endDate && Style["modal-input-error"]
                  }`}
                  value={taskFormInput.endDate}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      endDate: evt.target.value,
                    }));
                    if (evt.target.value.length === 0) {
                      setTaskFormError((prev) => ({
                        ...prev,
                        endDate: true,
                      }));
                    } else {
                      setTaskFormError((prev) => ({
                        ...prev,
                        endDate: false,
                      }));
                    }
                  }}
                />
              </div>
            </div>
            <div className={`${Style["input-group__container"]}`}>
              <label className={Style["modal-input-label"]} for="type">
                Type <span>*</span>
              </label>
              <select
                name="type"
                id="type"
                className={Style["modal-input"]}
                value={taskFormInput.type}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    type: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      type: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      type: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Type
                </option>
                <option value="BACKEND">Backend</option>
                <option value="CONFIGURATION">Configuration</option> 
                <option value="DESIGN">Design</option>
                <option value="FRONTEND">Frontend</option>
                <option value="MISCELLANEOUS">Miscellaneous</option>     
                <option value="OPERATIONS">Operations</option> <option value="QA">QA</option>       
              </select>
            </div>
            <div className={`${Style["input-group__container"]}`}>
              <label className={Style["modal-input-label"]} for="type">
                Priority <span>*</span>
              </label>
              <select
                name="priority"
                id="priority"
                className={Style["modal-input"]}
                value={taskFormInput.priority}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    priority: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      priority: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      priority: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Priority
                </option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className={`${Style["input-group__container"]}`}>
              <label className={Style["modal-input-label"]} for="type">
                Status <span>*</span>
              </label>
              <select
                name="status"
                id="status"
                className={Style["modal-input"]}
                value={taskFormInput.status}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    status: evt.target.value,
                  }));

                  if (evt.target.value.length === 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      status: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      status: false,
                    }));
                  }
                }}
              >
                <option value={""} selected disabled>
                  Select a Status
                </option>
                <option value="READY">Ready</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="CODE REVIEW">Code Review</option>
                <option value="TESTING">Testing</option>
                <option value="READY FOR RELEASE">Ready for Realease</option>
                <option value="IN PROD">In Prod</option>
                <option value="DONE">Done</option>
                <option value="REJECT">Reject</option>
              </select>
            </div>
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Estimated Effort <span>*</span>{" "}
                <ToolTip name={"All Efforts are in hours"} align="right">
                  <span>
                    <img src={infoIcon} className="edit-icon" />
                  </span>
                </ToolTip>
              </label>
              <input
                placeholder="Enter Estimated Effort in hours"
                className={`${Style["modal-input"]} ${
                  taskFormError.estimatedEffort && Style["modal-input-error"]
                }`}
                type="number"
                min={0}
                value={taskFormInput.estimatedEffort}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    estimatedEffort: Number(evt.target.value),
                  }));

                  if (Number(evt.target.value) < 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      estimatedEffort: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      estimatedEffort: false,
                    }));
                  }
                }}
              />
            </div>
            {/* <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>
                Effort Spent <span>*</span>
              </label>
              <input
                placeholder="Enter Effort in hours"
                className={`${Style["modal-input"]} ${
                  taskFormError.effortSpent && Style["modal-input-error"]
                }`}
                type="number"
                min={0}
                value={taskFormInput.effortSpent}
                onChange={(evt) => {
                  setTaskFormInput((prev) => ({
                    ...prev,
                    effortSpent: Number(evt.target.value),
                  }));

                  if (Number(evt.target.value) < 0) {
                    setTaskFormError((prev) => ({
                      ...prev,
                      effortSpent: true,
                    }));
                  } else {
                    setTaskFormError((prev) => ({
                      ...prev,
                      effortSpent: false,
                    }));
                  }
                }}
              />
            </div> */}

            {/* <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]} fs-6`}>
                Worklog
              </label>
            </div>

            <div
              className={`${Style["input-group__container"]} d-flex flex-row flex-wrap`}
            >
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Monday</label>
                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Monday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Monday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Tuesday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Tuesday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Tuesday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Wednesday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Wednesday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Wednesday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Thursday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Thursday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Thursday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Friday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Friday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Friday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Saturday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Saturday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Saturday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
              <div className={Style["modal-date-input__container"]}>
                <label className={Style["modal-input-label"]}>Sunday</label>

                <input
                  placeholder="Enter Effort in hours"
                  className={`${Style["modal-date-input"]} `}
                  type="number"
                  min={0}
                  value={taskFormInput.worklog.Sunday}
                  onChange={(evt) => {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      worklog: {
                        ...prev.worklog,
                        Sunday: Number(evt.target.value),
                      },
                    }));
                  }}
                />
              </div>
            </div> */}
            <SourceControl
              taskFormInput={taskFormInput}
              setTaskFormInput={setTaskFormInput}
              setTaskFormError={setTaskFormError}
              taskFormError={taskFormError}
              editMode={true}
            />
            <hr />
            <Pipeline
              taskFormInput={taskFormInput}
              setTaskFormInput={setTaskFormInput}
              setTaskFormError={setTaskFormError}
              taskFormError={taskFormError}
              editMode={true}
            />
            <hr />
            <Dependency
              taskFormInput={taskFormInput}
              setTaskFormInput={setTaskFormInput}
              setTaskFormError={setTaskFormError}
              taskFormError={taskFormError}
              editMode={true}
            />
          </div>
        }

        {
          taskTab === "RFC" &&
          <>
             <Button
                variant="light"
                size="sm"
                onClick={() => setTogglePreviewNew(prev => !prev) }
                style={{ width: "max-content" }}
              >  
                {togglePreviewNew ? "Edit Markdown" : "Preview Markdown" }   
              </Button>
              {
                togglePreviewNew ? 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} 
                    children={rfcTemplate} 
                    className="markdown-preview"
                    linkTarget={"_blank"}
                  />
                  :          
                  <textarea className={Style["rfc-editor"]} value={rfcTemplate} onChange={(evt) => setRfctemplate(evt.target.value)} />
              }
          </>
        }

        {/* Backlog import form  */}
        <div
          className={`${Style["import-form__container"]} ${
            showImportForm ? Style["import-form-show"] : ""
          }`}
        >
          <h1 className={Style["task-modal-title"]}>
            {getAllBacklog === "loading"
              ? "Fetching Backlogs..."
              : "Choose Backlog to Import"}
          </h1>
          {getAllBacklog === "loading" && <Loader />}
          {getAllBacklog === "fulfilled" && backlogData.length === 0 && (
            <p>No Backlogs found</p>
          )}
          <div className={`${Style["input-group__container"]}`}>
            <select
              name="backlogName"
              id="backlogName"
              className={Style["modal-input"]}
              value={backlogToImport ? backlogToImport._id : backlogToImport}
              onChange={(evt) => {
                const backlogId = evt.target.value;
                const selectedbacklog = backlogData.find(
                  (backlog) => backlog._id === backlogId
                );
                setBacklogToImport({ ...selectedbacklog });
              }}
            >
              <option value={""} selected>
                Select a Backlog
              </option>
              {backlogData &&
                backlogData.map((backlog) => (
                  <option key={backlog._id} value={backlog._id}>
                    {backlog.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            // onClick={addAttachment}
            onClick={() => {
              populateBacklogData();
              setTaskImportedFrom({ ...backlogToImport });
              setShowImportForm(false);
            }}
            disabled={getAllBacklog !== "fulfilled" || !backlogToImport}
          >
            Import
          </button>
        </div>

        {/* Start of action buttons  */}
        <div className={Style["task-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            disabled={validateForm()}
            onClick={createTaskHandler}
          >
            {actionStatus.createNewTask === "loading"
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
