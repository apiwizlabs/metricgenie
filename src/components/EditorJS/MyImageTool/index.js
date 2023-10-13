import ImageTool from "@editorjs/image";
import { SprintPlanningAPI } from "../../../api/apiConfig";

class MyImageTool extends ImageTool {
  constructor(props) {
    super(props);
  }

  set image(file) {
    this._data.file = file || {};

    if (file && file.url) {
      SprintPlanningAPI.GET.downloadImage({fileKey: file.url})
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        this.ui.fillImage(url);
      })
    }
  }
}

export default MyImageTool;
