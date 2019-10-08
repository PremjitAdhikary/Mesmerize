import { pages } from '../common/pages.js';

(function() {
  class CardElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const pageName = pages.getPageById(this.id).name;
      const pageUrl = pages.getPageById(this.id).url;
      const pageDetail = pages.getPageById(this.id).detail;
      const pageImg = pages.getPageById(this.id).img;
  
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">
  
      <style>
        .container {
          display: inline-block;
          box-sizing: border-box;
          border: 1px var(--primary-muted-color) solid;
          border-radius: 5%;
          padding: 3%;
        }

        .header {
          font-size: 1.2em;
          font-weight: bold;
          font-style: italic;
          font-variant: small-caps;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--primary-muted-color);
        }

        .mid {
          text-align: center;
        }
      </style>

      <div class="container">
        <div class="header">${pageName}</div>
        <p class="mid"><img src=${pageImg}></p>
        <p>${pageDetail}</p>
        <p><a href=${pageUrl}>Show Me</a></p>
      </div>
      `;
    }
  }
  
  customElements.define('page-card', CardElement);
})();