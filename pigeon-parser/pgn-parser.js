class PgnParser {

  loadPgn(pgnPath, callback) {
    let me = this;
    loadStrings(pgnPath, pgn => {
      me.parsePgn(pgn);
      callback();
    });
  }

  parsePgn(pgn) {
    this._pgn = pgn;
    let tokens = [];
    for (let str of this._pgn) {
      tokens.push(...Tokenizer.tokenize(str));
    }
    let tree = SyntaxAnalyzer.generateTree(tokens);
    this._game = SemanticAnalyzer.generateGame(tree);
  }

}