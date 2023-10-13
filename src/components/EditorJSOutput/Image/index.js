import htmlParser from "html-react-parser";
import { useEffect, useState } from "react";
import { SprintPlanningAPI } from "../../../api/apiConfig";

const Image = ({ data, style, config }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if(data?.file?.url)
    {
      SprintPlanningAPI.GET.downloadImage({fileKey: data.file.url})
      .then(res => {
        const _url = window.URL.createObjectURL(new Blob([res.data]));
        setUrl(_url)
      })
      .catch(err => {
        setUrl(null);
      })
    }
  }, [])
  if (!style || typeof style !== "object") style = {};

  const classes = {
    stretched: data.stretched,
    withBackground: data.withBackground,
    withBorder: data.withBorder,
  };

  const classNames = (classes) => {
    return Object.entries(classes)
      .filter(([key, value]) => value)
      .map(([key, value]) => `output-image-tool--${key}`)
      .join(" ");
  };

  const imageClasses = classNames(classes);

  if (!url) return null;
  return (
    <div className="output-cdx-block ">
      <div className="output-image-tool">
        <div className={`${imageClasses} output-image-tool__image`}>
          <img
            className="output-image-tool__image-picture"
            src={url}
            alt={data.caption || ""}
          />
        </div>
        <div className="output-image-tool__caption-text">
          {htmlParser(data.caption)}
        </div>
      </div>
    </div>
  );
};

export default Image;
