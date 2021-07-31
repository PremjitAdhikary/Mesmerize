class CelestialData {

  constructor() {
    this.populateSystems();
  }

  populateSystems() {
    this._asteroidBelt = {
      diameter: 250,
      thickness: 15,
      scale: 0.4,
      rotation: 1450,
      texturePath: './img/textures/asteroids.gif'
    };
    this._allSystems = new Map([
      ['sun', {
        name: 'sun',
        emit: true,
        diameter: 50,
        distance: 0,
        tilt: 7.25,
        revolution: 1,
        rotationSpeed: 0.0015,
        color: () => SketchColor.blend(SketchColor.yellow(), SketchColor.white()).babylonColor(),
        texturePath: './img/textures/sun.jpg'
      }],
      ['mercury', {
        name: 'mercury',
        emit: false,
        diameter: 3,
        distance: 35,
        tilt: 0,
        revolution: 80,
        rotationSpeed: 0.007,
        color: () => SketchColor.blend(SketchColor.grey(), SketchColor.grey(), SketchColor.yellow()).babylonColor(),
        texturePath: './img/textures/mercury.jpg'
      }],
      ['venus', {
        name: 'venus',
        emit: false,
        diameter: 5.8,
        distance: 50,
        tilt: 2.5,
        revolution: 225,
        rotationSpeed: 0.004,
        color: () => SketchColor.blend(SketchColor.orange(), SketchColor.white()).babylonColor(),
        texturePath: './img/textures/venus.jpg'
      }],
      ['earth', {
        name: 'earth',
        emit: false,
        diameter: 6,
        distance: 70,
        tilt: 23.4,
        revolution: 365,
        rotationSpeed: 0.003,
        color: () => SketchColor.blend(SketchColor.blue(), SketchColor.green()).babylonColor(),
        texturePath: './img/textures/earth.jpg',
        satellites: 1,
        satelliteMinDiameter: 1.5,
        satelliteMaxDiameter: 1.5
      }],
      ['mars', {
        name: 'mars',
        emit: false,
        diameter: 4,
        distance: 100,
        tilt: 25,
        revolution: 486,
        rotationSpeed: 0.004,
        color: () => SketchColor.red().babylonColor(),
        texturePath: './img/textures/mars.jpg',
        satellites: 2,
        satelliteMinDiameter: 0.5,
        satelliteMaxDiameter: 0.7
      }],
      ['jupiter', {
        name: 'jupiter',
        emit: false,
        diameter: 15,
        distance: 160,
        tilt: 3,
        revolution: 670,
        rotationSpeed: 0.002,
        color: () => SketchColor.blend(SketchColor.orange(), SketchColor.yellow()).babylonColor(),
        texturePath: './img/textures/jupiter.jpg',
        hasRings: true,
        ringDiameter: 21,
        ringThickness: 4.5,
        ringScale: 0.015,
        ringRotation: 2,
        ringTilt: 20,
        ringTexturePath: './img/textures/jupiter_ring.png',
        satellites: 35,
        satelliteMinDiameter: 0.2,
        satelliteMaxDiameter: 1.8
      }],
      ['saturn', {
        name: 'saturn',
        emit: false,
        diameter: 10,
        distance: 200,
        tilt: 26.7,
        revolution: 900,
        rotationSpeed: 0.002,
        color: () => SketchColor.blend(SketchColor.yellow(),SketchColor.grey(),SketchColor.white()).babylonColor(),
        texturePath: './img/textures/saturn.jpg',
        hasRings: true,
        ringDiameter: 13,
        ringThickness: 2.5,
        ringScale: 0.01,
        ringRotation: 2,
        ringTilt: 45,
        ringTexturePath: './img/textures/saturn_ring.png',
        satellites: 25,
        satelliteMinDiameter: 0.2,
        satelliteMaxDiameter: 1.3
      }],
      ['uranus', {
        name: 'uranus',
        emit: false,
        diameter: 8,
        distance: 240,
        tilt: 82,
        revolution: 750,
        rotationSpeed: 0.003,
        color: () => SketchColor.blend(SketchColor.orange(), SketchColor.yellow()).babylonColor(),
        texturePath: './img/textures/uranus.jpg',
        hasRings: true,
        ringDiameter: 11,
        ringThickness: 2,
        ringScale: 0.009,
        ringRotation: 2,
        ringTilt: 90,
        ringTexturePath: './img/textures/uranus_ring.png',
        satellites: 10,
        satelliteMinDiameter: 0.2,
        satelliteMaxDiameter: 0.7
      }],
      ['neptune', {
        name: 'neptune',
        emit: false,
        diameter: 8,
        distance: 300,
        tilt: 28,
        revolution: 850,
        rotationSpeed: 0.003,
        color: () => SketchColor.blend(SketchColor.orange(), SketchColor.yellow()).babylonColor(),
        texturePath: './img/textures/neptune.jpg',
        hasRings: true,
        ringDiameter: 11,
        ringThickness: 1.5,
        ringScale: 0.008,
        ringRotation: 2,
        ringTilt: 28,
        ringTexturePath: './img/textures/neptune_ring.png',
        satellites: 8,
        satelliteMinDiameter: 0.2,
        satelliteMaxDiameter: 0.7
      }]
    ]);
  }

  get(system) {
    return this._allSystems.get(system);
  }

  allSystemNames() {
    return this._allSystems.keys();
  }

}