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

  static splittables = ['(', ')', '"', "[", "]", "{", "}"];

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

    const ifValueThenElse = ( x, thenFunc, elseFunc = e => e ) => x ? thenFunc(x) : elseFunc(x);
    const splitAtStart = operator => {
      tokens.push(operator);
      Tokenizer.splitToken(tokenStr.substring(operator.op.length), tokens);
    };
    const splitAtEnd = operator => {
      Tokenizer.splitToken(tokenStr.substr(0, tokenStr.length - operator.op.length), tokens);
      tokens.push(operator);
    };
    const spillableOperators = Tokenizer.allOperators.filter(
      operator => Tokenizer.splittables.includes(operator.op));

    ifValueThenElse( 
      Tokenizer.allOperators.find(operator => tokenStr == operator.op),
      operator => tokens.push(operator), 
      () => ifValueThenElse(
        spillableOperators.find(operator => tokenStr.startsWith(operator.op)), 
        splitAtStart,
        () => ifValueThenElse(
          spillableOperators.find(operator => tokenStr.endsWith(operator.op)), 
          splitAtEnd,
          () => tokens.push(tokenStr)
        )
      )
    );
    
  };

}