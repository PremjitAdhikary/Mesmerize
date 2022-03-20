class Vehicle extends GraphicObj {

  constructor(sprite, config) {
    super(sprite, config.x, config.y, config.z);
    this.config = config;
  }

  animate() {
    if (this.toRemove) return;
    this.x += this.config.speed;
    if (!this.config.isActive(this)) this.toRemove = true;
  }

  show() {
    if (this.toRemove) return;
    image(this.img.get(
      this.config.spriteX, this.config.spriteY, this.config.spriteW, this.config.spriteH), 
      this.x, this.y);
  }

}

Vehicle.CONFIGURATIONS = [
  {
    x: -300, y: 210, z: -8, 
    spriteX: 65, spriteY: 0, spriteW: 270, spriteH: 115,
    speed: 10, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 230, z: -6, 
    spriteX: 65, spriteY: 115, spriteW: 270, spriteH: 115,
    speed: -10, 
    isActive: vehicle => vehicle.x > -300
  }, 
  {
    x: -300, y: 210, z: -8, 
    spriteX: 65, spriteY: 230, spriteW: 270, spriteH: 115,
    speed: 10, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 230, z: -6, 
    spriteX: 65, spriteY: 350, spriteW: 270, spriteH: 115,
    speed: -10, 
    isActive: vehicle => vehicle.x > -300
  }, 
  {
    x: -300, y: 140, z: -8, 
    spriteX: 15, spriteY: 470, spriteW: 325, spriteH: 185,
    speed: 4, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 160, z: -6, 
    spriteX: 15, spriteY: 655, spriteW: 325, spriteH: 185,
    speed: -4, 
    isActive: vehicle => vehicle.x > -300
  }, 
  {
    x: -300, y: 185, z: -8, 
    spriteX: 345, spriteY: 0, spriteW: 295, spriteH: 136,
    speed: 6, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 205, z: -6, 
    spriteX: 345, spriteY: 136, spriteW: 295, spriteH: 136,
    speed: -6, 
    isActive: vehicle => vehicle.x > -300
  }, 
  {
    x: -300, y: 185, z: -8, 
    spriteX: 345, spriteY: 274, spriteW: 295, spriteH: 136,
    speed: 6, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 205, z: -6, 
    spriteX: 345, spriteY: 412, spriteW: 295, spriteH: 136,
    speed: -6, 
    isActive: vehicle => vehicle.x > -300
  }, 
  {
    x: -300, y: 185, z: -8, 
    spriteX: 345, spriteY: 550, spriteW: 295, spriteH: 136,
    speed: 6, 
    isActive: vehicle => vehicle.x < 700
  }, 
  {
    x: 700, y: 205, z: -6, 
    spriteX: 345, spriteY: 689, spriteW: 295, spriteH: 136,
    speed: -6, 
    isActive: vehicle => vehicle.x > -300
  }
];

Vehicle.GET_ONE = () => {
  let config = random(Vehicle.CONFIGURATIONS);
  return new Vehicle(sprite, config);
};