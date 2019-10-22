import { pages } from '../common/pages.js';

(function() {
  class AppHeaderElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const home = pages.getBase()+'/';
      const about = pages.getBase()+'/about';
  
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">
  
      <style>
        div {
          height: 100%;
          padding-left: 1%;
        }
  
        a:link, a:visited {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 2.5em;
          font-weight: bold;
          font-style: italic;
          font-variant: small-caps;
          color: var(--primary-muted-color);
          text-decoration: none;
          opacity: 1.0;
        }
  
        a:hover, a:active {
          color: var(--primary-color);
          text-decoration: none;
        }

        .aboutClass {
          font-size: .75em;
          float: right;
          padding-right: 1%;
          padding-top: 10px;
        }
      </style>
  
      <div>
        <span><a href=${home}>Mesmerize</a></span>
        <span class="aboutClass"><a href=${about}>About</a></span>
      </div>
  
      `;
    }
  }
  
  customElements.define('app-header', AppHeaderElement);
})();