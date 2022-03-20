class LogoLexer {

  constructor(code) {
    this.code = code;
    this.pos = 0;
    this.ch = this.code.charAt(this.pos);
  }

  nextToken() {
    while(this.ch) {
      if (this.ch == ' ') {
        this.skipWhitespace();
        continue;
      }
      if (this.ch == '[') {
        this.advance()
        return new Token(TokenTypes.LEFT_SQUARE, '[');
      }
      if (this.ch == ']') {
        this.advance()
        return new Token(TokenTypes.RIGHT_SQUARE, ']');
      }
      let word = this.getWord();
      if (word) {
        return this.getWordToken(word);
      }
      throw 'Error analysing input';
    }
    return new Token(TokenTypes.EOF, '');
  }

  skipWhitespace() {
    while (this.ch && this.ch == ' ') 
      this.advance();
  }

  advance() {
    this.pos++;
    if (this.pos > this.code.length - 1) {
      this.ch = undefined;
    } else {
      this.ch = this.code.charAt(this.pos);
    }
  }

  getWord() {
    let word = '';
    let tokenChars = [' ', '[', ']'];
    while (this.ch && !tokenChars.includes(this.ch)) {
      word += this.ch;
      this.advance();
    }
    return word;
  }

  getWordToken(word) {
    switch(word) {
      case TokenTypes.CLEAR_SCREEN: return new Token(TokenTypes.CLEAR_SCREEN, word);
      case TokenTypes.PEN_UP: return new Token(TokenTypes.PEN_UP, word);
      case TokenTypes.PEN_DOWN: return new Token(TokenTypes.PEN_DOWN, word);
      case TokenTypes.HIDE_TURTLE: return new Token(TokenTypes.HIDE_TURTLE, word);
      case TokenTypes.SHOW_TURTLE: return new Token(TokenTypes.SHOW_TURTLE, word);
      case TokenTypes.HOME: return new Token(TokenTypes.HOME, word);
      case TokenTypes.FORWARD: return new Token(TokenTypes.FORWARD, word);
      case TokenTypes.BACKWARD: return new Token(TokenTypes.BACKWARD, word);
      case TokenTypes.RIGHT: return new Token(TokenTypes.RIGHT, word);
      case TokenTypes.LEFT: return new Token(TokenTypes.LEFT, word);
      case TokenTypes.SET_XY: return new Token(TokenTypes.SET_XY, word);
      case TokenTypes.REPEAT: return new Token(TokenTypes.REPEAT, word);
    }
    return new Token(TokenTypes.WORD, word);
  }
  
}

const TokenTypes = {
  CLEAR_SCREEN: 'cs',
  WORD: "word", 
  PEN_UP: 'pu', 
  PEN_DOWN: 'pd', 
  HIDE_TURTLE: 'ht', 
  SHOW_TURTLE: 'st', 
  HOME: 'home', 
  FORWARD: 'fd', 
  BACKWARD: 'bk', 
  RIGHT: 'rt', 
  LEFT: 'lt', 
  SET_XY: 'setxy', 
  REPEAT: 'repeat', 
  LEFT_SQUARE: "[", 
  RIGHT_SQUARE: "]",
  EOF: "EOF"
};

class Token {
  constructor(type, val) {
    this.type = type;
    this.val = val;
  }

  value() { return this.val; }

  toString() { return "[" + this.type + " : " + this.value() + "]"; }
}