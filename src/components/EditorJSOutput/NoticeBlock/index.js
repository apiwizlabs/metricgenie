import htmlParser from "html-react-parser";

const NoticeBlock = ({ data, style, type, icon, config, customTitle }) => {
  if (!data) return "";
  if (!style || typeof style !== "object") style = {};

  let message = null,
    title = customTitle ? customTitle : "Warning";

  if (typeof data === "string") message = data;
  else if (typeof data === "object") {
    if (data.message && typeof data.message === "string")
      message = data.message;
    if (data.title && typeof data.title === "string") title = data.title;
  }

  if (!message) return null;
  return (
    <div className="output-cdx-block">
      <div className={`output-cdx-notice-block output-cdx-${type}`}>
        {icon}
        <div>{htmlParser(message)}</div>
      </div>
    </div>
  );
};

export default NoticeBlock;
