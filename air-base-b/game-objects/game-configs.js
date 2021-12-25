class GameConfigs {

  constructor() {
    this.configMap = new Map();

    this.configMap.set(NORMAL, new Map());
    this.configMap.get(NORMAL).set('gunnerMaxSpeed', 3);
    this.configMap.get(NORMAL).set('gunnerActDelay', 6);
    this.configMap.get(NORMAL).set('rollerMaxSpeed', 6.0);
    this.configMap.get(NORMAL).set('rollerActDelay', 90);
    this.configMap.get(NORMAL).set('samMaxSpeed', 0.8);
    this.configMap.get(NORMAL).set('samMissileSpeed', 15);
    this.configMap.get(NORMAL).set('bomberAngularSpeed', 0.005);
    this.configMap.get(NORMAL).set('bomberDrops', [440,60,300,460,400,300,240,200,360,160,260,420,260,220,200,400]);
    this.configMap.get(NORMAL).set('kamikazeMaxSpeed', 3.5);
    this.configMap.get(NORMAL).set('lcaAngularSpeed', 0.009);
    this.configMap.get(NORMAL).set('lcaShootDelay', 9);

    this.configMap.set(FAST, new Map());
    this.configMap.get(FAST).set('gunnerMaxSpeed', 4.5);
    this.configMap.get(FAST).set('gunnerActDelay', 4);
    this.configMap.get(FAST).set('rollerMaxSpeed', 8.5);
    this.configMap.get(FAST).set('rollerActDelay', 60);
    this.configMap.get(FAST).set('samMaxSpeed', 1.0);
    this.configMap.get(FAST).set('samMissileSpeed', 25);
    this.configMap.get(FAST).set('bomberAngularSpeed', 0.008);
    this.configMap.get(FAST).set('bomberDrops', [220,30,150,230,200,150,120,100,180,80,130,210,130,110,100,200]);
    this.configMap.get(FAST).set('kamikazeMaxSpeed', 5.0);
    this.configMap.get(FAST).set('lcaAngularSpeed', 0.015);
    this.configMap.get(FAST).set('lcaShootDelay', 6);
  }

  gunnerMaxSpeed = () => this.configMap.get(speed).get('gunnerMaxSpeed');

  gunnerActDelay = () => this.configMap.get(speed).get('gunnerActDelay');

  rollerMaxSpeed = () => this.configMap.get(speed).get('rollerMaxSpeed');

  rollerActDelay = () => this.configMap.get(speed).get('rollerActDelay');

  samMaxSpeed = () => this.configMap.get(speed).get('samMaxSpeed');

  samMissileSpeed = () => this.configMap.get(speed).get('samMissileSpeed');

  bomberAngularSpeed = () => this.configMap.get(speed).get('bomberAngularSpeed');

  bomberDrops = () => this.configMap.get(speed).get('bomberDrops');

  kamikazeMaxSpeed = () => this.configMap.get(speed).get('kamikazeMaxSpeed');

  lcaAngularSpeed = () => this.configMap.get(speed).get('lcaAngularSpeed');

  lcaShootDelay = () => this.configMap.get(speed).get('lcaShootDelay');

}

GameConfigs.CONFIGS = new GameConfigs();