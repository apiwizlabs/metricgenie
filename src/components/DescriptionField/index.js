import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import Style from "../../pages/Sprintplanning/Components/EditViewTaskModal/EditViewTask.module.css";
import { Button } from "react-bootstrap";


export const DescriptionField = ({editMode, InputChangeHandler, descriptionInput, descriptionError, isEditModeProp }) => {
  const [togglePreview, setTogglePreview] = useState(false)
  const [togglePreviewNew, setTogglePreviewNew] = useState(false)
    return (
      <>
       {isEditModeProp ? 
       <div className={Style["input-group__container"]}>
            <div>
            <label className={Style["modal-input-label"]}>
              Description {editMode && <span>*</span>} 
            </label>
            {editMode && <Button
                variant="light"
                size="sm"
                onClick={() => setTogglePreview(prev => !prev) }
              >
              {togglePreview ? "Edit Markdown" : "Preview Markdown" }   
              </Button>}
              
            </div>
            {editMode ? 
            <div>
              {togglePreview ? 
              <ReactMarkdown remarkPlugins={[remarkGfm]} children={descriptionInput} className="markdown-preview"/> :
              <>
                <textarea
                placeholder="Enter task Description"
                className={`modal-textarea
                ${descriptionError && Style["modal-input-error"]
                }`}
                //  value={descriptionInput}
                value={descriptionInput}
                onChange={(evt) => InputChangeHandler(evt, "description")}
              />
               <div style={{
                color: "#b6b4b4"
               }}>Markdown is supported</div>
              </>            
              }
             </div> :
              !editMode &&
                 <ReactMarkdown remarkPlugins={[remarkGfm]} children={descriptionInput} className="markdown-preview"/>
            
            }
          </div> : 
            <div className={Style["input-group__container"]}>
            <div>
            <label className={Style["modal-input-label"]}>
              Description <span>*</span>
            </label>
              <Button
                variant="light"
                size="sm"
                onClick={() => setTogglePreviewNew(prev => !prev) }
              >
                {togglePreviewNew ? "Edit Markdown" : "Preview Markdown" }   
              </Button>
            </div>
           
          
            <div>
            {togglePreviewNew ? 
              <ReactMarkdown remarkPlugins={[remarkGfm]} children={descriptionInput} className="markdown-preview"/> :  
              <>
                <textarea
                placeholder="Enter task Description"
                className={`modal-textarea
                ${descriptionError && Style["modal-input-error"]
                }`}
                //  value={descriptionInput}
                value={descriptionInput}
                onChange={(evt) => InputChangeHandler(evt, "description")}
              />
               <div style={{
                color: "#b6b4b4"
               }}>Markdown is supported</div>
              </>            
              }             
              </div>
          </div>
          
          }
          </>
    );
};
