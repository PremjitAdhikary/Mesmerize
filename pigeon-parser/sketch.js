let canvas;

let parser;
let allPiecesImg;
let myImg;
let theBus;
let choice_game;
let game;
let currentStateIndex;
let totalStates;
let gameStack;

function preload() {
  allPiecesImg = loadImage('img/allPieces_v2.png');
  myImg = loadImage('img/avatar.png');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  parser = new PgnParser();
  init();
}

function init() {
  gameStack = [];
  if (parser)
    parser.loadPgn(GameStore.game(choice_game).pgn, pgnLoaded);
}

function pgnLoaded() {
  game = parser._game;
  currentStateIndex = 0;
  totalStates = game._states.length;
  theBus.dispatch("SketchPPtotal", { totalStates: totalStates });
}

function draw() {
  background(0);
  if (game) {
    game.show();
  }
}

function updateCurrentStateIndex(index) {
  currentStateIndex = index;
  game._showState = currentStateIndex;
  let subAvailable = (game._states[currentStateIndex]._subGame ? true : false);
  theBus.dispatch("SketchPPsub", { subAvailable: subAvailable });
}

function setBus(bus) {
  theBus = bus;
  bus.register("ControlPPmi", e => {
    updateCurrentStateIndex(e.detail.currentStateIndex);
  });
  bus.register("ControlPPsi", e => {
    updateCurrentStateIndex(e.detail.currentStateIndex);
  });
  bus.register("ControlPPcg", e => {
    choice_game = e.detail.choice_game;
    init();
  });
  bus.register("ControlPPls", e => {
    gameStack.push({
      game,
      currentStateIndex,
      totalStates
    });
    game = game._states[currentStateIndex]._subGame;
    totalStates = game._states.length;
    bus.dispatch("SketchPPtotalSubStates", { totalStates: totalStates });
  });
  bus.register("ControlPPlm", e => {
    let gameObj = gameStack.pop();
    gameStack.push({
      game,
      currentStateIndex,
      totalStates
    });
    game = gameObj.game;
    totalStates = game._states.length;
  });
}

function setData(d) {
  choice_game = d.choice_game;
}