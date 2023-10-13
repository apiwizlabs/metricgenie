import Style from "./TaskForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import addIcon from "../../../../assets/add.svg";
import { ToolTip } from "../../../../components/Tooltip";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import deleteIcon from "../../../../assets/delete.svg";
import { deleteCommentThunk } from "../../../../app/features/SprintPlanning/AsyncThunks";
import { CommentInput } from "../CommentsModal/CommentInput";
import { CommentUpdate } from "../CommentsModal/CommentEdit";
import {useSearchParams} from 'react-router-dom';
import jwtDecode from "jwt-decode";
import editIcon from "../../../../assets/edit.svg";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from 'remark-gfm'

export const Comments = ({
  editMode,
}) => {

    const { currentMilestoneData, currentSprintId, actionStatus } = useSelector(
        (state) => state.sprintPlanning
      );

  const dispatch = useDispatch();
  const [editComment, setEditComment] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();


  const getTaskComments = () => {
    if (currentMilestoneData) {
      const res = currentMilestoneData.tasks.find(
        (task) => task._id === searchParams.get("taskId")
      );
      return res ? res.comments : [];
    }
    return [];
  };

  const deleteComment = (comment) => {
    dispatch(
      deleteCommentThunk({
        sprintId: currentSprintId,
        milestoneId: currentMilestoneData._id,
        taskId: searchParams.get("taskId"),
        commentId: comment._id,
        deletedByEmail: getLoggedInUser(),
      })
    );
};

  const getLoggedInUser = () => {
    return jwtDecode(localStorage.getItem("token")).email;
  };

  return (
    <div>
      <div className={`${Style["input-group__container"]} ${Style["multi-input__container"]}`}>
        <label className={`${Style["modal-input-label"]} fs-6`}>
          Comments
        </label>
      </div>

      {editMode ?
          <div className={Style["old-comments__container"]}>
          {getTaskComments()?.map((comment) => (
                <div key={comment._id} className={Style["old-comment__container"]}>
                  <div className={Style["comment-owner__container"]}>
                    <p>
                      Commented By{" "}
                      {getLoggedInUser() === comment.ownerEmail
                        ? "you"
                        : comment.owner}
                    </p>
                    {getLoggedInUser() === comment.ownerEmail && (
                      <div className={Style["action-btn__container"]}>
                        <>
                          {!editComment && (
                            <>
                              <ToolTip name={"Delete Comment"} align="top">
                                <img
                                  src={deleteIcon}
                                  className={`${Style["action-icon"]}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteComment(comment);
                                  }}
                                />
                              </ToolTip>
                              <ToolTip name={"Edit Comment"} align="top">
                                <img
                                  src={editIcon}
                                  className={`${Style["action-icon"]}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditComment(comment._id);
                                  }}
                                />
                              </ToolTip>
                            </>
                          )}
                        </>
                      </div>
                    )}
                  </div>
                  <div className={Style["old-comment-message"]}>
                    {(!editComment || editComment !== comment._id) && (
                     <ReactMarkdown key={comment._id} remarkPlugins={[remarkGfm]} children={comment.message}/>
                    )}
                    {editComment && editComment === comment._id && (
                      <CommentUpdate
                        sprintId={currentSprintId}
                        milestoneId={currentMilestoneData._id}
                        taskId={searchParams.get("taskId")}
                        commentId={comment._id}
                        message={comment.message}
                        setEditComment={setEditComment}
                      />
                    )}
                  </div>
                </div>
              ))}
             <CommentInput
                milestoneId={currentMilestoneData._id}
                sprintId={currentSprintId}
                taskId={searchParams.get("taskId")}
                 />
            </div> :
             <div className={`${Style["old-comments__container"]}` }>
             {getTaskComments()?.map((comment) => (
                   <div key={comment._id} className={Style["old-comment__container"]}>
                     <div className={Style["comment-owner__container"]}>
                       <p>
                         Commented By{" "}
                         {getLoggedInUser() === comment.ownerEmail
                           ? "you"
                           : comment.owner}
                       </p>
                     </div>
                     <div className={Style["old-comment-message"]}>
                       {(!editComment || editComment !== comment._id) && (
                         <ReactMarkdown key={comment._id} remarkPlugins={[remarkGfm]} children={comment.message}/>
                       )}
                     </div>
                   </div>
                 ))}
                 </div>
    }

    
    </div>
  );
};
