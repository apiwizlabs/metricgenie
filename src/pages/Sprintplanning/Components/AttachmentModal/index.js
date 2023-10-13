import { useDispatch, useSelector } from "react-redux";
import Style from "./attachment.module.css";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { SprintPlanningAPI } from "../../../../api/apiConfig";
import PreviewContent from "./PreviewContent/index"
import {
  createNewAttachmentThunk,
  getSprintByIdThunk,
} from "../../../../app/features/SprintPlanning/AsyncThunks";
import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import fileDownloadIcon from "../../../../assets/file-download.svg";

export const AttachmentModal = (props) => {
  const { showModal, setShowModal } = props;
  const [attachmentType, setAttachmentType] = useState("link");
  const [downloadStatus, setDownloadStatus] = useState('');
  const [attachmentForm, setAttachmentForm] = useState({
    name: "",
    summary: "",
    docLink: "",
    file: ""
  });

  const [attachments, setAttachments] = useState([]);
  const [attachmentFormError, setAttachmentFormError] = useState({
    attachmentPresent: false
  });
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  const { currentMilestoneData, currentSprintId, actionStatus } = useSelector(
    (state) => state.sprintPlanning
  );

  const dispatch = useDispatch();

  const getLoggedInUser = () => {
    return jwtDecode(localStorage.getItem("token"));
  };

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
        return
    }
    console.log(e.target.files[0],"target")
    setAttachmentForm((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
}

  const addAttachment = async () => {
    const attachmentBody = {
      ...attachmentForm,
    };
    setAttachmentLoading(true);
    if (attachmentType === "link") {
      delete attachmentBody.file;
      attachmentBody.owner = getLoggedInUser().name;
      attachmentBody.ownerEmail = getLoggedInUser().email;

      const action = await dispatch(
        createNewAttachmentThunk({
          sprintId: currentSprintId,
          milestoneId: currentMilestoneData._id,
          taskId: showModal.taskId,
          attachmentBody,
        })
      );

      setAttachmentLoading(true);
      setTimeout(() => {
        setShowAttachmentForm(false);
      }, 100);

      if (isFulfilled(action)) {
        dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
      } else if (isRejected(action)) {
        alert("Failed to add attachment");
      }
    } else if (attachmentType === "file") {
      delete attachmentBody.docLink;
      SprintPlanningAPI.POST.uploadFile({ fileObj: attachmentBody.file })
        .then(async (res) => {
          const { key } = res.data.data;
          attachmentBody.fileKey = key;
          attachmentBody.owner = getLoggedInUser().name;
          attachmentBody.ownerEmail = getLoggedInUser().email;

          const action = await dispatch(
            createNewAttachmentThunk({
              sprintId: currentSprintId,
              milestoneId: currentMilestoneData._id,
              taskId: showModal.taskId,
              attachmentBody,
            })
          );

          setAttachmentLoading(false);
          setTimeout(() => {
            setShowAttachmentForm(false);
          }, 100);
          if (isFulfilled(action)) {
            dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
          } else if (isRejected(action)) {
            alert("Failed to add attachment");
          }
        })
        .catch((err) => {
          setAttachmentLoading(false);
          console.log("error: ", err.message);
        });
    }
  };

  const downloadAttachment = ({ fileKey }) => {
    setDownloadStatus(fileKey.toString())
    SprintPlanningAPI.GET.downloadImage({ fileKey })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        setDownloadStatus('')
        link.href = url;
        link.setAttribute("download", fileKey);
        link.click();
      })
      .catch((err) => {
        setDownloadStatus('')
        console.log("Error in downloading attachment");
      });
  };



  useEffect(() => {
    if (showModal.show && currentMilestoneData) {
      // if it is sub task it will be present in the subTasks of parent task

      let res = {}

      if(showModal.parentTaskId){
        let parentTask = currentMilestoneData.tasks.find(
          (task) => task._id === showModal.parentTaskId
        );

        res = parentTask.subTasks.find(task => task._id === showModal.taskId)
      }
      else {
        res = currentMilestoneData.tasks.find(
          (task) => task._id === showModal.taskId
        );
      }

      setShowAttachmentForm(false);

      if (res) {
        setAttachments(res.attachments);
      } else {
        setAttachments([]);
      }
    }
  }, [showModal]);

  useEffect(()=>{
    if(attachmentForm.file || attachmentForm.docLink){
      setAttachmentFormError(prev => ({...prev, attachmentPresent: true}))
    }else{
      setAttachmentFormError(prev => ({...prev, attachmentPresent: false}))
    }
  },[attachmentForm])


  useEffect(()=>{
    window.addEventListener('paste', e => {
      if (!e.clipboardData.files || e.clipboardData.files.length === 0) {
        return
    }
      setAttachmentForm((prev) => ({
        ...prev,
        file: e.clipboardData.files.item(0),
      }));
    });
  },[])

  return (
    <div
      className={`${Style["attachments__container"]} ${
        showModal.show && Style["show"]
      }`}
      onClick={(evt) => {
        evt.stopPropagation();
        setShowModal(false);
      }}
    >
      <div
        className={Style["attachment-modal__container"]}
        onClick={(evt) => {
          evt.stopPropagation();
        }}
      >
        <h1 className={Style["attachment-modal-title"]}>Attachments</h1>
        <button
          onClick={() => {
            setShowAttachmentForm((prev) => !prev);
            setAttachmentForm({ name: "", summary: "", docLink: "", file: "" });
          }}
          className={`${Style["btn"]} ${Style["btn-primary"]} ${Style["attachment-new-btn"]}`}
        >
          {showAttachmentForm ? "Close" : "Add New"}
        </button>

        {/* Show the previous attachments */}
        <div className={Style["old-attachments__container"]}>
          {attachments &&
            attachments.length > 0 &&
            attachments.map((attachment) => {
              const attachmentExt = attachment.fileKey && attachment.fileKey.split('.').slice(-1);
              const fileExts = ["jpeg", "jpg", "png", "mov", "webp", "gif", "mp4"];
              let isImgOrVideo;
              if(attachment.fileKey){
                isImgOrVideo = fileExts.some(function(fileExt) {
                  return attachmentExt.indexOf(fileExt) !== -1;
                });
              }
             
              return (
              <div
                className={Style["attachment__container"]}
                key={attachment._id}
              >
                <div className={Style["input-group__container"]}>
                  <label className={Style["modal-input-label"]}>
                    Added By:
                  </label>
                  <p className={Style["modal-detail-text"]}>
                    {attachment.owner} : {attachment.ownerEmail}
                  </p>
                </div>
                {attachment.fileKey && (
                  <div className={Style["input-group__container"]}>
                    <label className={Style["modal-input-label"]}>File:</label>
                    <div className="d-flex align-items-center">
                      <p className={Style["modal-detail-text"]}>
                        {attachment.fileKey}
                      </p>
                      {downloadStatus == attachment.fileKey ? 
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>
                      :  <img
                        src={fileDownloadIcon}
                        className="action-icon"
                        onClick={() => {
                          downloadAttachment({ fileKey: attachment.fileKey });
                        }}
                      /> }
                     
                    </div>
                  </div>
                )}

          {attachment.fileKey && isImgOrVideo && <PreviewContent attachmentFileKey={attachment.fileKey} /> }

                {attachment.docLink && (
                  <div className={Style["input-group__container"]}>
                    <label className={Style["modal-input-label"]}>
                      Doc Link:
                    </label>
                    <p className={Style["modal-detail-text"]}>
                      <a target={"_blank"} href={attachment.docLink}>
                        {attachment.docLink}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )})}

          {attachments && attachments.length === 0 && (
            <p className={Style["modal-detail-text"]}>
              No attachments, Click on Add new to add one.
            </p>
          )}

        </div>
        <div
          className={`${Style["attachment-form__container"]} ${
            showAttachmentForm ? Style["attachment-form-show"] : ""
          }`}
        >
         
          <div
            className={`${Style["input-group__container"]} flex-row`}
            key={"inline-radio"}
          >
            <Form.Check
              inline
              label="Doc Link"
              name="group1"
              type={"radio"}
              id={`inline-radio-1`}
              onChange={() => {
                setAttachmentType("link");
              }}
              checked={attachmentType === "link"}
            />
            <Form.Check
              inline
              label="File Upload"
              name="group1"
              type={"radio"}
              id={`inline-radio-2`}
              onChange={() => {
                setAttachmentType("file");
              }}
              checked={attachmentType === "file"}
            />
          </div>
          {attachmentType === "link" ? (
            <div className={Style["input-group__container"]}>
              <label className={`${Style["modal-input-label"]} ${
                attachmentFormError.name && Style["modal-input-error"]
              }`}>DocLink</label>
              <input
                placeholder="Enter Doc Link"
                className={`${Style["modal-input"]}`}
                type="text"
                value={attachmentForm.docLink}
                onChange={(evt) => {
                  setAttachmentForm((prev) => ({
                    ...prev,
                    docLink: evt.target.value,
                  }));
                }}
              />
            </div>
          ) : (
            <div className={Style["input-group__container"]}>
              <label className={Style["modal-input-label"]}>Upload File</label>
              <input
                className={`${Style["modal-input"]}`}
                type="file"
                name="file"
                // value={attachmentForm.file !== "" && attachmentForm.file }
                onChange={onSelectFile}
              />
              {attachmentForm.file && <p>{attachmentForm.file.name}</p>}
            </div>
          )}

          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            onClick={addAttachment}
            disabled={!attachmentFormError.attachmentPresent}
          >
            {attachmentLoading ? "Adding..." : "Add attachment"}
          </button>
        </div>
        <div className={Style["attachment-modal-action-btn__container"]}>
          <button
            className={`${Style["btn"]} ${Style["btn-secondary"]}`}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};