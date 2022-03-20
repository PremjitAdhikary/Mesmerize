import { pages } from './pages.js';

/**
 * Contains logic to perform search and sort. 
 * 
 * Search can be a free text search or a mql search.
 * 
 * For mql searches, utilizes a custom interpretor (Lexer + Parser + Token + AST) to validate search term 
 * and perform search.
 */
class SearchEngine {

  constructor() { }

  allSortBys() {
    return [SearchEngine.SORT_NEW, SearchEngine.SORT_OLD, SearchEngine.SORT_RANK];
  }

  orderPages(sortBy, allPages = pages.getAllPagesId().slice()) {
    switch(sortBy) {
      case SearchEngine.SORT_NEW:
        return allPages.reverse();
      case SearchEngine.SORT_OLD:
        return allPages;
      case SearchEngine.SORT_RANK:
        return [
          ...this.searchByRank(1, allPages).reverse(), 
          ...this.searchByRank(2, allPages).reverse(),
          ...this.searchByRank(3, allPages).reverse(), 
          ...this.searchByRank(4, allPages).reverse()
        ];
      default:
        console.error('Illegal Sort By passed');
        return [];
    }
  }

  search(term, sortBy) {
    let results;
    if (this.isMQL(term)) {
      results = this.mqlSearch(term);
    } else {
      results = this.freeTextSearch(term, sortBy);
    }
    return this.orderPages(sortBy, results);
  }

  isMQL(term) {
    return term.startsWith('mql:')
  }

  freeTextSearch(term) {
    return [...new Set([
      ...this.searchByName(term), ...this.searchByTag(term)
    ])];
  }

  searchByName(name, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).name.toLowerCase().includes(name.toLowerCase()));
  }

  searchByTag(tag, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).tag.find( t=> t.includes(tag.toLowerCase())));
  }

  mqlSearch(term) {
    let sTerm = term.slice(4).trim();
    let parser = new Parser(new Lexer(sTerm));
    return this.evaluate(parser.parse());
  }

  evaluate(node) {
    if (node instanceof BinaryOpNode) {
      let left = this.evaluate(node._left);
      let right = this.evaluate(node._right);
      return node._op._type == TokenTypes.AND ? this.intersection(left, right) : this.union(left, right);
    }
    if (node instanceof MonoNode) {
      if (node._op._type == TokenTypes.IDS) 
        return node._op.val();
      if (node._op._type == TokenTypes.LATEST)
        return this.latestPages();
      if (node._op._type == TokenTypes.INTERNAL)
        return this.internalPages();
      return [];
    }
    if (node instanceof UnaryOpNode) {
      switch (node._op._type) {
        case TokenTypes.TAG:
          return this.searchByTagExactMatch(node._down.val());
        case TokenTypes.RANK:
          return this.searchByRank(parseInt(node._down.val()));
        case TokenTypes.MONTH:
          return this.searchByMonth(node._down.val());
        case TokenTypes.YEAR:
          return this.searchByYear(node._down.val());
        case TokenTypes.NOT:
          return this.difference(pages.getPublishedPagesId().slice(), this.evaluate(node._down));
      }
      return [];
    }
  }

  intersection = (a, b) => a.filter(x => b.includes(x));
  difference = (a, b) => a.filter(x => !b.includes(x));
  union = (a,b) => [...new Set([...a, ...b])];

  searchByTagExactMatch(tag, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).tag.includes(tag.toLowerCase()));
  }

  searchByRank(rank, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).rank == rank);
  }

  latestPages() {
    return pages._latest.slice();
  }

  internalPages() {
    return pages.getAllPagesId().filter(pid => pages.getPageById(pid).internal);
  }

  searchByMonth(month, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).date.toLowerCase().startsWith(month.toLowerCase()));
  }

  searchByYear(year, allPages = pages.getPublishedPagesId().slice()) {
    return allPages.filter(pid => pages.getPageById(pid).date.toLowerCase().endsWith(year.toLowerCase()));
  }

  getSimilarPages(pageId) {
    let scoreMap = new Map();
    let myPages = pages._pages;
    if (!pages._pagesMap[pageId]) 
      return [];
    
    pages.getPageById(pageId).tag
      .forEach(t => 
        myPages
          .filter(p => p.id != pageId && p.tag.includes(t))
          .forEach(p => 
            scoreMap.has(p.id) ? 
              scoreMap.set(p.id, scoreMap.get(p.id) + pages._allTags[t].weight) : 
              scoreMap.set(p.id, pages._allTags[t].weight)
          )
      );
    
    let similarPids = Array.from(scoreMap.keys());
    similarPids.sort((a, b) => scoreMap.get(b) - scoreMap.get(a));

    return similarPids;
  }

}

