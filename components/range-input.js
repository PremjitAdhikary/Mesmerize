import { pages } from '../common/pages.js';

(function() {
  class RangeInputElement extends HTMLElement {
    static get observedAttributes() {
      return [ 'value', 'disabled', 'min', 'max' ];
    }

    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
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

    connectedCallback() {
      const min = this.getAttribute('min');
      const max = this.getAttribute('max');
      const step = this.getAttribute('step');
      const value = this.getAttribute('value');
      const disabled = this.hasAttribute('disabled');

      this.shadow = this.shadowRoot;
      this.shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">

      <style>
      div {
        display: inline;
        color: var(--primary-color);
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
      <div id="rangeContainer">`
        +
        `<input type="range" min=${min} max=${max}`
        +
        (step ? ` step=${step} ` : ``)
        +
        (disabled ? ` disabled ` : ``)
        +
        ` class="slider" id="myRange">`
        +
        `
        <span id="rangeVal">${value}</span>
      </div>
      `;

      this.shadow.getElementById('myRange').oninput = e => {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true
        }));
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value' && newValue)  {
        this.shadow.getElementById('rangeVal').innerHTML = newValue;
        this.shadowRoot.getElementById('myRange').value = newValue;
      } else if (name === "disabled") {
        if (this.hasAttribute('disabled')) {
          this.shadowRoot.getElementById('rangeVal').classList.add("slider_disabled");
        } else {
          this.shadowRoot.getElementById('rangeVal').classList.remove("slider_disabled");
        }
      } else if (name === 'min' && newValue && this.shadowRoot.getElementById('myRange'))  {
        this.shadowRoot.getElementById('myRange').min = newValue;
      } else if (name === 'max' && newValue && this.shadowRoot.getElementById('myRange'))  {
        this.shadowRoot.getElementById('myRange').max = newValue;
      }
    }

  }
  
  customElements.define('range-input', RangeInputElement);
})();