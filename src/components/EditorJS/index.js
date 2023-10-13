import { createReactEditorJS } from "react-editor-js";
import EDITOR_JS_TOOLS from "./tools";

export default function EditorJS(props) {
  const ReactEditorJS = createReactEditorJS();
  return (
    <>
      <ReactEditorJS
        tools={EDITOR_JS_TOOLS}
        defaultValue={props.data}
        onInitialize={(core) => {
          props.setEditorInstance(core);
        }}
      />
      {/* SVG Symbols import for editor-hyperlink icons */}
      <svg xmlns="http://www.w3.org/2000/svg">
        <symbol id="link" viewBox="-4 0 20 10" fill="currentColor">
          <path d="M6 0v2H5a3 3 0 000 6h1v2H5A5 5 0 115 0h1zm2 0h1a5 5 0 110 10H8V8h1a3 3 0 000-6H8V0zM5 4h4a1 1 0 110 2H5a1 1 0 110-2z"></path>
        </symbol>
        <symbol id="unlink" viewBox="-3 1 18 10" fill="#fff">
          <path d="M13.073 2.099l-1.448 1.448A3 3 0 009 2H8V0h1c1.68 0 3.166.828 4.073 2.099zM6.929 4l-.879.879L7.172 6H5a1 1 0 110-2h1.929zM6 0v2H5a3 3 0 100 6h1v2H5A5 5 0 115 0h1zm6.414 7l2.122 2.121-1.415 1.415L11 8.414l-2.121 2.122L7.464 9.12 9.586 7 7.464 4.879 8.88 3.464 11 5.586l2.121-2.122 1.415 1.415L12.414 7z"></path>
        </symbol>
      </svg>
    </>
  );
}
