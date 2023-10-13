/**
 * Import Tool's icon
 */
// import ToolboxIcon from './svg/toolbox.sv/g';

/**
 * Build styles
 */

/**
 * @class Success
 * @classdesc Success Tool for Editor.js
 * @property {WarningData} data - Success Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Success Tool`s input and output data
 * @property {string} title - Success`s title
 * @property {string} message - Success`s message
 *
 * @typedef {object} WarningConfig
 * @description Success Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in Success`s title input
 * @property {string} messagePlaceholder - placeholder to show in Success`s message input
 */
export default class Success {
  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Toolbox settings
   *
   * @public
   * @returns {string}
   */
  static get toolbox() {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#2DCA8C" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`,
      title: "Success",
    };
  }

  /**
   * Allow to press Enter inside the Success
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for Success title
   *
   * @public
   * @returns {string}
   */
  //   static get DEFAULT_TITLE_PLACEHOLDER() {
  //     return 'Message';
  //   }

  /**
   * Default placeholder for Success message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return "Message";
  }

  /**
   * Success Tool`s styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-Success",
      //   title: 'cdx-warning__title',
      input: this.api.styles.input,
      message: "cdx-tip",
      icon: "cdx-icon",
      noticeBlocks: "cdx-notice-blocks",
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    // this.titlePlaceholder = config.titlePlaceholder || Success.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder =
      config.messagePlaceholder || Success.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      //   title: data.title || '',
      message: data.message || "",
    };
  }

  /**
   * Create Success Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make("div", [
      this.CSS.baseClass,
      this.CSS.wrapper,
      this.CSS.noticeBlocks,
    ]);
    const icon = this._make("div", [this.CSS.icon]);
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#2DCA8C" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`;
    const message = this._make("div", [this.CSS.input, this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message,
    });
    // const message = this._make('div', [this.CSS.input, this.CSS.message], {
    //   contentEditable: !this.readOnly,
    //   innerHTML: this.data.message,
    // });

    // title.dataset.placeholder = this.titlePlaceholder;
    message.dataset.placeholder = this.messagePlaceholder;

    // container.appendChild(title);
    container.appendChild(icon);
    container.appendChild(message);

    return container;
  }

  /**
   * Extract Success data from Success Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(warningElement) {
    // const title = warningElement.querySelector(`.${this.CSS.title}`);
    const message = warningElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      //   title: title.innerHTML,
      message: message.innerHTML,
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Success Tool saved data
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      //   title: {},
      message: {},
    };
  }
}
