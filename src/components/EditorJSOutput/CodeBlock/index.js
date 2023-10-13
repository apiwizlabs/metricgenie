
import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import { formatEditorText } from "../../../helpers";
import { LANGUAGES, monocoEditorOption } from "../../../helpers/constants";


const CodeBlock = (props) => {
  let [showEditor, setShowEditor] = useState(false);
  let language = props.data.language ? props.data.language : "Javascript";
  let text = props.data.text || "";
  let lineNumber = 10;
  if (text) {
    text = formatEditorText(text);
    lineNumber = text.split('\n').length || 10;
  }

  useEffect(() => {
    setShowEditor(false);
    setTimeout(() => {
      setShowEditor(true);
    }, 500);
  }, []);
  return (
    <div className="output-cdx-block">
      <div className="output-cdx-code-editor">
        <div className="output-code-lang-tab bg-theme-surface-875">
          <div className="output-code-lang-text bg-theme-surface-base">{language}</div>
        </div>
        {showEditor ? (
          <div className={`editor-bg-transparent editor-no-scroll ${props.applyTheme ? "bg-theme-surface-base" : "surface-900"}` }>
            <Editor
              width="100%"
              height={(lineNumber * 21)+ 12 + 12 + 2}
              language={LANGUAGES[language]}
              theme={"vs-light"}
              options={{ ...monocoEditorOption, readOnly: true, fontSize: 14, fontFamily: "monospace" }}
              value={text ? text : ""}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CodeBlock;
