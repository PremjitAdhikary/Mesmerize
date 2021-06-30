import { pages } from '../common/pages.js';

(function() {

  const codeFormatterTemplate = `
    <link rel="stylesheet" href="${pages.getBase()}/appstyle.css">
    <style>
      :host {
        width: 98%;
        padding: 2%;
        font-family: Courier, 'New Courier', monospace;
        font-size: 0.8em;
        color: greenyellow;
      }
    </style>

    <slot name="code"></slot>
  `;

  const keywordColor = 'violet';
  const commentColor = 'lightgray';
  const closeTag = '</span>';
  const keywords = new Map([
    ['sql', [ 
      'create', 'update', 'delete', 'select', 'from', 'where', 'and', 'as', 'asc', 'in', 'desc', 'distinct', 
      'exists', 'group by', 'having', 'into', 'join', 'like', 'not', 'or', 'null', 'order by', 'union'
    ]], 
    ['js', [
      'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 
      'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 
      'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'of', 
      'implements', 'import', 'in', 'instanceof', 'int', 'iterface', 'let', 'long', 'native', 'new', 'null', 
      'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'this', 
      'sybchronized', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 
      'while', 'with', 'yeild', 'Array', 'Date', 'eval', 'function', 'hasOwnProperty', 'Infinity', 
      'isFinite', 'NaN', 'name', 'Number', 'Object', 'prototype', 'String', 'toString', 'undefined', 'valueOf'
    ]]
  ]);
  const htmlEntities = new Map([
    ['<', '&lt;'], ['>', '&gt;']
  ]);

  const processKeyword = (someCode, language) => {
    let processed = someCode;
    let openTag = '<span style="color: '+keywordColor+'; font-weight: bold;">';
    keywords.get(language).forEach(kw => 
      processed = processed.replace(
                              new RegExp('\\b'+kw+'\\b', 'g'), 
                              openTag+kw+closeTag
    ));
    return processed;
  };

  const processComments = (someCode) => {
    let processed = someCode;
    // picks out single line comments starting with // and enclosed in /* */, 
    // and multiline comments too
    let regexp = /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm;
    let matches = processed.match(regexp);
    if (matches) {
      let comments = [...matches];
      let openTag = '<span style="color: '+commentColor+'; font-style: italic;">';
      comments.forEach(
        comment => processed = processed.replace(comment, openTag+comment+closeTag)
      );
    }
    return processed;
  };
  
  
  const trimCodeBy = (someCode) => {
    let spacesInFront = 0;
    let calcStarted = false;
    for (let i=0; i<someCode.length; i++) {
      if (someCode[i] === ' ') {
        if (!calcStarted) calcStarted = true;
        spacesInFront++;
      } else if (calcStarted) break;
    }
    return (spacesInFront - 2);
  }
    
  const processIndentations = (someCode, spacesToTrim) => {
    let processed = '';
    let lineStart = true;
    let currentSpaces = 0;
    for (let i = 0; i < someCode.length; i++) {
      if (someCode[i] === '\n') {
        processed += '<br>';
        lineStart = true;
        currentSpaces = 0;
      } else if (lineStart && someCode[i] === ' ') {
        if (currentSpaces < spacesToTrim) {
          currentSpaces++;
        } else {
          processed += '&nbsp;';
        }
      } else {
        lineStart = false;
        processed += someCode[i];
      }
    }
    processed += '<br>'
    return processed;
  };

  const processEntities = (someCode) => {
    let processed = '';
    for (let i=0; i<someCode.length; i++) {
      if (htmlEntities.has(someCode[i])) {
        processed += htmlEntities.get(someCode[i]);
      } else {
        processed += someCode[i];
      }
    }
    return processed;
  };

  class CodeFormatter extends HTMLElement {

    constructor() {
      super();
      this._shadow = this.attachShadow({mode: 'open'});
      this._shadow.innerHTML = codeFormatterTemplate;
    }

    connectedCallback() {
      const language = this.getAttribute('language');
      let allTexts = this._shadow.querySelector( 'slot' ).assignedNodes()[0].childNodes[0].nodeValue;
      allTexts = processEntities(allTexts);
      allTexts = processComments(allTexts);
      allTexts = processIndentations(allTexts, trimCodeBy(allTexts));
      allTexts = processKeyword(allTexts, language);
      this._shadow.querySelector( 'slot' ).assignedNodes()[0].innerHTML = allTexts;
    }

  }
  
  customElements.define('code-formatter', CodeFormatter);
})();