import { useState } from "react";
import { getShortObjId } from "../../../../../helpers";
import { toast } from "react-toastify";
import { ToolTip } from "../../../../../components/Tooltip";
import attachmentIcon from "../../../../../assets/attachment.svg";
import deleteIcon from "../../../../../assets/delete.svg";
import shareIcon from "../../../../../assets/share.svg";
import rightCaretIcon from "../../../../../assets/rightCaret.svg";
import downCaretIcon from "../../../../../assets/downCaret.svg";
import { useSearchParams } from "react-router-dom";

export const TaskRow = ({
  task,
  initColumnState,
  viewFilters,
  selectedTasks,
  setSelectedTasks,
  setShowDeleteModal,
  setShowAttachmentModal,
  toggleFullscreen,
  setShowViewModal,
  setEditableTask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams()
  const taskId = task._id

  return (
    <>
      <tr
        key={task._id}
        onClick={() => {
          setShowViewModal(true);
          setEditableTask(task);
          searchParams.set("taskId", task._id)
          setSearchParams(searchParams)
        }}
        className="task-detail-row"
      >
        <td>
          {task?.subTasks?.length > 0 && (
            <img
              src={expanded ? downCaretIcon : rightCaretIcon}
              onClick={(evt) => {
                evt.stopPropagation();
                setExpanded((prev) => !prev);
              }}
            />
          )}
        </td>
        <td className={`task-detail-item ${toggleFullscreen}`}>{task.name}</td>
        {initColumnState.slice(1).map((filteredAttr) => {
          if (viewFilters.includes(filteredAttr)) {
            let propertyName = filteredAttr.toLowerCase();
            if (propertyName === "id") {
              return (
                <td className="task-detail-item">
                  <p>{getShortObjId(task._id)}</p>
                </td>
              );
            }
            if (filteredAttr.includes(" ")) {
              let formattedWords = filteredAttr
                .split(" ")
                .slice(1)
                .reduce(
                  (acc, curr) =>
                    acc.concat(
                      curr.slice(0, 1).toUpperCase() +
                        curr.slice(1).toLowerCase()
                    ),
                  []
                );
              let joinWords = formattedWords.join("");
              propertyName =
                filteredAttr.split(" ")[0].toLowerCase() + joinWords;
            }
            return (
              <td className="task-detail-item">
                <p>{task[propertyName]}</p>
              </td>
            );
          }
          return null;
        })}
        <td className="task-detail-item mw-5">
          <div className="actions__container d-flex align-items-center gap-2">
            <ToolTip name={"Delete"}>
              <img
                src={deleteIcon}
                className="edit-icon"
                onClick={(evt) => {
                  evt.stopPropagation();
                  setShowDeleteModal({
                    taskId: task._id,
                    show: true,
                  });
                }}
              />
            </ToolTip>
            <ToolTip name={"Attach"}>
              <img
                src={attachmentIcon}
                className="edit-icon"
                onClick={(evt) => {
                  evt.stopPropagation();
                  setShowAttachmentModal({
                    taskId: task._id,
                    show: true,
                  });
                }}
              />
            </ToolTip>
            <ToolTip name={"Copy Link"}>
              <img
                src={shareIcon}
                className="edit-icon-sm"
                onClick={async (evt) => {
                  evt.stopPropagation();
                  await navigator.clipboard.writeText(
                    `${window.location.href}&taskId=${task._id}`
                  );
                  toast.success("Task Link has been Copied");
                }}
              />
            </ToolTip>
          </div>
        </td>
        <td>
          <input
            className="cursor"
            style={{ width: "20px", height: "15px" }}
            onClick={(e) => {
              e.stopPropagation();

              const tId = task._id;

              const index = selectedTasks.indexOf(tId);

              if (index === -1) {
                setSelectedTasks((prev) => [...prev, tId]);
              } else {
                let _selectedTasks = [...selectedTasks];
                _selectedTasks.splice(index, 1);

                setSelectedTasks(_selectedTasks);
              }
            }}
            type={"checkbox"}
          />
        </td>
      </tr>
      {expanded &&
        task.subTasks.map((subTask, index) => (
          <tr
            key={subTask._id}
            onClick={(evt) => {
              evt.stopPropagation()
              setShowViewModal(true);
              setEditableTask(subTask);
              searchParams.set("taskId", task._id)
              searchParams.set("subTaskId", subTask._id)
              setSearchParams(searchParams)
            }}
            className="task-detail-row child-rows"
          >
            <td className="task-detail-item">{/* {`${index + 1}.`} */}</td>
            <td className={`task-detail-item ${toggleFullscreen}`}>
              {subTask.name}
            </td>
            {initColumnState.slice(1).map((filteredAttr) => {
              if (viewFilters.includes(filteredAttr)) {
                let propertyName = filteredAttr.toLowerCase();
                if (propertyName === "id") {
                  return (
                    <td className="task-detail-item">
                      <p>{getShortObjId(subTask._id)}</p>
                    </td>
                  );
                }
                if (filteredAttr.includes(" ")) {
                  let formattedWords = filteredAttr
                    .split(" ")
                    .slice(1)
                    .reduce(
                      (acc, curr) =>
                        acc.concat(
                          curr.slice(0, 1).toUpperCase() +
                            curr.slice(1).toLowerCase()
                        ),
                      []
                    );
                  let joinWords = formattedWords.join("");
                  propertyName =
                    filteredAttr.split(" ")[0].toLowerCase() + joinWords;
                }
                return (
                  <td className="task-detail-item">
                    <p>{subTask[propertyName]}</p>
                  </td>
                );
              }
              return null;
            })}
            <td className="task-detail-item mw-5">
              <div className="actions__container d-flex align-items-center gap-2">
                <ToolTip name={"Delete"}>
                  <img
                    src={deleteIcon}
                    className="edit-icon"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setShowDeleteModal({
                        taskId: subTask._id,
                        show: true,
                        parentTaskId: task._id,
                      });
                    }}
                  />
                </ToolTip>
                <ToolTip name={"Attach"}>
                  <img
                    src={attachmentIcon}
                    className="edit-icon"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setShowAttachmentModal({
                        taskId: subTask._id,
                        show: true,
                        parentTaskId: task._id,
                      });
                    }}
                  />
                </ToolTip>
                <ToolTip name={"Copy Link"}>
                  <img
                    src={shareIcon}
                    className="edit-icon-sm"
                    onClick={async (evt) => {
                      evt.stopPropagation();
                    
                      await navigator.clipboard.writeText(
                        `${window.location.href}&taskId=${task._id}&subTaskId=${subTask._id}`
                      );
                      toast.success("Task Link has been Copied");
                    }}
                  />
                </ToolTip>
              </div>
            </td>
            <td></td>
          </tr>
        ))}
    </>
  );
};
