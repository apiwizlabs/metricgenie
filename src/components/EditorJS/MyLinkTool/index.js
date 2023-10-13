import LinkTool from "@editorjs/link";

class MyLinkTool extends LinkTool {
  constructor(props) {
    super(props);
  }

  fetchingFailed(errorMessage) {
    this.applyErrorStyle();
  }
}

export default MyLinkTool;
