import { useDispatch, useSelector } from "react-redux";
import Style from "./attachment.module.css";

import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { SprintPlanningAPI } from "../../../../api/apiConfig";
import {
  createAttachmentThunk,
  getBacklogAttachmentsThunk,
} from "../../../../app/features/Backlogs/AsyncThunks";
import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import fileDownloadIcon from "../../../../assets/file-download.svg";
import { getLoggedInUser } from "../../../../utils";

export const AttachmentModal = (props) => {
  const { showModal, setShowModal } = props;
  const [attachmentType, setAttachmentType] = useState("link");
  const [attachmentForm, setAttachmentForm] = useState({
    name: "",
    summary: "",
    docLink: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  const { actionStatus, backlogData } = useSelector((state) => state.backlogs);

  const dispatch = useDispatch();

  const addAttachment = async () => {
    const attachmentBody = {
      ...attachmentForm,
    };
    setAttachmentLoading(true);
    if (attachmentType === "link") {
      delete attachmentBody.image;
      attachmentBody.owner = getLoggedInUser().name;
      attachmentBody.ownerEmail = getLoggedInUser().email;

      const action = await dispatch(
        createAttachmentThunk({
          backlogId: showModal.backlogId,
          attachmentBody,
        })
      );

      setAttachmentLoading(true);
      setTimeout(() => {
        setShowAttachmentForm(false);
      }, 100);

      if (isFulfilled(action)) {
        // fetch current attachments only and update in frontside
        dispatch(
          getBacklogAttachmentsThunk({ backlogId: showModal.backlogId })
        );
        // dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
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
            createAttachmentThunk({
              backlogId: showModal.backlogId,
              attachmentBody,
            })
          );

          setAttachmentLoading(false);
          setTimeout(() => {
            setShowAttachmentForm(false);
          }, 100);
          if (isFulfilled(action)) {
            dispatch(
              getBacklogAttachmentsThunk({ backlogId: showModal.backlogId })
            );

            // dispatch(getSprintByIdThunk({ sprintId: currentSprintId }));
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
    SprintPlanningAPI.GET.downloadImage({ fileKey })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileKey);
        link.click();
      })
      .catch((err) => {
        console.log("Error in downloading attachment");
      });
  };

  useEffect(() => {
    if (showModal.show) {
      const res = backlogData.find(
        (backlog) => backlog._id === showModal.backlogId
      );
      setShowAttachmentForm(false)

      if (res) {
        setAttachments(res.attachments);
      } else {
        setAttachments([]);
      }
    }
  }, [showModal, backlogData]);

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
            setAttachmentForm({ name: "", summary: "", docLink: "" });
          }}
          className={`${Style["btn"]} ${Style["btn-primary"]} ${Style["attachment-new-btn"]}`}
        >
          {showAttachmentForm ? "Close" : "Add New"}
        </button>

        {/* Show the previous attachments */}
        <div className={Style["old-attachments__container"]}>
          {attachments &&
            attachments.length > 0 &&
            attachments.map((attachment) => (
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
                      <img
                        src={fileDownloadIcon}
                        className="action-icon"
                        onClick={() => {
                          downloadAttachment({ fileKey: attachment.fileKey });
                        }}
                      />
                    </div>
                  </div>
                )}

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
            ))}

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
              <label className={Style["modal-input-label"]}>DocLink</label>
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
                onChange={(evt) => {
                  setAttachmentForm((prev) => ({
                    ...prev,
                    file: evt.target.files[0],
                  }));
                }}
              />
            </div>
          )}

          <button
            className={`${Style["btn"]} ${Style["btn-primary"]}`}
            onClick={addAttachment}
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
