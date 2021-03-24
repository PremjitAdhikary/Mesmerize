class SyntaxAnalyzer {

  static isTokenAnOperator = (token, allowedOperators) => {
    if (typeof token != 'string') {
      for (let op of allowedOperators) 
        if (token.name == op)
          return true;
    }
    return false;
  }
  static mandatoryTagIdentifiers = [
    'Event', 'Site', 'Date', 'Round', 'White', 'Black', 'Result'
  ];
  static optionalTagIdentifiers = [
    'Annotator', 'PlyCount', 'TimeControl', 'Time', 'Termination', 'Mode', 'SetUp', 'FEN', 
    'WhiteElo', 'BlackElo', 'WhiteTitle', 'BlackTitle', 'WhiteUSCF', 'BlackUSCF', 
    'WhiteNA', 'BlackNA', 'WhiteType', 'BlackType'
  ];

  static tagStatement = {

    matches: (tokens, tokenStart) => 
      SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart], ['L_SQ_BRKT']),

    process: (tokens, tokenStart, syntaxTree) => {
      let identifierLiteral = tokens[tokenStart+1];
      if (!SyntaxAnalyzer.mandatoryTagIdentifiers.includes(identifierLiteral)
        && !SyntaxAnalyzer.optionalTagIdentifiers.includes(identifierLiteral)) {
        throw 'Invalid Tag Identifier: ' + identifierLiteral;
      }
      if (!SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart+2], ['QUOTE'])) 
        throw 'Tag value should be in Quotes';
      
      for (let t = 3; t < tokens.length-1; t++) {
        if (typeof tokens[tokenStart + t] === 'string') 
          continue;
        
        if (SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart+t], ['QUOTE']) 
          && SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart+t+1], ['R_SQ_BRKT'])) {
          let val = tokens[tokenStart + 3];
          for (let s = 4; s < t; s++) 
            val += (' ' + tokens[tokenStart+s]);
          syntaxTree.push({
            identifier: identifierLiteral,
            value: val,
            type: 'TAG'
          });
          return tokenStart + t + 1;
        } else {
          throw 'Invalid Tag closure. Expecting "]. Found ' 
            + tokens[tokenStart+t].op 
            + tokens[tokenStart+t+1].op;
        }
      }
      return tokenStart;
    }
  };

  static illegalStatement = {
    matches: (tokens, tokenStart) => 
      SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart], 
        ['R_SQ_BRKT', 'R_CR_BRKT', 'R_BRKT', 'QUOTE']),
    process: (tokens, tokenStart, syntaxTree) => {
      throw 'Invalid sequence: ' + tokens[tokenStart].op;
    }
  };

  // regex
  static moveNumberRegex = /^\d+\.(\.{2})?$/;
  static moveNumberWhiteRegex = /^\d+\.$/;
  static moveNumberBlackRegex = /^\d+(\.{3})$/;
  static moveRegex = {
    pieceMove: "[BRQNK][a-h][1-8](\\+|#)\?",
    pieceMoveWithFileCapture: "[BRQNK][a-h]x[a-h][1-8](\\+|#)?",
    pieceMoveWithFileRankCapture: "[BRQNK][a-h][1-8]x[a-h][1-8](\\+|#)?",
    pieceMoveWithFileRank: "[BRQNK][a-h][1-8][a-h][1-8](\\+|#)?",
    pieceMoveWithFile: "[BRQNK][a-h][a-h][1-8](\\+|#)?",
    pieceMoveWithCapture: "[BRQNK]x[a-h][1-8](\\+|#)?",
    pawnMoveWithCaptureAndPromotion: "[a-h]x[a-h][1-8]=[BRQN](\\+|#)?",
    pawnMoveWithCapture: "[a-h]x[a-h][1-8](\\+|#)?",
    pawnMoveWithFileCaptureAndPromotion: "[a-h][1-8]x[a-h][1-8]=[BRQN](\\+|#)?",
    pawnMoveWithFileCapture: "[a-h][1-8]x[a-h][1-8](\\+|#)?",
    pawnMoveWithFileAndPromotion: "[a-h][1-8][a-h][1-8]=[BRQN](\\+|#)?",
    pawnMoveWithFile: "[a-h][1-8][a-h][1-8](\\+|#)?",
    pawnMoveWithPromotion: "[a-h][1-8]=[BRQN](\\+|#)?",
    pawnMove: "[a-h][1-8](\\+|#)?",
    pieceMoveWithRankCapture: "[BRQNK][1-8]x[a-h][1-8](\\+|#)?",
    pieceMoveWithRank: "[BRQNK][1-8][a-h][1-8](\\+|#)?",
    castle: "O-O(-O)?(\\+|#)\?"
  };
  static moveRegexStr = '^((' + SyntaxAnalyzer.moveRegex.pieceMove
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithFileCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithFileRankCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithFileRank
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithFile
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithCaptureAndPromotion
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithFileCaptureAndPromotion
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithFileCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithFileAndPromotion
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithFile
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMoveWithPromotion
    + ')|(' + SyntaxAnalyzer.moveRegex.pawnMove
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithRankCapture
    + ')|(' + SyntaxAnalyzer.moveRegex.pieceMoveWithRank
    + ')|(' + SyntaxAnalyzer.moveRegex.castle + '))$'
    ;
  
  static moveRegex = new RegExp(SyntaxAnalyzer.moveRegexStr, '');

  static createMove = (number, move, color) => {
    return {
      num: number,
      move: move,
      by: color,
      type: 'MOVE'
    }
  };
  static createWhiteMove = (number, move) => SyntaxAnalyzer.createMove(number, move, 'w');
  static createBlackMove = (number, move) => SyntaxAnalyzer.createMove(number, move, 'b');
  
  static moveStatement = {
    matches: (tokens, tokenStart) => {
      if (!SyntaxAnalyzer.moveNumberRegex.test(tokens[tokenStart]))
        return false;
      if (!SyntaxAnalyzer.moveRegex.test(tokens[tokenStart+1])) {
        throw 'Invalid Move Notation: ' + tokens[tokenStart+1];
      }
      return true;
    },
    process: (tokens, tokenStart, syntaxTree) => {
      let whiteMove = SyntaxAnalyzer.moveNumberWhiteRegex.test(tokens[tokenStart]);
      let blackMove = SyntaxAnalyzer.moveNumberBlackRegex.test(tokens[tokenStart]);
      let moveNum = tokens[tokenStart].replace(/\D/g, '');
      let offset = 1;
      if (whiteMove) {
        syntaxTree.push(SyntaxAnalyzer.createWhiteMove(moveNum, tokens[tokenStart + offset]));
        if (SyntaxAnalyzer.moveRegex.test(tokens[tokenStart+2])) {
          offset++;
          syntaxTree.push(SyntaxAnalyzer.createBlackMove(moveNum, tokens[tokenStart + offset]));
        }
      }
      if (blackMove) {
        syntaxTree.push(SyntaxAnalyzer.createBlackMove(moveNum, tokens[tokenStart + 1]));
      }
      return tokenStart + offset;
    }
  };

  static gameOverStatement = {
    matches: (tokens, tokenStart) => 
      (tokens[tokenStart] == '1-0' 
      || tokens[tokenStart] == '0-1' 
      || tokens[tokenStart] == '½–½'),
    process: (tokens, tokenStart, syntaxTree) => {
      syntaxTree.push({
        result: tokens[tokenStart],
        type: 'OVER'
      });
      return tokenStart + 1;
    }
  };

  static commentStatement = {
    matches: (tokens, tokenStart) => 
      SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart], ['L_CR_BRKT']),
    process: (tokens, tokenStart, syntaxTree) => {
      for (let t = 1; t < tokens.length-1; t++) {
        if (typeof tokens[tokenStart + t] === 'string') continue;
        if (SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart+t], ['R_CR_BRKT'])) {
          let val = tokens[tokenStart + 1];
          for (let s = 2; s < t; s++) 
            val += (' ' + tokens[tokenStart+s]);
          syntaxTree.push({
            value: val,
            type: 'COMMENT'
          });
          return tokenStart + t;
        } else {
          throw 'Invalid Comment closure. Expenting }. Found ' + tokens[tokenStart+t].op;
        }
      }
    }
  };

  static compoundStatement = {
    matches: (tokens, tokenStart) => 
      SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart], ['L_BRKT']),
    process: (tokens, tokenStart, syntaxTree) => {
      for (let t = 1; t < tokens.length-1; t++) {
        if (typeof tokens[tokenStart + t] === 'string') continue;
        if (SyntaxAnalyzer.isTokenAnOperator(tokens[tokenStart+t], ['R_BRKT'])) {
          let analysis = [tokens[tokenStart + 1]];
          for (let s = 2; s < t; s++) 
            analysis.push(tokens[tokenStart+s]);
          syntaxTree.push({
            branch: SyntaxAnalyzer.generateTree(analysis),
            type: 'ANALYSIS'
          });
          return tokenStart + t;
        }
      }
    }
  }

  static grammar = [
    SyntaxAnalyzer.compoundStatement, 
    SyntaxAnalyzer.illegalStatement, 
    SyntaxAnalyzer.commentStatement,
    SyntaxAnalyzer.tagStatement, 
    SyntaxAnalyzer.moveStatement,
    SyntaxAnalyzer.gameOverStatement
  ];

  static generateTree = tokens => {
    let tokenStart = 0;
    let syntaxTree = [];
    for (; tokenStart < tokens.length; tokenStart++) {
      for (let rule of SyntaxAnalyzer.grammar) {
        if (rule.matches(tokens,tokenStart)) {
          tokenStart = rule.process(tokens, tokenStart, syntaxTree);
          break;
        }
      }
    }
    return syntaxTree;
  };
}