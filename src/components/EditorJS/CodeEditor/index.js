/**
 * Build styles
 */
import loader from "@monaco-editor/loader";
import { v4 as uuidv4 } from "uuid";
import { LANGUAGES, monocoEditorOption } from "../../../helpers/constants";
import { formatEditorText } from "../../../helpers";

let monacoOptions = {
  theme: "vs-dark",
  ...monocoEditorOption,
  fontSize: 14
};

class CodeEditor {
  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill=currentColor viewBox="0 0 256 256"><path d="M43.18,128a29.78,29.78,0,0,1,8,10.26c4.8,9.9,4.8,22,4.8,33.74,0,24.31,1,36,24,36a8,8,0,0,1,0,16c-17.48,0-29.32-6.14-35.2-18.26-4.8-9.9-4.8-22-4.8-33.74,0-24.31-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.69,24-36,0-11.72,0-23.84,4.8-33.74C50.68,38.14,62.52,32,80,32a8,8,0,0,1,0,16C57,48,56,59.69,56,84c0,11.72,0,23.84-4.8,33.74A29.78,29.78,0,0,1,43.18,128ZM240,120c-23,0-24-11.69-24-36,0-11.72,0-23.84-4.8-33.74C205.32,38.14,193.48,32,176,32a8,8,0,0,0,0,16c23,0,24,11.69,24,36,0,11.72,0,23.84,4.8,33.74a29.78,29.78,0,0,0,8,10.26,29.78,29.78,0,0,0-8,10.26c-4.8,9.9-4.8,22-4.8,33.74,0,24.31-1,36-24,36a8,8,0,0,0,0,16c17.48,0,29.32-6.14,35.2-18.26,4.8-9.9,4.8-22,4.8-33.74,0-24.31,1-36,24-36a8,8,0,0,0,0-16Z"></path></svg>',
      title: "Code",
    };
  }

  static get contentless() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-code-editor",
      input: this.api.styles.input,
    };
  }

  constructor({ data, config, api }) {
    this.api = api;

    this.languageList = Object.keys(LANGUAGES);
    this.selectedLanguage = data.language || this.languageList[0];
    this.language = LANGUAGES[this.selectedLanguage];
    this.value = formatEditorText(data.text || "");

    this.data = {
      language: this.selectedLanguage,
      text: this.value,
    };

    this.id = uuidv4();

    this.editor = null;

  }

  render() {
    const container = this._make(
      "div",
      [this.CSS.wrapper, this.CSS.baseClass],
      {}
    );
    const editorWrapper = document.createElement("div");
    editorWrapper.id = this.id;

    const selectwrapper = this._make("div", this.CSS.input);
    const language = this._make("select");
    language.dataset.placeholder = "Select";

    for (let f of this.languageList) {
      let option = document.createElement("option");
      let v = document.createAttribute("value");
      let t = document.createTextNode(f);
      v.value = f;
      option.appendChild(t);
      option.setAttributeNode(v);
      language.appendChild(option);
    }

    language.value = this.languageList[0];
    selectwrapper.appendChild(language);
    container.appendChild(selectwrapper);
    container.appendChild(editorWrapper);

    language.onchange = (e) => {
      this.selectedLanguage = e.target.value;
      this.language = LANGUAGES[this.selectedLanguage];
      this.value = this.editor.getValue();
      this._initEditor();
    };

    setTimeout(() => {
      this._initEditor();
    }, 500);

    return container;
  }

  onPaste(event) {
    const content = event.detail.data;
    this.data = {
      text: content.textContent,
    };
  }

  save(codeElement) {
    let val = this.editor.getValue();
    return Object.assign(this.data, {
      text: JSON.stringify(val),
      language: this.selectedLanguage,
    });
  }

  _initEditor() {
    if (this.editor) this.editor.dispose();
    loader.init().then((monaco) => {
      const wrapper = document.getElementById(this.id);
      wrapper.style.height = "300px";
      wrapper.style.width = "100%";
      const properties = {
        ...monacoOptions,
        value: this.value,
        language: this.language,
        height: "300px",
        width: "100%"
      };

      this.editor = monaco.editor.create(wrapper, properties);
    });
  }

  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  static get pasteConfig() {
    return {
      tags: ["pre"],
    };
  }
}

export default CodeEditor;