SearchEngine.SORT_NEW = 'new';
SearchEngine.SORT_OLD = 'old';
SearchEngine.SORT_RANK = 'rank';

export let searchEngine = new SearchEngine();

const TokenTypes = {
  IDS: "ids",
  WORD: "word",
  TAG: "tag",
  MONTH: "mth",
  YEAR: "yr",
  RANK: "rank",
  LATEST: "latest",
  INTERNAL: "internal",
  NOT: "not",
  AND: "and",
  OR: "or",
  LPAREN: "(",
  RPAREN: ")",
  EOF: "EOF"
};

class Token {
  constructor(type, val) {
    this._type = type;
    this._val = val;
  }

  val() {
    if (this._type == TokenTypes.IDS) {
      let ids = [];
      for (let id of this._val.split(',')) 
        ids.push(parseInt(id.trim()));
      return ids;
    }
    return this._val;
  }

  toString() {
    return "[" + this._type + " : " + this.val() + "]";
  }
}

class Lexer {

  constructor(text) {
    this._text = text;
    this._pos = 0;
    this._ch = this._text.charAt(this._pos);
  }

  nextToken() {
    while(this._ch) {
      if (this._ch == ' ') {
        this.skipWhitespace();
        continue;
      }
      if (this._ch == '"') {
        return new Token(TokenTypes.WORD, this.getWords());
      }
      if (this._ch == '[') {
        return new Token(TokenTypes.IDS, this.getIds());
      }
      if (this._ch == '(') {
        this.advance()
        return new Token(TokenTypes.LPAREN, '(');
      }
      if (this._ch == ')') {
        this.advance()
        return new Token(TokenTypes.RPAREN, ')');
      }
      let word = this.getWord();
      if (word) {
        return this.getWordToken(word);
      }
      throw 'Error analysing input';
    }
    return new Token(TokenTypes.EOF, '');
  }

  getWordToken(word) {
    switch(word) {
      case TokenTypes.TAG: return new Token(TokenTypes.TAG, word);
      case TokenTypes.MONTH: return new Token(TokenTypes.MONTH, word);
      case TokenTypes.YEAR: return new Token(TokenTypes.YEAR, word);
      case TokenTypes.RANK: return new Token(TokenTypes.RANK, word);
      case TokenTypes.LATEST: return new Token(TokenTypes.LATEST, word);
      case TokenTypes.INTERNAL: return new Token(TokenTypes.INTERNAL, word);
      case TokenTypes.AND: return new Token(TokenTypes.AND, word);
      case TokenTypes.OR: return new Token(TokenTypes.OR, word);
      case TokenTypes.NOT: return new Token(TokenTypes.NOT, word);
    }
    return new Token(TokenTypes.WORD, word);
  }

  skipWhitespace() {
    while (this._ch && this._ch == ' ') 
      this.advance();
  }

  getWords() {
    return this.getCharSequenceTill('"', true);
  }

  getIds() {
    return this.getCharSequenceTill(']', true);
  }

  getWord() {
    let word = '';
    let tokenChars = [' ', '(', ')'];
    while (this._ch && !tokenChars.includes(this._ch)) {
      word += this._ch;
      this.advance();
    }
    return word;
  }

