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
      const pageDate = pages.getPageById(this.id).date;
  
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

        .right {
          float: right;
          font-size: 0.8em;
          font-style: italic;
        }
      </style>

      <div class="container">
        <div class="header">${pageName}</div>
        <p class="mid"><a href=${pageUrl}><img src=${pageImg} alt="Preview"></a></p>
        <p>${pageDetail}</p>
        <p>
          <span><a href=${pageUrl}>Show Me</a></span>
          <span class="right">${pageDate}</span>
        </p>
      </div>
      `;
    }
  }
  
  customElements.define('page-card', CardElement);
})();