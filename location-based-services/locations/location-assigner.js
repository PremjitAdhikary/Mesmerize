class LocationAssigner {

  static jointName(type) {
    return Joints.BREWERY === type ? 
      (random(LocationAssigner.BREW_FIRST) + ' ' + random(LocationAssigner.BREW_LAST)) : 
        (random(LocationAssigner.PUB_FIRST) + ' ' + random(LocationAssigner.PUB_LAST));
  }

  static jointsOnMap(map) {
    let id = (function () {
      let _id = 100;
      return () => { _id++; return _id };
    })();
    let regions = [
      {region: map._normalRegions, min: 18, max: 28 }, 
      {region: map._denseRegions, min: 45, max: 55}];
    let joints = [];
    for (let l = 0; l < 150; ) {
      let loc = createVector(Math.round(random(10, width-10)), Math.round(random(10, height-10)));
      if (map._noMansRegions.some( r => r.pointInRegion(loc) )) continue;
      let type = random(1) > 0.5 ? Joints.BREWERY : Joints.PUB;
      joints.push(new Joints(
        Math.round(loc.x), Math.round(loc.y), id(), LocationAssigner.jointName(type), type));
      l++;
    }
    for (let {region, min, max} of regions) {
      for (let reg of region) {
        for (let i = 0; i < random(min, max); i++) {
          let loc = reg.randomPointInRegion();
          let type = random(1) > 0.5 ? Joints.BREWERY : Joints.PUB;
          joints.push(new Joints(
            Math.round(loc.x), Math.round(loc.y), id(), LocationAssigner.jointName(type), type));
        }
      }
    }
    return joints;
  }

  static cabsOnMap(map) {
    let id = (function () {
      let _id = 1000;
      return () => { _id++; return _id };
    })();
    let cabs = [];
    for (let l = 0; l < 100; ) {
      let loc = createVector(Math.round(random(10, width-10)), Math.round(random(10, height-10)));
      if (map._noMansRegions.some( r => r.pointInRegion(loc) )) continue;
      cabs.push(new Vehicles( Math.round(loc.x), Math.round(loc.y), id() ));
      l++;
    }
    return cabs;
  }

  static nextDestination(cab, map, range) {
    while(true) {
      let loc = createVector(
        Math.round(random(Math.max(10, cab._x - range), Math.min(width-10, cab._x + range))), 
        Math.round(random(Math.max(10, cab._y - range), Math.min(height-10, cab._y + range))));
      if (map._noMansRegions.some( r => r.pointInRegion(loc) )) continue;
      return loc;
    }
  }

}

LocationAssigner.PUB_FIRST = ['Night', 'Tipsy', 'The Last', 'Chuggin', 'Mighty', 'Pirate', 'Hoppin', 'Party', 'Fiery'];
LocationAssigner.PUB_LAST = ['Pearl', 'Bartender', 'Party', 'n High', 'o Hoy', 'Dude', 'n Rockin', 'Sippin', 'Fire', 'Traveller'];
LocationAssigner.BREW_FIRST = ['Brew', 'Brewery', 'Beer', 'Tap', 'Barrel', 'Keg', 'Friday', 'King', 'Futbol'];
LocationAssigner.BREW_LAST = ['Garden', 'City', 'Panda', 'Market', 'Fair', 'Blast', 'River', 'Chugger', 'Mania', 'Master'];