class SemanticAnalyzer {

  static generateGame = tree => {
    let game = new Game();
    SemanticAnalyzer.processTreeInGame(tree, game);
    return game;
  }

  static processTreeInGame = (tree, game) => {
    for (let node of tree) {
      if (node.type == 'TAG') {
        game.setTag(node.identifier, node.value);
      } else if (node.type == 'MOVE') {
        game.move(node);
      } else if (node.type == 'OVER') {
        game.setComment(game.Termination());
      } else if (node.type == 'COMMENT') {
        game.setComment(node.value);
      } else if (node.type == 'ANALYSIS') {
        let isAlernateVersion = SemanticAnalyzer.checkIfAlternateVariation(game, node);
        let subGame = new Game(game._states[
          game._states.length - (isAlernateVersion ? 2 : 1)].clone());
        SemanticAnalyzer.copyGameTags(game, subGame);
        SemanticAnalyzer.processTreeInGame(node.branch, subGame);
        game._states[game._states.length-1]._subGame = subGame;
      }
    }
    return game;
  };

  /**
   * Basically I am supporting 2 versions of analysis
   * 21. Nf4 d3 (21. Bf4 Bxf4) This is an alternate variation
   * 21. Nf4 (21... Bxf4) d3 This is a n alternate continuation
   */
  static checkIfAlternateVariation = (game, analysisNode) => {
    for (let node of analysisNode.branch) {
      if (node.type == 'MOVE') {
        return (node.num+''+node.by) === game._states[game._states.length-1]._id;
      }
    }
  };

  static copyGameTags = (source, target) => {
    target.Black = source.Black;
    target.White = source.White;
  };

}