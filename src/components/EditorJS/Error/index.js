/**
 * Import Tool's icon
 */
// import ToolboxIcon from './svg/toolbox.sv/g';

/**
 * Build styles
 */

/**
 * @class Error
 * @classdesc Error Tool for Editor.js
 * @property {WarningData} data - Error Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Error Tool`s input and output data
 * @property {string} title - Error`s title
 * @property {string} message - Error`s message
 *
 * @typedef {object} WarningConfig
 * @description Error Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in Error`s title input
 * @property {string} messagePlaceholder - placeholder to show in Error`s message input
 */
export default class Error {
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
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FF715B" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>`,
      //   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 24 21"><g fill="none" fill-rule="evenodd" stroke-linecap="square"><g stroke="#FF715B" stroke-width="2"><g><path d="M11 7.199v3.54" transform="translate(-402 -2893) translate(403 2894)"/><path d="M10.99 14.483l-.053-.052" transform="translate(-402 -2893) translate(403 2894) rotate(-45 10.963 14.457)"/><path d="M12.02.667l9.76 16.555c.33.561.143 1.285-.42 1.615-.182.107-.39.163-.6.163H1.24c-.653 0-1.183-.528-1.183-1.18 0-.21.057-.417.164-.598L9.98.667c.33-.562 1.056-.75 1.619-.419.173.102.318.246.42.42z" transform="translate(-402 -2893) translate(403 2894)"/></g></g></g></svg>',
      title: "Error",
    };
  }

  /**
   * Allow to press Enter inside the Error
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for Error title
   *
   * @public
   * @returns {string}
   */
  //   static get DEFAULT_TITLE_PLACEHOLDER() {
  //     return 'Message';
  //   }

  /**
   * Default placeholder for Error message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return "Message";
  }

  /**
   * Error Tool`s styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-Error",
      //title: 'cdx-warning__title',
      input: this.api.styles.input,
      message: "cdx-tip",
      icon: 'cdx-icon',
      noticeBlocks: 'cdx-notice-blocks',

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

    // this.titlePlaceholder = config.titlePlaceholder || Error.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder =
      config.messagePlaceholder || Error.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      //   title: data.title || '',
      message: data.message || "",
    };
  }

  /**
   * Create Error Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make("div", [this.CSS.baseClass, this.CSS.wrapper, this.CSS.noticeBlocks]);
    const icon = this._make('div', [this.CSS.icon]);
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FF715B" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>`
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
   * Extract Error data from Error Tool element
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
   * Sanitizer config for Error Tool saved data
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
