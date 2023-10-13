// import ReactHtmlParser from "react-html-parser";
import htmlParser from "html-react-parser";

export default function Paragraph(props) {
  let { data, style, config } = props;
  if (!data) return null;
  if (!style || typeof style !== "object") style = {};

  let content = null;

  if (typeof data === "string") content = data;
  else if (
    typeof data === "object" &&
    data.text &&
    typeof data.text === "string"
  )
    content = data.text;

  return content ? (
    <div className="output-cdx-block">
      <div className="output-ce-paragraph ">
        <p>{htmlParser(content)}</p>
      </div>
    </div>
  ) : null;
}
