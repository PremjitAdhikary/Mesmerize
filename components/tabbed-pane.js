import { pages } from '../common/pages.js';

(function() {

  const tabContentTemplate = `
    <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">
    <style>
      :host {
        width: 95%;
        padding: 2%;
      }
    </style>

    <slot></slot>
  `;

  class TabContent extends HTMLElement {
    static get observedAttributes() {
      return [ 'name', 'selected' ];
    }

    constructor() {
      super();
      let shadowTabContent = this.attachShadow({mode: 'open'});
      shadowTabContent.innerHTML = tabContentTemplate;
    }

    connectedCallback() {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'tabContent');
      }
    }

    set name(value) {
      this.setAttribute('name', value);
    }

    get name() {
      return this.getAttribute('name');
    }

    set selected(value) {
      if (value) {
        this.setAttribute('selected', '');
      } else {
        this.removeAttribute('selected');
      }
    }

    get selected() {
      return this.hasAttribute('selected');
    }
  }

  customElements.define('tab-content', TabContent);

  const tabbedPaneTemplate = `
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 96%;
        border: 1px solid var(--secondary-color);
        border-radius: 2px;
      }
      #tabs {
        display: block-inline;
        padding: 2px;
      }
      .tabSelected, .tabUnselected {
        display:inline-block;
        color: black;
        border-radius: 2px;
        padding: 2px;
        margin: 2px;
      }
      .tabSelected:hover, .tabUnselected:hover {
        cursor: pointer;
      }
      .tabSelected {
        background-color: var(--primary-muted-color);
      }
      .tabUnselected {
        background-color: var(--secondary-color);
      }
    </style>

    <div id="tabs"></div>

    <slot></slot>
  `;

  class TabbedPane extends HTMLElement {

    constructor() {
      super();
      let shadowTabbedPane = this.attachShadow({mode: 'open'});
      shadowTabbedPane.innerHTML = tabbedPaneTemplate;
    }

    connectedCallback() {

      if (!this.hasAttribute('role')){
        this.setAttribute('role', 'tabbedPane');
      }

      this.createHeaders();
      this.updateElements();
    }

    createHeaders() {
      const tabs = this.querySelectorAll(':scope > [role="tabContent"]');
      for (let i = 0; i < tabs.length; i++) {
        let span = document.createElement("span");
        span.id = 'sp_'+tabs[i].name;
        span.innerHTML = tabs[i].name;
        span.classList.add('tabUnselected');
        let curr = this;
        let clickEvent = e => {
          curr._removeAll();
          curr.querySelectorAll(':scope > [role="tabContent"]')[i].selected = true;
          curr.updateElements();
        };
        span.addEventListener('click', clickEvent);
        this.shadowRoot.querySelectorAll(':scope > [id="tabs"]')[0].appendChild(span);
      }
    }

    updateElements() {
      const tabs = this.querySelectorAll(':scope > [role="tabContent"]');
      for (let i = 0; i < tabs.length; i++) {
        let spanId = 'sp_'+tabs[i].name;
        let span = this.shadowRoot.querySelectorAll('[id="'+spanId+'"]')[0];
        if (tabs[i].selected) {
          span.classList.remove('tabUnselected');
          span.classList.add('tabSelected');
          tabs[i].style.display = 'block';
        } else {
          span.classList.remove('tabSelected');
          span.classList.add('tabUnselected');
          tabs[i].style.display = 'none';
        }
      }
    }

    _removeAll() {
      const tabs = this.querySelectorAll(':scope > [role="tabContent"]');
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].selected = null;
      }
    }
  }

  customElements.define('tabbed-pane', TabbedPane);
})();