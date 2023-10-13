import htmlParser from "html-react-parser";

const renderHeaderLevel = ({ data, content }) => {
  switch (data.level) {
    case 1:
      return (
        <h1 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h1>
      );
    case 2:
      return (
        <h2 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h2>
      );
    case 3:
      return (
        <h3 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h3>
      );
    case 4:
      return (
        <h4 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h4>
      );
    case 5:
      return (
        <h5 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h5>
      );
    case 6:
      return (
        <h6 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h6>
      );
    default:
      return (
        <h4 className="output-ce-header" id={data.anchorId || ""}>
          {htmlParser(content)}
        </h4>
      );
  }
};

export default function Header(props) {
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

  if (!content) return null;
  if (
    typeof data === "object" &&
    data.level &&
    typeof data.level === "number"
  ) {
    return (
      <div className="output-cdx-block">
        {renderHeaderLevel({ data, content })}
      </div>
    );
  }
}
