
import { pages } from '../common/pages.js';
import { recommendationEngine } from '../common/recommendation-engine.js';

(function() {
  class SketchTextElement extends HTMLElement {
    constructor() {
      super();
      this.minLinks = 3;
      this.maxLinks = 10;
      this.orderedSimilarPageIds = [];
      this.hilightedPageId = '';
    }

    connectedCallback() {
      const pageid = this.getAttribute('pageid');
      let pageName = '';
      if (!pageid && this.hasAttribute('pagename')) {
        pageName = this.getAttribute('pagename');
      } else {
        pageName = !pages.getPageById(pageid) ? 'Add Valid PageId' : pages.getPageById(pageid).name;
      }

      let pageDate = !pageid || !pages.getPageById(pageid) ? '' : pages.getFormattedDate(pageid);
  
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
      this.addSimilarityShowHide(shadow);
    }

    similar(pageid) {
      if (!pageid)
        return ``;
      let orderedSimilarPages = recommendationEngine.searchAndOrderPagesByTagsFor(pageid);
      if (orderedSimilarPages.length == 0)
        return ``;
      let s = `<div class="header">Similar Pages</div><br> 
      <div> 
      `;
      for (let c = 0; c < orderedSimilarPages.length && c < this.minLinks; c++) 
        s += this.generateLinkForPage(orderedSimilarPages[c]);
      s += `</div>
      `;
      
      if (orderedSimilarPages.length <= this.minLinks) return s;

      s += `<div id="links">
      `;
      for (let c = this.minLinks; c < orderedSimilarPages.length && c < this.maxLinks; c++)
        s += this.generateLinkForPage(orderedSimilarPages[c]);
      
      s += `</div>
      <div id="showMore"><a href="javascript:void(0)">More...</a></div>
      <div id="showLess"><a href="javascript:void(0)">Less...</a></div>
      `;
      
      return s;
    }

    generateLinkForPage(orderedSimilarPage) {
      this.orderedSimilarPageIds.push(orderedSimilarPage.id);
      let pUrl = pages.getPageById(orderedSimilarPage.id).url;
      let pName = pages.getPageById(orderedSimilarPage.id).name;
      let linkForPagesHtml = `  <div>
          <div>
            <span><a href=${pUrl}>${pName}</a></span>
            <span id=${'show_reason_for_'+orderedSimilarPage.id}>
              (<a href="javascript:void(0)">why?</a>)</span>
            <span id=${'hide_reason_for_'+orderedSimilarPage.id}>
              (<a href="javascript:void(0)">hide</a>)</span>
          </div>
          <div id=${'reason_for_'+orderedSimilarPage.id}>
          `;
      orderedSimilarPage.matchedTags.forEach(mt => 
        linkForPagesHtml += (`<em>&nbsp;&nbsp;- `+mt.description)+'</em><br>');
      linkForPagesHtml += `
          </div>
      </div>
      `;
      return linkForPagesHtml;
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

    addSimilarityShowHide(shadow) {
      let hideThisSimilarityInfo = id => {
        shadow.querySelectorAll('[id="reason_for_'+id+'"]')[0].style.display = 'none';
        shadow.querySelectorAll('[id="hide_reason_for_'+id+'"]')[0].style.display = 'none';
        shadow.querySelectorAll('[id="show_reason_for_'+id+'"]')[0].style.display = 'inline';
      };
      let hideAllSimilarityInfo = () => {
        this.orderedSimilarPageIds.forEach(id => hideThisSimilarityInfo(id));
      };
      //
      hideAllSimilarityInfo();

      let showThisSimilarityInfo = id => {
        hideAllSimilarityInfo();
        shadow.querySelectorAll('[id="reason_for_'+id+'"]')[0].style.display = 'inline';
        shadow.querySelectorAll('[id="show_reason_for_'+id+'"]')[0].style.display = 'none';
        shadow.querySelectorAll('[id="hide_reason_for_'+id+'"]')[0].style.display = 'inline';
      };

      this.orderedSimilarPageIds.forEach(id => {
        shadow.querySelectorAll('[id="show_reason_for_'+id+'"]')[0]
          .addEventListener('click', () => showThisSimilarityInfo(id));
        shadow.querySelectorAll('[id="hide_reason_for_'+id+'"]')[0]
          .addEventListener('click', () => hideThisSimilarityInfo(id));
      });
    }
  }
  
  customElements.define('sketch-text', SketchTextElement);
})();