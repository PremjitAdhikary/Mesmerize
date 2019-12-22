let canvas;

let choice;
let fight_data;
let setupLoadInitialized;
let championAnimationLoaded;
let challengerAnimationLoaded;
let play;
let fightStarted;
let fightEnded;
let allEvents;
let allEventsIndex;
let source_event_index = 0;

let champion;
let challenger;
let actionBy;
let reactionBy;
let hit;
let fightInfo;

let eventframes;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  frameRate(24);
}

function draw() {
  background(255);
  if (!fight_data) {
    drawLoadFightScreen()
    return;
  }
  if (!setupLoadInitialized) {
    champion.loadAnimationData( () => championAnimationLoaded = true );
    challenger.loadAnimationData( () => challengerAnimationLoaded = true );
    setupLoadInitialized = true;
    return;
  }
  if ((!fightStarted && setupLoadInitialized) || !play) {
    fightInfo.show();
    if (championAnimationLoaded) champion.show();
    if (challengerAnimationLoaded) challenger.show();
    return;
  }

  preprocessEvent();
  processEvent();
  postprocessEvent();
}

function drawLoadFightScreen() {
  let loadText = 'Load A Fight And Play';
  let ltWidth = textWidth(loadText);
  stroke(0);
  noFill();
  text(loadText, width/2 - ltWidth/2, 200);
}

function preprocessEvent() {
  if (eventframes == 0 && allEventsIndex < allEvents.length) {
    fightInfo.clearChampionMove();
    fightInfo.clearChallengerMove();
    let currentEvent = allEvents[allEventsIndex];
    if (currentEvent.beat == 'Tik') {
      fightInfo.updateBeat(currentEvent.count);
    }
    let subEventFrames = 0;
    let actionSubEvent;
    let actionProcessed = false;
    let reactionProcessed = false;
    for (let subEvent of currentEvent.subEvents) {
      switch(subEvent.Type) {
        case 'ACTION':
          if (actionProcessed) {
            updateFighter(subEvent);
            break;
          }
          actionSubEvent = subEvent;
          actionBy = getFighter(subEvent);
          this.updateFighterMove(subEvent);
          actionProcessed = true;
          break;
        case 'REACTION':
          if (reactionProcessed) {
            updateFighter(subEvent);
            break;
          }
          if (!actionProcessed) break;
          if(subEvent && subEvent.Event 
              && subEvent.Event['Damage Amount'] 
              && Number(subEvent.Event['Damage Amount']) <= 0) {
            hit = false;
          } else {
            hit = true;
          }
          subEventFrames = actionBy.action(actionSubEvent.Event, hit);
          updateFighter(actionSubEvent);
          let reactor = getFighter(subEvent);
          if (reactor == actionBy) { // self buff
            reactionBy = getOpponent(subEvent);
          } else {
            reactionBy = getFighter(subEvent);
            this.updateFighterMove(subEvent);
            reactionBy.reaction(subEvent.Event, subEventFrames, hit);
          }
          updateFighter(subEvent);
          eventframes += subEventFrames;
          subEventFrames = 0;
          reactionProcessed = true;
          break;
        case 'UPDATE':
          updateFighter(subEvent);
          break;
      }
    }
  }
}

function processEvent() {
  if (hit) {
    reactionBy.show();
    actionBy.show();
  } else {
    actionBy.show();
    reactionBy.show();
  }
  fightInfo.show();
}

function postprocessEvent() {
  if (eventframes > 0) {
    eventframes--;
  }
  if (allEventsIndex < allEvents.length && eventframes == 0) {
    allEventsIndex++;
  }
  if (allEventsIndex >= allEvents.length && eventframes == 0 && !fightEnded) {
    fightEnded = true;
    fightInfo.clearChampionMove();
    fightInfo.clearChallengerMove();
  }
}

function getFighter(currentEvent) {
  return champion.same(currentEvent.Source) ? champion : challenger;
}

function getOpponent(currentEvent) {
  return champion.same(currentEvent.Source) ? challenger : champion;
}

function updateFighter(currentEvent) {
  if (champion.same(currentEvent.Source)) {
    champion.update(currentEvent.Source);
    fightInfo.updateChampion(champion);
  } else if (challenger.same(currentEvent.Source)) {
    challenger.update(currentEvent.Source);
    fightInfo.updateChallenger(challenger);
  }
}

function updateFighterMove(currentEvent) {
  if (!currentEvent.Event) return;
  if (champion.same(currentEvent.Source)) {
    fightInfo.setChampionMove(currentEvent.Event['Name']);
  } else if (challenger.same(currentEvent.Source)) {
    fightInfo.setChallengerMove(currentEvent.Event['Name']);
  }
}

function setupFight() {
  champion = new Fighter(
    fight_data.SourceEvent.find(
      se => se.Event.Name == 'Fighter Added' && se.Event.As == 'Champion'
    )
    .Source,
    320 - 256, 200, true
  );
  challenger = new Fighter(
    fight_data.SourceEvent.find(
      se => se.Event.Name == 'Fighter Added' && se.Event.As == 'Challenger'
    )
    .Source,
    320 - 256, 200, false
  );
  actionBy = champion;
  reactionBy = challenger;
  hit = true;
  fightInfo = new FightInfo(champion, challenger, fight_data.Beats);
  source_event_index = 0;
  play = false;
  setupLoadInitialized = false;
  fightStarted = false;
  championAnimationLoaded = false;
  challengerAnimationLoaded = false;
  fightStarted = false;
  fightEnded = false;
}

function setupEvents() {
  allEvents = [];
  eventframes = 0;
  allEventsIndex = 0;
  for (let se of fight_data.SourceEvent) {
    if (se.Type == 'BEAT') {
      allEvents.push({
        beat: se.Event.Name,
        count: se.Event.Count,
        subEvents: []
      });
    } else if(allEvents.length>0) {
      allEvents[allEvents.length-1].subEvents.push(se);
    }
  }
}

function setBus(bus) {
  bus.register("ControlSCld", e => {
    fight_data = e.detail.fight_data;
    setupFight();
    setupEvents();
  });
  bus.register("ControlSCc", e => {
    choice = e.detail.choice;
  });
  bus.register("ControlSCpb", e => {
    play = !play;
    if (!fightStarted) fightStarted = true;
  });
}

function setData(d) {
  choice = d.choice;
}