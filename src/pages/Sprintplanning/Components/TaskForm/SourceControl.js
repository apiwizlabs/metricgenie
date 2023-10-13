import Style from "./TaskForm.module.css";
import addIcon from "../../../../assets/add.svg";
import { ToolTip } from "../../../../components/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import deleteIcon from "../../../../assets/delete.svg";

export const SourceControl = ({
  taskFormInput,
  setTaskFormInput,
  setTaskFormError,
  taskFormError,
  editMode,
}) => {
  const [sourceFields, setSourceFields] = useState([]);

  useEffect(() => {
    if (taskFormInput.sourceControl) {
      setSourceFields([...taskFormInput.sourceControl]);
    } else {
      setSourceFields([]);
    }
  }, [taskFormInput]);


  const fieldChangeHandler = (evt, index, fieldName, _id) => {
    const updatedSources = JSON.parse(JSON.stringify([...sourceFields]));
    console.log({ updatedSources });
    updatedSources[index][fieldName] = evt.target.value;

    setSourceFields(updatedSources);
    setTaskFormInput((prev) => ({
      ...prev,
      sourceControl: updatedSources,
    }));

    if (evt.target.value.length === 0) {
      const updatedSourceValidation = [...taskFormError.sourceControl];

      updatedSourceValidation[index][fieldName] = true;

      setTaskFormError((prev) => ({
        ...prev,
        sourceControl: updatedSourceValidation,
      }));
    } else {
      if (taskFormError.sourceControl) {
        if (index === taskFormError.sourceControl.length) {
          setTaskFormError((prev) => ({
            ...prev,
            sourceControl: [
              ...prev.sourceControl,
              {
                [fieldName]: false,
                _id,
              },
            ],
          }));
        } else {
          const updatedSourceValidation = [...taskFormError.sourceControl];
          updatedSourceValidation[index][fieldName] = false;
          setTaskFormError((prev) => ({
            ...prev,
            sourceControl: updatedSourceValidation,
          }));
        }
      } else {
        setTaskFormError((prev) => ({
          ...prev,
          sourceControl: [
            {
              [fieldName]: false,
              _id,
            },
          ],
        }));
      }
    }
  };

  return (
    <div>
      <div
        className={`${Style["input-group__container"]} ${Style["multi-input__container"]}`}
      >
        <label className={`${Style["modal-input-label"]} fs-6`}>
          Source Control
        </label>
        {editMode && (
          <div className={`${Style["multi-input-add-btn"]}`}>
            {/* When add source is clicked a set of input is added in the formInput state and form Error state  */}
            <ToolTip name={"Add Source"} align="top">
              <button
                className="btn"
                onClick={() => {
                  const newId = uuidv4();
                  if (!taskFormInput.sourceControl) {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      sourceControl: [
                        ...sourceFields,
                        {
                          repoName: "",
                          branchName: "",
                          link: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      sourceControl: [
                        {
                          _id: newId,
                        },
                      ],
                    }));
                  } else {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      sourceControl: [
                        ...sourceFields,
                        {
                          repoName: "",
                          branchName: "",
                          link: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      sourceControl: [
                        ...prev.sourceControl,
                        {
                          _id: newId,
                        },
                      ],
                    }));
                  }
                }}
              >
                <img src={addIcon} className="action-btn edit-icon" />
              </button>
            </ToolTip>
          </div>
        )}
      </div>
      {taskFormInput.sourceControl &&
        taskFormInput.sourceControl.map((source, index) => (
          <div className={`${Style["multi-input-field"]}`} key={source._id}>
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]}`}>
                Repo Name {editMode && <span>*</span>} :{" "}
                {!editMode && (
                  <span className={Style["modal-detail-text"]}>
                    {sourceFields[index]?.repoName
                      ? sourceFields[index].repoName
                      : ""}
                  </span>
                )}
              </label>
              {editMode && (
                <input
                  placeholder="Enter Repo name"
                  className={`${Style["modal-input"]} ${
                    taskFormError?.sourceControl &&
                    taskFormError?.sourceControl[index]?.repoName &&
                    Style["modal-input-error"]
                  }`}
                  type="text"
                  onChange={(evt) => {
                    fieldChangeHandler(evt, index, "repoName", source._id);
                  }}
                  value={
                    sourceFields[index]?.repoName
                      ? sourceFields[index].repoName
                      : ""
                  }
                />
              )}
            </div>
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]}`}>
                Branch Name {editMode && <span>*</span>} :{" "}
                {!editMode && (
                  <span className={Style["modal-detail-text"]}>
                    {sourceFields[index]?.branchName
                      ? sourceFields[index].branchName
                      : ""}
                  </span>
                )}
              </label>
              {editMode && (
                <input
                  placeholder="Enter Branch name"
                  className={`${Style["modal-input"]} ${
                    taskFormError?.sourceControl &&
                    taskFormError?.sourceControl[index]?.branchName &&
                    Style["modal-input-error"]
                  }`}
                  type="text"
                  onChange={(evt) => {
                    fieldChangeHandler(evt, index, "branchName", source._id);
                  }}
                  value={
                    sourceFields[index]?.branchName
                      ? sourceFields[index]?.branchName
                      : ""
                  }
                />
              )}
            </div>
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]}`}>
                Link {editMode && <span>*</span>} :{" "}
                {!editMode && (
                  <span className={Style["modal-detail-text"]}>
                    <a
                      href={
                        sourceFields[index]?.link
                          ? sourceFields[index].link
                          : ""
                      }
                      target={"_blank"}
                    >
                      {sourceFields[index]?.link
                        ? sourceFields[index].link
                        : ""}
                    </a>
                  </span>
                )}
              </label>
              {editMode && (
                <input
                  placeholder="Enter Link"
                  className={`${Style["modal-input"]} ${
                    taskFormError?.sourceControl &&
                    taskFormError?.sourceControl[index]?.link &&
                    Style["modal-input-error"]
                  }`}
                  type="text"
                  onChange={(evt) => {
                    fieldChangeHandler(evt, index, "link", source._id);
                  }}
                  value={
                    sourceFields[index]?.link ? sourceFields[index]?.link : ""
                  }
                />
              )}
            </div>
            {editMode && (
              <ToolTip name={"Delete Source"} align="top">
                <img
                  src={deleteIcon}
                  className={Style["action-icon"]}
                  onClick={() => {
                    const updatedSource = taskFormInput.sourceControl.filter(
                      (_source) => _source._id !== source._id
                    );
                    const updatedErrorSource =
                      taskFormError?.sourceControl.filter(
                        (_source) => _source._id !== source._id
                      );
                    setTaskFormInput((prev) => ({
                      ...prev,
                      sourceControl: updatedSource,
                    }));
                    setTaskFormError((prev) => ({
                      ...prev,
                      sourceControl: updatedErrorSource,
                    }));
                  }}
                />
              </ToolTip>
            )}
          </div>
        ))}
    </div>
  );
};
