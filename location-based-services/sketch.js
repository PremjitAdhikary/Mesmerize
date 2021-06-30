let canvas;

let debug = false;
let cool = false;

let app = null;
let locationMap;
let mapData;
let mapIndex = 0;

let currentDb = null;
let position;

let joints;
let foundJoints;
let jointsQuadTree;
let jointsHilbert;
let jointsGeohash;
let jointsDb = new Map();

let cabs;
let foundCabs;
let cabsHilbert;
let cabsGeohash;
let cabsDb = new Map();

let dispatch;
let dispatchQ;
let delay;
let maxDelay = 30;
let locUpdateCount = 0;
let maxLocUpdateCount = 20;

function preload() {
  mapData = loadJSON('./locations/data/map-data.json');
}

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');

  locationMap = RegionizedMap.mapBuilder(mapData.maps[mapIndex]);
  setupJoints();
  setupCabs();
  initDispatch();

  position = createVector(width/2, height/2);
  updatePosition();

  debugBg = new SketchColor(203, 247, 207).stringify();
}

function setupJoints() {
  joints = LocationAssigner.jointsOnMap(locationMap);

  jointsQuadTree = new QuadtreeImpl();
  joints.forEach( j => jointsQuadTree.addLocation(j) );
  jointsDb.set('qt', jointsQuadTree);

  jointsHilbert = new HilbertCurveImpl();
  joints.forEach( j => jointsHilbert.addLocation(j) );
  jointsDb.set('hc', jointsHilbert);

  jointsGeohash = new PseudoGeoHash();
  joints.forEach( j => jointsGeohash.addLocation(j) );
  jointsDb.set('gh', jointsGeohash);
}

function setupCabs() {
  cabs = LocationAssigner.cabsOnMap(locationMap);

  cabsHilbert = new HilbertCurveImpl();
  cabs.forEach( c => cabsHilbert.addLocation(c) );
  cabsDb.set('hc', cabsHilbert);

  cabsGeohash = new PseudoGeoHash();
  cabs.forEach( c => cabsGeohash.addLocation(c) );
  cabsDb.set('gh', cabsGeohash);
}

function initDispatch() {
  dispatchQ = [];
  delay = maxDelay;
}

function draw() {
  if (debug) {
    background(240);
  } else {
    locationMap.render();
  }
  if (currentDb) {
    currentDb.render();
    if (debug) 
      currentDb.renderResults();
  }
  if (app != null && app === 'NearBar')
    joints.forEach( j => j.render() );

  if (app != null && app === 'NearCar') {
    cabs.forEach( c => {
      c.moveTo();
      c.render();
      if (c.onLocation()) {
        c.setDestination(LocationAssigner.nextDestination(c, locationMap, 100));
        if (random(1) > 0.8) c.setHired();
      }
    } );
  }
  showPosition();
  checkDispatchQ();
  updateCabsDb();
}

function updateCabsDb() {
  locUpdateCount++;
  if (locUpdateCount < maxLocUpdateCount) return;
  cabs.forEach( c => {
    cabsGeohash.updateLocation(c);
    cabsHilbert.updateLocation(c);
  } );
  locUpdateCount = 0;
}

function checkDispatchQ() {
  delay--;
  if (delay == 0 && dispatchQ.length > 0) {
    let { eName, eObj } = dispatchQ.pop();
    dispatch(eName, eObj);
    delay = maxDelay;
  } else if (delay == 0 || dispatchQ.length == 0) {
    delay = maxDelay;
  }
}

function showPosition() {
  stroke(10);
  strokeWeight(6);
  point(position.x, position.y);
  strokeWeight(2);
  noFill();
  circle(position.x, position.y, 10);
}

function mousePressed() {
  if (mouseInCanvas()) {
    position = createVector(Math.round(mouseX), Math.round(mouseY));
    updatePosition();
  }
}

function updatePosition() {
  dispatchQ.push({ eName: 'SketchPM', eObj: { 
    position, 
    bg: mapData.maps[mapIndex].bg, 
    isLand: !locationMap._noMansRegions.some( r => r.pointInRegion(position) )
  } })
}

function setDebug() {
  updateDebug(true);
}

function unsetDebug() {
  updateDebug(false);
}

function updateDebug(val) {
  debug = val; let color = val ? 
    SketchColor.yellow().alpha(0.3).stringify() : SketchColor.white().alpha(0.6).stringify();
  Array.from(jointsDb.values()).forEach( db => db._queryColor = color );
  Array.from(cabsDb.values()).forEach( db => db._queryColor = color );
}

function setCool() {
  cool = true;
  jointsHilbert.coolOn();
  cabsHilbert.coolOn();
}

function unsetCool() {
  cool = false;
  jointsHilbert.coolOff();
  cabsHilbert.coolOff();
}

function setBus(bus) {
  bus.register('SketchFJ', e => {
    foundJoints = currentDb.findLocations(position, e.detail.range);
    dispatchQ.push({ eName: 'SketchFJR', eObj: { foundJoints } });
  });
  bus.register('SketchFC', e => {
    foundCabs = currentDb.findLocations(position, e.detail.range);
    dispatchQ.push({ eName: 'SketchFCR', eObj: { foundCabs } });
  });
  bus.register('SketchAL', e => {
    app = e.detail.app;
    if (app && app === 'NearBar') {
      currentDb = jointsDb.get(e.detail.db);
    } else if (app && app === 'NearCar') {
      currentDb = cabsDb.get(e.detail.db);
    }
    if (app) currentDb.resetQuery();
  });
  bus.register('SketchAC', e => {
    app = null;
    currentDb = null;
  });
  bus.register('ControlLBSd', e => {
    if (e.detail.debugOn) setDebug();
    else unsetDebug();
  });
  bus.register('ControlLBSc', e => {
    if (e.detail.coolOn) setCool();
    else unsetCool();
  });
  dispatch = (eName, eObj) => bus.dispatch(eName, eObj);
}