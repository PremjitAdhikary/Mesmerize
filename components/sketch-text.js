
import { pages } from '../common/pages.js';

(function() {
  class SketchTextElement extends HTMLElement {
    constructor() {
      super();
      this.maxLinks = 4;
    }

    connectedCallback() {
      const pageid = this.getAttribute('pageid');
      let pageName = '';
      if (!pageid && this.hasAttribute('pagename')) {
        pageName = this.getAttribute('pagename');
      } else {
        pageName = !pages.getPageById(pageid) ? 'Add Valid PageId' : pages.getPageById(pageid).name;
      }

      let pageDate = !pageid || !pages.getPageById(pageid) ? '' : pages.getPageById(pageid).date;
  
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">
  
      <style>
        .header {
          font-size: 1.5em;
          font-weight: bold;
          font-style: italic;
          font-variant: small-caps;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--primary-muted-color);
        }
        .dater {
          font-size: 0.8em;
          font-style: italic;
          float: right;
        }
      </style>
  
      <div>
        <div class="header">${pageName}</div>
        <div class="dater">- ${pageDate}&nbsp;&nbsp;</div>
        <slot id="contentSlot" name="content"></slot>
        <div class="header">Sources</div>
        <slot id="sourceSlot" name="source"></slot>`
        + 
        this.similar(pageid);
        +
        `
      </div>
  
      `;
      this.addMoreLessToSimilarList(shadow);
    }

    similar(pageid) {
      if (!pageid)
        return ``;
      let p = pages.getSimilarPageIds(pageid);
      if (p.length == 0)
        return ``;
      
      let s = `<div class="header">Similar Pages</div><br> 
      <div> 
      `;
      for (let c = 0; c < p.length && c < this.maxLinks; c++) 
        s += this.generateLinkForPage(p[c]);
      s += `</div>
      `;
      
      if (p.length <= this.maxLinks) return s;

      s += `<div id="links">
      `;
      for (let c = this.maxLinks; c < p.length; c++)
        s += this.generateLinkForPage(p[c]);
      
      s += `</div>
      <div id="showMore"><a href="javascript:void(0)">More...</a></div>
      <div id="showLess"><a href="javascript:void(0)">Less...</a></div>
      `;
      
      return s;
    }

    generateLinkForPage(id) {
      let pUrl = pages.getPageById(id).url;
      let pName = pages.getPageById(id).name;
      return `  <div><a href=${pUrl}>${pName}</a></div>
      `;
    }

    addMoreLessToSimilarList(shadow) {
      let links = shadow.querySelectorAll('[id="links"]');
      if (links.length === 0) return;

      let linksDiv = links[0];
      let sLess = shadow.querySelectorAll('[id="showLess"]')[0];
      let sMore = shadow.querySelectorAll('[id="showMore"]')[0];

      let hideLinks = e => {
        linksDiv.style.display = 'none';
        sLess.style.display = 'none';
        sMore.style.display = 'block';
      };
      let showLinks = e => {
        linksDiv.style.display = 'block';
        sLess.style.display = 'block';
        sMore.style.display = 'none';
      };
      sLess.addEventListener('click', hideLinks);
      sMore.addEventListener('click', showLinks);
      hideLinks();
    }
  }
  
  customElements.define('sketch-text', SketchTextElement);
})();