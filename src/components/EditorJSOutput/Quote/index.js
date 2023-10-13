import htmlParser from "html-react-parser";

const Quote = (props) => {
  let { data, style, config } = props;
  if (!data) return null;
  if (!style || typeof style !== "object") style = {};

  let content = null;
  let caption = "Unknown";

  if (typeof data === "string") content = data;
  else if (
    typeof data === "object" &&
    data.text &&
    typeof data.text === "string"
  ) {
    content = data.text;
    if (data.caption && typeof data.caption === "string")
      caption = data.caption;
    if (data.alignment && typeof data.alignment === "string")
      style.textAlign = data.alignment;
  }

  if (!content) return null;

  return (
    <div className="output-cdx-block">
      <div className="output-cdx-quote">
        <div>
          <p>
            <strong>"</strong>
            {htmlParser(content)}
            <strong>"</strong>
          </p>
          <div className="output-cdx-quote-caption">{htmlParser(caption)}</div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
