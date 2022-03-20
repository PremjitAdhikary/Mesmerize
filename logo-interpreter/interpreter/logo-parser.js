/**
 * Grammar Rules
 * - expr: (term)+
 * - term: ( cs | pu | pd | home | ht | st | fd | bk | rt | lt | setxy | repeat )
 * - cs: cs
 * - pu: pu
 * - pd: pd
 * - home: home
 * - ht: ht
 * - st: st
 * - fd: fd (number)
 * - bk: bk (number)
 * - rt: rt (number)
 * - lt: lt (number)
 * - setxy: setxy (number) (number)
 * - repeat: repeat (number) LEFT_SQUARE expr RIGHT_SQUARE
 */
class LogoParser {

  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.nextToken();
  }

  parse() {
    let root = this.expr();
    return root;
  }

  expr() {
    let firstNode = this.term();
    let node = firstNode;
    while (this.currentToken.type != TokenTypes.EOF && this.currentToken.type != TokenTypes.RIGHT_SQUARE) {
      node.next = this.term();
      node = node.next;
    }
    return firstNode;
  }

  term() {
    if (LogoParser.TERM_TO_NODE_MAP.has(this.currentToken.type)) {
      return LogoParser.TERM_TO_NODE_MAP.get(this.currentToken.type)(this, this.currentToken);
    }
    throw 'Error parsing term '+this.currentToken;
  }

  monoNode(token) {
    this.eat(token.type);
    return new MonoNode(token);
  }

  uniOpNode(op) {
    this.eat(op.type);
    let value = this.numericValue();
    this.eat(TokenTypes.WORD);
    return new UniOpNode(op, value);
  }

  numericValue() {
    if (isNaN(this.currentToken.value())) {
      throw 'Error: Value should be a number';
    }
    return this.currentToken;
  }

  eat(type) {
    if (type == this.currentToken.type) {
      this.currentToken = this.lexer.nextToken();
      return;
    }
    throw 'Error parsing tokens'; 
  }

}

LogoParser.TERM_TO_NODE_MAP = new Map([
  [TokenTypes.CLEAR_SCREEN, (me, token) => me.monoNode(token)], 
  [TokenTypes.PEN_UP, (me, token) => me.monoNode(token)], 
  [TokenTypes.PEN_DOWN, (me, token) => me.monoNode(token)], 
  [TokenTypes.HOME, (me, token) => me.monoNode(token)], 
  [TokenTypes.HIDE_TURTLE, (me, token) => me.monoNode(token)], 
  [TokenTypes.SHOW_TURTLE, (me, token) => me.monoNode(token)], 
  [TokenTypes.FORWARD, (me, token) => me.uniOpNode(token)], 
  [TokenTypes.BACKWARD, (me, token) => me.uniOpNode(token)], 
  [TokenTypes.RIGHT, (me, token) => me.uniOpNode(token)], 
  [TokenTypes.LEFT, (me, token) => me.uniOpNode(token)], 
  [TokenTypes.SET_XY, (me, token) => {
    me.eat(token.type);
    let first = me.numericValue();
    me.eat(TokenTypes.WORD);
    let second = me.numericValue();
    me.eat(TokenTypes.WORD);
    return new BiOpNode(token, first, second);
  }], 
  [TokenTypes.REPEAT, (me, token) => {
    me.eat(token.type);
    let times = me.numericValue();
    me.eat(TokenTypes.WORD);
    me.eat(TokenTypes.LEFT_SQUARE);
    let operation = me.expr();
    me.eat(TokenTypes.RIGHT_SQUARE);
    return new BiOpNode(token, times, operation);
  }], 
  [TokenTypes.EOF, () => {} ]
]);

/** AST Nodes */

class MonoNode {

  constructor(token) {
    this.command = token;
  }

  toString() { return "( comm: " + this.command + " )"; }

}

class UniOpNode {

  constructor(command, token) {
    this.command = command;
    this.op = token;
  }

  toString() { return "( comm: " + this.command + " op: " + this.op + " )"; }

}

class BiOpNode {

  constructor(command, first, second) {
    this.command = command;
    this.firstOp = first;
    this.secondOp = second;
  }

  toString() { 
    return "( comm: " + this.command + " 1st: " + this.firstOp + " 2nd: " + this.secondOp + " )"; 
  }

}