/**
 * Import Tool's icon
 */
// import ToolboxIcon from './svg/toolbox.sv/g';

/**
 * Build styles
 */

/**
 * @class Info
 * @classdesc Info Tool for Editor.js
 * @property {WarningData} data - Info Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Info Tool`s input and output data
 * @property {string} title - Info`s title
 * @property {string} message - Info`s message
 *
 * @typedef {object} WarningConfig
 * @description Info Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in Info`s title input
 * @property {string} messagePlaceholder - placeholder to show in Info`s message input
 */
export default class Info {

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
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#377dff" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>',
      title: 'Info',
    };
  }

  /**
   * Allow to press Enter inside the Info
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for Info title
   *
   * @public
   * @returns {string}
   */
//   static get DEFAULT_TITLE_PLACEHOLDER() {
//     return 'Message';
//   }

  /**
   * Default placeholder for Info message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Message';
  }

  /**
   * Info Tool`s styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-Info',
      noticeBlocks: 'cdx-notice-blocks',
    //   title: 'cdx-warning__title',
      input: this.api.styles.input,
      icon: 'cdx-icon',
      message: 'cdx-tip',
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

    // this.titlePlaceholder = config.titlePlaceholder || Info.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder = config.messagePlaceholder || Info.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
    //   title: data.title || '',
      message: data.message || '',
    };
  }

  /**
   * Create Info Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper, this.CSS.noticeBlocks]);
    const icon = this._make('div', [this.CSS.icon]);
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#377dff" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>`
    const message = this._make('div', [this.CSS.input, this.CSS.message], {
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
   * Extract Info data from Info Tool element
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
   * Sanitizer config for Info Tool saved data
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
