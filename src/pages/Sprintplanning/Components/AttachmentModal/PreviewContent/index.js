import React, {useState, useMemo} from 'react';
import { SprintPlanningAPI } from '../../../../../api/apiConfig';
import { Button } from "react-bootstrap";
import Style from "../attachment.module.css";
import { Loader } from '../../../../../components/Loader';
import closeButton from "../../../../../assets/close-bold.svg"

const PreviewContent = ({attachmentFileKey}) => {
    const [previewData, setPreviewData ] = useState({url: false, isVideo: false});
    const [viewPreview, setViewPreview] = useState(false);
    const [imgFullscr, setImgFullscr] = useState(false);
    
      useMemo(()=>{
        if(viewPreview && !previewData.url){
            setPreviewData(prev => ({...prev, urlStatus: "loading" }))
            SprintPlanningAPI.GET.downloadImage({fileKey: attachmentFileKey})
            .then((res) => {
              const url = window.URL.createObjectURL(new Blob([res.data]));
              if(res.data.type.toString().includes("video")){
                setPreviewData(prev => ({isVideo: true, url: url, urlStatus: false}));
              }else{
                setPreviewData(prev => ({isVideo: false, url: url, urlStatus: false}))
              }
            })
            .catch((err) => {
              console.log("Error in downloading attachment");
            });
        }

        if(!viewPreview){
            setPreviewData(prev => ({...prev, urlStatus: false }))
        }

        return ()=>{
            setImgFullscr(false)
        }
      },[viewPreview])

  


    return (
        <div className={Style["input-group__container"]}>
            <Button
                variant="light"
                size="sm"
                onClick={() => {
                    setViewPreview(prev => !prev)
                }} >
               {viewPreview ? "Click To Hide Preview" : "Click To View Preview" }
              </Button>
              
              {previewData.urlStatus === "loading" && 
              <div className={`position-relative ${Style["h-200"]}`}>
                <Loader small="sm"/>
              </div>}

              {viewPreview &&  <div className="d-flex align-items-center">
                {(previewData.isVideo && previewData.url) ? 
                <video src={previewData.url} id="video" width="400" height="200" controls /> : 
                previewData.url && <div className="d-flex align-items-center">
                      {!imgFullscr && <img onClick={()=>{
                            setImgFullscr(true)
                        }} className={Style["img-preview"]} src={previewData.url} alt={"uploaded preview"} />}
                       {imgFullscr && <img className={`${Style["img-preview"]} ${Style["full-scr"]}`} src={previewData.url} alt={"uploaded preview"} />}
                </div>}
            </div> }

            {imgFullscr && <img src={closeButton} onClick={()=>{
                            setImgFullscr(false)
                        }} className={Style["close-img-btn"]}/>}
          
        </div>
    );
};

export default PreviewContent;