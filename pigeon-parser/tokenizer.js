class Tokenizer {

  static allOperators = [
    {op: '[', name: 'L_SQ_BRKT'},
    {op: ']', name: 'R_SQ_BRKT'},
    {op: '{', name: 'L_CR_BRKT'},
    {op: '}', name: 'R_CR_BRKT'},
    {op: '(', name: 'L_BRKT'},
    {op: ')', name: 'R_BRKT'},
    {op: '"', name: 'QUOTE'}
  ];

  static tokenize = str => {
    let firstPass = str.split(' ');

    let tokens = [];
    for (let fpToken of firstPass) {
      let fpTokenArr = [];
      Tokenizer.splitToken(fpToken, fpTokenArr);
      tokens.push(...fpTokenArr);
    }
    return tokens;
  };

  static splitToken = (tokenStr, tokens) => {
    let operator = Tokenizer.getOperatorTheStringStartsWith(tokenStr);
    if (operator) {
      tokens.push(operator);
      Tokenizer.splitToken(tokenStr.substring(operator.op.length), tokens);
    } else {
      operator = Tokenizer.getOperatorTheStringEndsWith(tokenStr);
      if (operator) {
        Tokenizer.splitToken(tokenStr.substr(0, tokenStr.length - operator.op.length), tokens);
        tokens.push(operator);
      } else {
        tokens.push(tokenStr);
      }
    }
  }

  static getOperatorTheStringStartsWith = tokenStr => {
    for (let operator of Tokenizer.allOperators) 
      if (tokenStr.startsWith(operator.op))
        return operator;
    return null;
  }

  static getOperatorTheStringEndsWith = tokenStr => {
    for (let operator of Tokenizer.allOperators) 
      if (tokenStr.endsWith(operator.op))
        return operator;
    return null;
  }

}