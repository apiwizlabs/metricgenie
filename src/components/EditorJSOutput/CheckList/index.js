import htmlParser from "html-react-parser";

const Checklist = ({ data, style, config }) => {
  if (
    !data ||
    !data.items ||
    !Array.isArray(data.items) ||
    data.items.length < 1
  )
    return null;
  if (!style || typeof style !== "object") style = {};

  let content = [];

  if (typeof data === "object") {
    if (data.items && Array.isArray(data.items))
      content = data.items.map((item) => (
        <div
          className={`output-cdx-checklist__item ${
            item.checked ? "output-cdx-checklist__item--checked" : ""
          }`}
        >
          <div className="output-cdx-checklist__item-checkbox">
            <span className="output-cdx-checklist__item-checkbox-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className="output-cdx-checklist__item-text"
          >
            {htmlParser(item.text)}
          </div>
        </div>
      ));
  }

  if (content.length <= 0) return null;

  return (
    <div className="output-cdx-block">
      <ul className="output-cdx-checklist">{content}</ul>
    </div>
  );
};

export default Checklist;
