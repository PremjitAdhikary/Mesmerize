/// <reference path='../lib/babylonJS/4_2_0/babylon.d.ts' />

class Celestial {

  constructor(scene, data) {
    this._name = data.name;
    this._scene = scene;
    this._diameter = data.diameter;
    this._body = BABYLON.Mesh.CreateSphere(data.name, 32, data.diameter, scene);
    this._orbitRadius = data.distance;
    this._angle = Math.random() * Math.PI;
    this.updatePosition();
    this._material = new BABYLON.StandardMaterial('material_' + data.name, scene);
    if (data.emit) {
      this._material.emissiveTexture = new BABYLON.Texture(data.texturePath, scene);
      this._material.diffuseColor = data.color();
      this._material.specularColor = new BABYLON.Color3(0, 0, 0);
    } else {
      this._material.diffuseTexture = new BABYLON.Texture(data.texturePath, scene);
      this._material.specularColor = data.color();
    }
    this._body.material = this._material;
    this._angularSpeed = data.revolution == 1 ? 0 : Math.PI/ data.revolution;
    this._rotationSpeed = data.rotationSpeed;
    this._tilt = BABYLON.Angle.FromDegrees(data.tilt)._radians;
    this._tiltVector = new BABYLON.Vector3(Math.sin(this._tilt), Math.cos(this._tilt), 0);

    if (data.hasRings) {
      this.addRings(
        data.ringDiameter, data.ringThickness, data.ringTexturePath, data.ringScale, data.ringTilt, data.name);
      this._ringsRotationSpeed = Math.PI / data.ringRotation;
    }

    if (data.satellites) {
      this.addSatellites(data.satellites, data.satelliteMinDiameter, data.satelliteMaxDiameter);
    }
  }

  updatePosition() {
    this._body.position.x = this._orbitRadius * Math.sin(this._angle);
    this._body.position.z = this._orbitRadius * Math.cos(this._angle);
  }

  update() {
    this.updatePosition();
    this._body.rotate(this._tiltVector, this._rotationSpeed);
    
    if (this._hasRings) {
      this._rings.position.x = this._body.position.x;
      this._rings.position.z = this._body.position.z;
      this._rings.rotate(new BABYLON.Vector3(0, 1, 0), this._ringsRotationSpeed);
    }

    if (this._satellites) {
      for (let s = 0; s < this._satellites.length; s++) {
        this.positionSatellite(this._satellites[s]);
        this._satellites[s].angle += this._satellites[s].angularSpeed;
      }
    }

    this._angle += this._angularSpeed;
  }

  addRings(diameter, thickness, texturePath, scale, tilt, name) {
    this._hasRings = true;
    this._rings = BABYLON.Mesh.CreateTorus('rings', diameter, thickness, 32, this._scene);
    this._rings.scaling = new BABYLON.Vector3(1, scale, 1);
    this._rings.position.x = this._body.position.x;
    this._rings.position.z = this._body.position.z;
    this._rings.rotation.x += BABYLON.Angle.FromDegrees(tilt)._radians;
    this._rings.material =  new BABYLON.StandardMaterial('material_rings_' + name, this._scene);
    this._rings.material.diffuseTexture = new BABYLON.Texture(texturePath, this._scene);
    this._rings.material.diffuseTexture.hasAlpha = true;
    this._rings.material.useAlphaFromDiffuseTexture = true;
  }

  addSatellites(satellites, satelliteMinDiameter, satelliteMaxDiameter) {
    this._satellites = [];
    for (let s = 0; s < satellites; s++) {
      let diameter = satelliteMinDiameter + Math.random() * (satelliteMaxDiameter - satelliteMinDiameter);
      let orbitRadius = (this._diameter/2 + (diameter/2 * (1 + (s/2))));
      let satellite = BABYLON.Mesh.CreateSphere(this._name + '_s_' + s, 32, diameter, this._scene);
      satellite.material = new BABYLON.StandardMaterial('material_' + this._name + '_s_' + s, this._scene);
      satellite.material.diffuseTexture = new BABYLON.Texture('./img/textures/moon_'+ (1 + s%5) + '.jpg', this._scene);
      
      let sObj = { satellite, orbitRadius, angle: (Math.random() * Math.PI), angularSpeed: (Math.random() * 0.1) * (Math.random() > 0.5 ? 1 : -1), rotationSpeed: Math.random() * 0.001 };
      this.positionSatellite(sObj);
      this._satellites.push(sObj);
    }
  }

  positionSatellite({ satellite, orbitRadius, angle, rotationSpeed }) {
    satellite.position.x = this._body.position.x;
    satellite.position.z = this._body.position.z;
    satellite.position.x += (orbitRadius * Math.sin(angle));
    satellite.position.z += (orbitRadius * Math.cos(angle));
    satellite.position.y = (orbitRadius/4 * Math.cos(angle));
    let tiltVector = new BABYLON.Vector3(Math.sin(angle), Math.cos(angle), 0)
    satellite.rotate(tiltVector, rotationSpeed);
  }

}