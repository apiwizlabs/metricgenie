import Style from "./TaskForm.module.css";
import addIcon from "../../../../assets/add.svg";
import { ToolTip } from "../../../../components/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import deleteIcon from "../../../../assets/delete.svg";

export const Dependency = ({
  taskFormInput,
  setTaskFormInput,
  setTaskFormError,
  taskFormError,
  editMode,
}) => {
  const [dependencyFields, setDependencyFields] = useState([]);

  useEffect(() => {
    if (taskFormInput.dependency) {
      setDependencyFields([...taskFormInput.dependency]);
    } else {
      setDependencyFields([]);
    }
  }, [taskFormInput]);

  const fieldChangeHandler = (evt, index, fieldName, _id) => {
    const updatedDependency = JSON.parse(JSON.stringify([...dependencyFields]));

    updatedDependency[index][fieldName] = evt.target.value;

    setDependencyFields(updatedDependency);
    setTaskFormInput((prev) => ({
      ...prev,
      dependency: updatedDependency,
    }));

    if (evt.target.value.length === 0) {
      const updatedDependencyValidation = [...taskFormError.dependency];

      updatedDependencyValidation[index][fieldName] = true;

      setTaskFormError((prev) => ({
        ...prev,
        dependency: updatedDependencyValidation,
      }));
    } else {
      if (taskFormError.dependency) {
        if (index === taskFormError.dependency.length) {
          setTaskFormError((prev) => ({
            ...prev,
            dependency: [
              ...prev.dependency,
              {
                [fieldName]: false,
                _id,
              },
            ],
          }));
        } else {
          const updatedDependencyValidation = [...taskFormError.dependency];
          updatedDependencyValidation[index][fieldName] = false;
          setTaskFormError((prev) => ({
            ...prev,
            dependency: updatedDependencyValidation,
          }));
        }
      } else {
        setTaskFormError((prev) => ({
          ...prev,
          dependency: [
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
          Dependencies
        </label>
        {editMode && (
          <div className={`${Style["multi-input-add-btn"]}`}>
            {/* When add dependency is clicked a set of input is added in the formInput state and form Error state  */}
            <ToolTip name={"Add dependency"} align="top">
              <button
                className="btn"
                onClick={() => {
                  const newId = uuidv4();
                  if (!taskFormInput.dependency) {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      dependency: [
                        ...dependencyFields,
                        {
                          link: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      dependency: [
                        {
                          _id: newId,
                        },
                      ],
                    }));
                  } else {
                    setTaskFormInput((prev) => ({
                      ...prev,
                      dependency: [
                        ...dependencyFields,
                        {
                          link: "",
                          _id: newId,
                        },
                      ],
                    }));

                    setTaskFormError((prev) => ({
                      ...prev,
                      dependency: [
                        ...prev.dependency,
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
      {taskFormInput.dependency &&
        taskFormInput.dependency.map((dependency, index) => (
          <div className={`${Style["multi-input-field"]}`} key={dependency._id}>
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]}`}>
                Link {editMode && <span>*</span>} :{" "}
                {!editMode && (
                  <span className={Style["modal-detail-text"]}>
                    <a
                      href={
                        dependencyFields[index]?.link
                          ? dependencyFields[index].link
                          : ""
                      }
                      target={"_blank"}
                    >
                      {dependencyFields[index]?.link
                        ? dependencyFields[index].link
                        : ""}
                    </a>
                  </span>
                )}
              </label>
              {editMode && (
                <input
                  placeholder="Enter dependency"
                  className={`${Style["modal-input"]} ${
                    taskFormError?.dependency &&
                    taskFormError?.dependency[index]?.link &&
                    Style["modal-input-error"]
                  }`}
                  type="text"
                  onChange={(evt) => {
                    fieldChangeHandler(evt, index, "link", dependency._id);
                  }}
                  value={
                    dependencyFields[index]?.link
                      ? dependencyFields[index].link
                      : ""
                  }
                />
              )}
            </div>

            {editMode && (
              <ToolTip name={"Delete dependency"} align="top">
                <img
                  src={deleteIcon}
                  className={Style["action-icon"]}
                  onClick={() => {
                    const updatedDependency = taskFormInput.dependency.filter(
                      (_dependency) => _dependency._id !== dependency._id
                    );
                    const updatedErrordependency =
                      taskFormError?.dependency.filter(
                        (_dependency) => _dependency._id !== dependency._id
                      );
                    setTaskFormInput((prev) => ({
                      ...prev,
                      dependency: updatedDependency,
                    }));
                    setTaskFormError((prev) => ({
                      ...prev,
                      dependency: updatedErrordependency,
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
