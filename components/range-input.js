import { pages } from '../common/pages.js';

(function() {
  class RangeInputElement extends HTMLElement {
    static get observedAttributes() {
      return [ 'value', 'disabled', 'min', 'max', 'valuehidden' ];
    }

    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      this.init();
    }

    set value(value) {
      this.setAttribute('value', value);
    }

    get value() {
      return this.getAttribute('value');
    }

    set min(value) {
      if (this.getAttribute('max') < value) return;
      this.setAttribute('min', value);
      if (this.getAttribute('value') < value) {
        this.setAttribute('value', value);
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true
        }));
      }
    }

    get min() {
      return this.getAttribute('min');
    }

    set max(value) {
      if (this.getAttribute('min') > value) return;
      this.setAttribute('max', value);
      if (this.getAttribute('value') > value) {
        this.setAttribute('value', value);
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true
        }));
      }
    }

    get max() {
      return this.getAttribute('max');
    }

    set disabled(value) {
      if (value) {
        this.setAttribute('disabled', '');
        this.shadowRoot.getElementById("myRange").disabled = true;
      } else {
        this.removeAttribute('disabled');
        this.shadowRoot.getElementById("myRange").disabled = false;
      }
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    set valuehidden(value) {
      if (value) {
        this.setAttribute('valuehidden', '');
      } else {
        this.removeAttribute('valuehidden');
      }
    }

    get valuehidden() {
      return this.hasAttribute('valuehidden');
    }

    connectedCallback() {
      this.init();
    }

    init() {
      const min = this.getAttribute('min');
      const max = this.getAttribute('max');
      const step = this.getAttribute('step');
      const value = this.getAttribute('value');
      const disabled = this.hasAttribute('disabled');
      const valuehidden = this.hasAttribute('valuehidden');

      this.shadow = this.shadowRoot;
      this.shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">

      <style>
      #topHolder {
        display: inline-block;
        color: var(--primary-color);
      }
      #rangeContainer {
        display: flex;width: fit-content;
      }
      .slider_disabled {
        color: var(--secondary-color);
      }
      .slider {
        -webkit-appearance: none;
        appearance: none;
        height: 5px;
        background: var(--primary-muted-color);
        outline: none;
        opacity: 0.8;
      }
      .slider:hover {
        opacity: 1;
        cursor: pointer;
      }
      .slider:disabled {
        opacity: 0.8;
        background: var(--secondary-color);
      }
      .slider:disabled:hover {
        opacity: 0.8;
        cursor: default;
        background: var(--secondary-color);
      }
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        cursor: pointer;
        background: var(--primary-color);
      }
      .slider::-moz-range-thumb {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        cursor: pointer;
        background: var(--primary-color);
      }
      .slider:disabled::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        cursor: default;
        background: var(--secondary-color);
      }
      .slider:disabled::-moz-range-thumb {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        cursor: default;
        background: var(--secondary-color);
      }
      </style>
      <div id="topHolder"><div id="rangeContainer">
        <span>`
          +
          `<input type="range" min=${min} max=${max}`
          +
          (step ? ` step=${step} ` : ``)
          +
          (disabled ? ` disabled ` : ``)
          +
          (valuehidden ? ` valuehidden ` : ``)
          +
          ` class="slider" id="myRange">`
        +
        `</span><span id="rangeVal">${value}</span>
      </div></div>
      `;

      this.shadow.getElementById('myRange').oninput = e => {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true
        }));
      }

      this.valueDisabler(disabled);
      this.valueHider(valuehidden);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value' && newValue)  {
        this.shadow.getElementById('rangeVal').innerHTML = newValue;
        this.shadowRoot.getElementById('myRange').value = newValue;
      } else if (name === "disabled") {
        this.valueDisabler(this.hasAttribute('disabled'));
      } else if (name === 'min' && newValue && this.shadowRoot.getElementById('myRange'))  {
        this.shadowRoot.getElementById('myRange').min = newValue;
      } else if (name === 'max' && newValue && this.shadowRoot.getElementById('myRange'))  {
        this.shadowRoot.getElementById('myRange').max = newValue;
      } else if (name === "valuehidden") {
        this.valueHider(this.hasAttribute('valuehidden'));
      }
    }

    valueDisabler(disable) {
      if (disable) {
          this.shadowRoot.getElementById('rangeVal').classList.add("slider_disabled");
        } else {
          this.shadowRoot.getElementById('rangeVal').classList.remove("slider_disabled");
        }
    }

    valueHider(hide) {
      this.shadowRoot.getElementById('rangeVal').style.display = hide ? 'none' : 'block';
    }

  }
  
  customElements.define('range-input', RangeInputElement);
})();