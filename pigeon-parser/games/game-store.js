class GameStore {

  static allGames = () => GameStore.theGames;

  static favGames = () => GameStore.theGames.filter( g => g.fav );

  static miniGames = () => GameStore.theGames.filter( g => g.mini );

  static game = id => GameStore.theGames.find( g => g.id == id );

}

GameStore.theGames = [
  {
    id: 100,
    pgn: './games/Game_11_12-Sandy.pgn',
    name: 'Against a friend',
    fav: true,
    mini: false
  },
  {
    id: 101,
    pgn: './games/Game_20_10-Aakaar.pgn',
    name: 'Recovery after blunders',
    fav: true,
    mini: false
  },
  {
    id: 102,
    pgn: './games/Game_20_10-YeetChess.pgn',
    name: 'Power of Forks',
    fav: false,
    mini: false
  },
  {
    id: 103,
    pgn: './games/Game_20_11-Mini-Checkmate.pgn',
    name: 'A Trappy Game',
    fav: true,
    mini: true
  },
  {
    id: 104,
    pgn: './games/Game_20_10-YashGupta.pgn',
    name: 'Chances on Opponent mistakes',
    fav: false,
    mini: false
  },
  {
    id: 105,
    pgn: './games/Game_20_10-Stranger.pgn',
    name: 'Queen side vs King side attack',
    fav: false,
    mini: false
  },
  {
    id: 106,
    pgn: './games/Game_20_10-StrangerMalay.pgn',
    name: 'Another Queen vs King side attack',
    fav: false,
    mini: false
  },
  {
    id: 107,
    pgn: './games/Game_20_10-StrangerIndian.pgn',
    name: 'Castle opposite',
    fav: false,
    mini: false
  },
  {
    id: 108,
    pgn: './games/Game_20_10-NikitezRussian.pgn',
    name: 'Opponent miscalculates',
    fav: false,
    mini: false
  },
  {
    id: 109,
    pgn: './games/Game_20_10-StrangerRussian.pgn',
    name: 'A Mate to remember',
    fav: true,
    mini: false
  },
  {
    id: 110,
    pgn: './games/Game_20_11-GarudadhwajIndian.pgn',
    name: 'Nothing to Lose',
    fav: true,
    mini: false
  },
  {
    id: 111,
    pgn: './games/Game_20_11-StrangerPeru.pgn',
    name: 'Blunders to Plunder',
    fav: false,
    mini: false
  },
  {
    id: 112,
    pgn: './games/Game_20_11-StrangerUS.pgn',
    name: 'Race to finish',
    fav: false,
    mini: false
  },
  {
    id: 113,
    pgn: './games/Game_20_11-JhiPrayPhillli.pgn',
    name: 'Mistakes and more mistakes',
    fav: false,
    mini: false
  },
  {
    id: 114,
    pgn: './games/Game_20_11-StrangerIndian.pgn',
    name: 'Draw offer declined',
    fav: true,
    mini: true
  },
  {
    id: 115,
    pgn: './games/Game_20_11-HaroldPhilli.pgn',
    name: 'Costly mistakes',
    fav: false,
    mini: false
  },
  {
    id: 116,
    pgn: './games/Game_20_11-XegaUS.pgn',
    name: 'Tactical errors',
    fav: false,
    mini: false
  },
  {
    id: 117,
    pgn: './games/Game_20_11-MvhrIndia.pgn',
    name: 'Bullied the bully',
    fav: true,
    mini: true
  },
  {
    id: 118,
    pgn: './games/Game_20_11-SmyslovBrazil.pgn',
    name: 'Take Back',
    fav: false,
    mini: false
  }
];