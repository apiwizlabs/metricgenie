import Style from "./TaskForm.module.css";
import addIcon from "../../../../assets/add.svg";
import { ToolTip } from "../../../../components/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import deleteIcon from "../../../../assets/delete.svg";

export const Pipeline = ({
  taskFormInput,
  setTaskFormInput,
  setTaskFormError,
  taskFormError,
  editMode,
}) => {
  const [pipelineFields, setPipelineFields] = useState([]);

  useEffect(() => {
    if (taskFormInput.pipeline) {
      setPipelineFields([...taskFormInput.pipeline]);
    } else {
      setPipelineFields([]);
    }
  }, [taskFormInput]);


  const fieldChangeHandler = (evt, index, fieldName, _id) => {
    const updatedPipeline = JSON.parse(JSON.stringify([...pipelineFields]));

    updatedPipeline[index][fieldName] = evt.target.value;

    setPipelineFields(updatedPipeline);
    setTaskFormInput((prev) => ({
      ...prev,
      pipeline: updatedPipeline,
    }));

    if (evt.target.value.length === 0) {
      const updatedPipelineValidation = [...taskFormError.pipeline];

      updatedPipelineValidation[index][fieldName] = true;

      setTaskFormError((prev) => ({
        ...prev,
        pipeline: updatedPipelineValidation,
      }));
    } else {
      if (taskFormError.pipeline) {
        if (index === taskFormError.pipeline.length) {
          setTaskFormError((prev) => ({
            ...prev,
            pipeline: [
              ...prev.pipeline,
              {
                [fieldName]: false,
                _id,
              },
            ],
          }));
        } else {
          const updatedPipelineValidation = [...taskFormError.pipeline];
          updatedPipelineValidation[index][fieldName] = false;
          setTaskFormError((prev) => ({
            ...prev,
            pipeline: updatedPipelineValidation,
          }));
        }
      } else {
        setTaskFormError((prev) => ({
          ...prev,
          pipeline: [
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
          Pipelines
        </label>
        {editMode && (
          <div className={`${Style["multi-input-add-btn"]}`}>
            {/* When add pipeline is clicked a set of input is added in the formInput state and form Error state  */}
            <ToolTip name={"Add pipeline"} align="top">
              <button
                className="btn"
                onClick={() => {
                  const newId = uuidv4();
                  if (!taskFormInput.pipeline) {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      pipeline: [
                        ...pipelineFields,
                        {
                          buildUrl: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      pipeline: [
                        {
                          _id: newId,
                        },
                      ],
                    }));
                  } else {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      pipeline: [
                        ...pipelineFields,
                        {
                          buildUrl: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      pipeline: [
                        ...prev.pipeline,
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
      {taskFormInput.pipeline &&
        taskFormInput.pipeline.map((pipeline, index) => (
          <div className={`${Style["multi-input-field"]}`} key={pipeline._id}>
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]}`}>
                Build URL {editMode && <span>*</span>} :{" "}
                {!editMode && (
                  <span className={Style["modal-detail-text"]}>
                    <a
                      href={
                        pipelineFields[index]?.buildUrl
                          ? pipelineFields[index].buildUrl
                          : ""
                      }
                      target={"_blank"}
                    >
                      {pipelineFields[index]?.buildUrl
                        ? pipelineFields[index].buildUrl
                        : ""}
                    </a>
                  </span>
                )}
              </label>
              {editMode && (
                <input
                  placeholder="Enter Build URL"
                  className={`${Style["modal-input"]} ${
                    taskFormError?.pipeline &&
                    taskFormError?.pipeline[index]?.buildUrl &&
                    Style["modal-input-error"]
                  }`}
                  type="text"
                  onChange={(evt) => {
                    fieldChangeHandler(evt, index, "buildUrl", pipeline._id);
                  }}
                  value={
                    pipelineFields[index]?.buildUrl
                      ? pipelineFields[index].buildUrl
                      : ""
                  }
                />
              )}
            </div>

            {editMode && (
              <ToolTip name={"Delete pipeline"} align="top">
                <img
                  src={deleteIcon}
                  className={Style["action-icon"]}
                  onClick={() => {
                    const updatedpipeline = taskFormInput.pipeline.filter(
                      (_pipeline) => _pipeline._id !== pipeline._id
                    );
                    const updatedErrorpipeline = taskFormError?.pipeline.filter(
                      (_pipeline) => _pipeline._id !== pipeline._id
                    );
                    setTaskFormInput((prev) => ({
                      ...prev,
                      pipeline: updatedpipeline,
                    }));
                    setTaskFormError((prev) => ({
                      ...prev,
                      pipeline: updatedErrorpipeline,
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