  getCharSequenceTill(ch) {
    this.advance();
    let charSeq = '';
    while (this._ch && ch != this._ch) {
      charSeq += this._ch;
      this.advance();
    }
    this.advance();
    return charSeq;
  }

  advance() {
    this._pos++;
    if (this.pos > this._text.length - 1) {
      this._ch = undefined;
    } else {
      this._ch = this._text.charAt(this._pos);
    }
  }
}

const theMonths = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];

/**
 * Grammar Rules: 
 * expr: term ( (and | or) term )*
 * term: ( not term ) | ( ids | latest | tag | rank | month | year ) | (LPAREN expr RPAREN)
 * ids: [ ID, ID, ID ]
 * latest: latest
 * internal: internal
 * tag: tag word
 * rank: rank (1|2|3|4)
 * month: mth (jan | feb | ... | dec)
 * year: yr (dddd)
 */
class Parser {

  constructor(lexer) {
    this._lexer = lexer;
    this._currentToken = this._lexer.nextToken();
  }

  parse() {
    let root = this.expr();
    return root;
  }

  expr() {
    let node = this.term();
    while (this._currentToken._type == TokenTypes.AND || this._currentToken._type == TokenTypes.OR) {
      let op = this._currentToken;
      this.eat(op._type);
      node = new BinaryOpNode(op, node, this.term());
    }
    return node;
  }

  term() {
    let op = this._currentToken;
    switch(op._type) {
      case TokenTypes.IDS:
      case TokenTypes.LATEST:
        this.eat(op._type);
        return new MonoNode(op);
      case TokenTypes.INTERNAL:
        this.eat(op._type);
        return new MonoNode(op);
      case TokenTypes.TAG:
        return this.tag(op);
      case TokenTypes.RANK:
        return this.rank(op);
      case TokenTypes.MONTH:
        return this.month(op);
      case TokenTypes.YEAR:
        return this.year(op);
      case TokenTypes.LPAREN:
        this.eat(TokenTypes.LPAREN);
        let node = this.expr();
        this.eat(TokenTypes.RPAREN);
        return node;
      case TokenTypes.NOT:
        this.eat(TokenTypes.NOT);
        let nodeNot = this.term();
        return new UnaryOpNode(op, nodeNot);
    }
    throw 'Error parsing term';
  }

  tag(op) {
    this.eat(TokenTypes.TAG);
    let word = this._currentToken;
    this.eat(TokenTypes.WORD);
    return new UnaryOpNode(op, word);
  }

  rank(op) {
    this.eat(TokenTypes.RANK);
    if (isNaN(this._currentToken.val())) {
      throw 'Error: Rank value should be [1-4]';
    }
    let rank = this._currentToken;
    this.eat(TokenTypes.WORD);
    return new UnaryOpNode(op, rank);
  }

  month(op) {
    this.eat(TokenTypes.MONTH);
    if (!theMonths.includes(this._currentToken.val().toLowerCase())) {
      throw 'Error: Enter a valid Month in mmm format';
    }
    let month = this._currentToken;
    this.eat(TokenTypes.WORD);
    return new UnaryOpNode(op, month);
  }

  year(op) {
    this.eat(TokenTypes.YEAR);
    if (isNaN(this._currentToken.val())) {
      throw 'Error: Year value should be a number';
    }
    if (parseInt(this._currentToken._val) < 1000) {
      throw 'Error: Enter a valid Year in yyyy format';
    }
    let year = this._currentToken;
    this.eat(TokenTypes.WORD);
    return new UnaryOpNode(op, year);
  }

  eat(type) {
    if (type == this._currentToken._type) {
      this._currentToken = this._lexer.nextToken();
      return;
    }
    throw 'Error parsing tokens'; 
  }
}

/** AST Nodes */

class MonoNode {

  constructor(token) {
    this._op = token;
  }

}

class UnaryOpNode {

  constructor(op, token) {
    this._op = op;
    this._down = token;
  }

}

class BinaryOpNode {

  constructor(op, left, right) {
    this._op = op;
    this._left = left;
    this._right = right;
  }

}
