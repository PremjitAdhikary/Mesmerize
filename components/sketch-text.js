
import { pages } from '../common/pages.js';

(function() {
  class SketchTextElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // const text = this.getAttribute('sketchtitle');
      const pageid = this.getAttribute('pageid');
      const pageName = !pages.getPageById(pageid) ? 'Add Valid PageId' : pages.getPageById(pageid).name;
  
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
      <link rel="stylesheet" href="../appstyle.css">
  
      <style>
        .header {
          font-size: 1.5em;
          font-weight: bold;
          font-style: italic;
          font-variant: small-caps;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--primary-muted-color);
        }
      </style>
  
      <div>
        <div class="header">${pageName}</div>
        <slot id="contentSlot" name="content"></slot>
        <div class="header">Sources</div>
        <slot id="sourceSlot" name="source"></slot>`
        + 
        this.similar(pageid);
        +
        `
      </div>
  
      `;
    }

    similar(pageid) {
      if (!pageid)
        return ``;
      let p = pages.getSimilarPageIds(pageid);
      if (p.size == 0)
        return ``;
      let s = `<div class="header">Similar Pages</div>
      <div> <br>`;
      p.forEach(
        id => {
          let pUrl = pages.getPageById(id).url;
          let pName = pages.getPageById(id).name;
          s += (`
          <div><a href=${pUrl}>${pName}</a></div>
        `);
        }
      );
      s += `
      </div>`;
      return s;
    }
  }
  
  customElements.define('sketch-text', SketchTextElement);
})();