import htmlParser from "html-react-parser";
import { objectDeepClone } from "../../../helpers";

const Table = (props) => {
  let { data, style, config } = props;
  if (!data) return null;
  if (!style || typeof style !== "object") style = {};

  let content = objectDeepClone(data.content || []);
  if (!Array.isArray(content) || !content.length) return null;

  let columnNames = [];
  if (data.withHeadings) columnNames = content.shift();

  return (
    <div className="output-cdx-block">
      <div className="output-cdx-table">
        <table className="table table-striped table-dark table-bordered">
          {columnNames.length ? (
            <thead>
              <tr>
                {columnNames.map((columnName, index) => (
                  <th key={index}>{htmlParser(columnName)}</th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {content.map((row, index) => (
              <tr key={index}>
                {Array.isArray(row) &&
                  row.length > 1 &&
                  row.map((columnValue, i) => {
                    return (
                      <td key={i}>{htmlParser(columnValue?.data || columnValue)}</td>
                    )
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
