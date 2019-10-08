import { pages } from '../common/pages.js';

(function() {
  const radioButtonTemplate = `
    <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">

    <style>
      :host {
        display: inline-block;
        position: relative;
        cursor: default;
      }
      :host(:hover) {
        cursor: pointer;
      }
      :host([disabled]:hover) {
        cursor: default;
      }
      :host(:focus) {
        outline: 0;
      }
      :host(:focus)::before {
        box-shadow: 0 0 1px 2px var(--secondary-color);
      }
      :host::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border: 2px solid var(--primary-muted-color);
        position: absolute;
        left: -18px;
        top: 2px;
        border-radius: 50%;
      }
      :host([disabled])::before {
        border: 2px solid var(--secondary-color);
        cursor: default;
      }
      :host([aria-checked="true"])::before {
        background: var(--primary-muted-color);
      }
      :host([disabled][aria-checked="true"])::before {
        background: var(--secondary-color);
      }
      slot {
        color: var(--secondary-color);
      }
      :host([aria-checked="true"]) slot {
        color: var(--primary-muted-color);
      }
      :host([disabled][aria-checked="true"]) slot {
        color: var(--secondary-color);
      }
    </style>

    <slot></slot>
  `;

  class RadioButton extends HTMLElement {
    static get observedAttributes() {
      return [ 'value', 'disabled' ];
    }

    constructor() {
      super();
      let shadowRadioButton = this.attachShadow({mode: 'open'});
      shadowRadioButton.innerHTML = radioButtonTemplate;
    }

    connectedCallback() {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'radio');
      }
    }

    set value(value) {
      this.setAttribute('value', value);
    }

    get value() {
      return this.getAttribute('value');
    }

    set disabled(value) {
      if (value) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

  }

  customElements.define('radio-button', RadioButton);

  const radioGroupTemplate = `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 20px;
      }
    </style>

    <slot></slot>
  `;

  class RadioGroup extends HTMLElement {

    constructor() {
      super();
      let shadowRadioGroup = this.attachShadow({mode: 'open'});
      shadowRadioGroup.innerHTML = radioGroupTemplate;
    }

    connectedCallback() {

      if (!this.hasAttribute('role')){
        this.setAttribute('role', 'radiogroup');
      }

      this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this._onClick);
    }

    _setChecked(node) {
      this._uncheckAll();
      this._checkNode(node);
      this._focusNode(node);
    }

    _uncheckAll() {
      const radioButtons = this.querySelectorAll('[role="radio"]');
      for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].setAttribute('aria-checked', 'false');
      }
    }

    _checkNode(node) {
      node.setAttribute('aria-checked', 'true');
    }

    _focusNode(node) {
      node.focus();
    }

    _onClick(e) {
      if (e.target.getAttribute('role') === 'radio' && !e.target.hasAttribute('disabled')) {
        this._setChecked(e.target);
      } else {
        // stops the event from bubling up ... requried to stop the parent element from 
        // affecting in case radio disabled
        e.stopImmediatePropagation();
        return false;
      }
    }
  }

  customElements.define('radio-group', RadioGroup);
  
})();