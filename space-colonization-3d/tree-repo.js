class TreeRepo {

  constructor() {
    this.populateTreeData();
  }

  getData(repo) {
    return this.allTrees.get(repo);
  }

  populateTreeData() {
    this.allTrees = new Map([

      [TreeRepo.CUBE, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 2, 
            width: 80, 
            depth: 80
          },
          material: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.diffuseColor = SketchColor.blend(
              SketchColor.yellow(), SketchColor.orange(), SketchColor.grey()).babylonColor();
            return baseColor;
          }
        },
        attractors: {
          count: 1500, 
          minDist: 4, 
          maxDist: 8,
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.red().babylonColor();
            return baseColor;
          }, 
          position: () => {
            let cSize = 80;
            return new BABYLON.Vector3(
              Math.floor(TreeRepo.randomInRange(-cSize/2, cSize/2)), 
              Math.floor(Math.random() * cSize/2) + 20, 
              Math.floor(TreeRepo.randomInRange(-cSize/2, cSize/2))
            )
          }
        }, 
        root: {
          position: () => BABYLON.Vector3.Zero(), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        }, 
        branchNode: {
          dist: 2, 
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 1,
          diamIncr: 0.0,
          material: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.diffuseColor = SketchColor.blend(
              SketchColor.yellow(), SketchColor.orange(), SketchColor.grey()).babylonColor();
            return baseColor;
          }
        }
      }}], 

      [TreeRepo.GENERAL, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 2, 
            width: 60, 
            depth: 60
          },
          material: () => {
            let baseMaterial = new BABYLON.StandardMaterial('base', scene);
            baseMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/grass.jpg', scene);
            return baseMaterial;
          }
        },
        attractors: {
          count: 2000, 
          minDist: 4, 
          maxDist: 9,
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.blue().babylonColor();
            return baseColor;
          }, 
          position: () => TreeRepo.generatePointForGeneralTree(60, 0, 30, 40, 60, 0)
        }, 
        root: {
          position: () => BABYLON.Vector3.Zero(), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        },
        branchNode: {
          dist: 2.2, 
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.green().babylonColor();
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 0.4,
          diamIncr: 0.003,
          material: () => {
            let trunkMaterial = new BABYLON.StandardMaterial('trunk', scene);
            trunkMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/tree_bark.jpg', scene);
            return trunkMaterial;
          }
        }
      }}], 

      [TreeRepo.SPREAD, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 2, 
            width: 40, 
            depth: 40
          },
          material: () => {
            let baseMaterial = new BABYLON.StandardMaterial('base', scene);
            baseMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/grass.jpg', scene);
            return baseMaterial;
          }
        },
        attractors: {
          count: 1500, 
          minDist: 4, 
          maxDist: 40,
          diam: 0.7,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.blue().babylonColor();
            return baseColor;
          }, 
          position: () => TreeRepo.generatePointForSpreadTree(0.6, 1.0, 0.3, 55, 0, 38, 23, 55, 0)
        }, 
        root: {
          position: () => BABYLON.Vector3.Zero(), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        },
        branchNode: {
          dist: 2, 
          diam: 0.7,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.green().babylonColor();
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 0.2,
          diamIncr: 0.0005,
          material: () => {
            let trunkMaterial = new BABYLON.StandardMaterial('trunk', scene);
            trunkMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/tree_bark.jpg', scene);
            return trunkMaterial;
          }
        }
      }}], 

      [TreeRepo.PINE, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 2, 
            width: 40, 
            depth: 40
          },
          material: () => {
            let baseMaterial = new BABYLON.StandardMaterial('base', scene);
            baseMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/grass.jpg', scene);
            return baseMaterial;
          }
        },
        attractors: {
          count: 1500, 
          minDist: 2, 
          maxDist: 10,
          diam: 0.75,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.diffuseColor = SketchColor.skyblue().babylonColor();
            return baseColor;
          }, 
          position: () => TreeRepo.generatePointInACone(80, 85, 30, 0, 10, 0)
        }, 
        root: {
          position: () => BABYLON.Vector3.Zero(), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        },
        branchNode: {
          dist: 1.2,
          diam: 0.75,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.white().babylonColor();
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 0.5,
          diamIncr: 0.002,
          material: () => {
            let trunkMaterial = new BABYLON.StandardMaterial('trunk', scene);
            trunkMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/tree_bark.jpg', scene);
            return trunkMaterial;
          }
        }
      }}], 

      [TreeRepo.HAUNTED, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 4, 
            width: 60, 
            depth: 60
          },
          material: () => {
            let baseMaterial = new BABYLON.StandardMaterial('base', scene);
            baseMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/ash.jpg', scene);
            return baseMaterial;
          }
        },
        attractors: {
          count: 2000, 
          minDist: 4, 
          maxDist: 12,
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.grey().babylonColor();
            return baseColor;
          }, 
          position: () => TreeRepo.generatePointForHauntedTree(60, 0, 55, 10, 60, 0)
        }, 
        root: {
          position: () => new BABYLON.Vector3(-13, 0, 10), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        },
        branchNode: {
          dist: 1.8, 
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.red().babylonColor();
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 0.6,
          diamIncr: 0.004,
          material: () => {
            let trunkMaterial = new BABYLON.StandardMaterial('trunk', scene);
            trunkMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/tree_burnt.jpg', scene);
            return trunkMaterial;
          }
        }
      }}], 

      [TreeRepo.NATURE, scene => {return {
        treeSize: 180, 
        base: {
          props: {
            height: 2, 
            width: 60, 
            depth: 60
          },
          material: () => {
            let baseMaterial = new BABYLON.StandardMaterial('base', scene);
            baseMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/grass.jpg', scene);
            return baseMaterial;
          }
        },
        attractors: (function () {
          let xzOffsetGen = (min, max) => 
            (Math.random() > 0.5 ? 1 : -1) * TreeRepo.randomInRange(min, max);
          let genClusterParams = () => {return {
            xMult: TreeRepo.randomInRange(20, 30),
            xOffset: xzOffsetGen(5, 25),
            yMult: TreeRepo.randomInRange(15, 25),
            zMult: TreeRepo.randomInRange(20, 30),
            zOffset: xzOffsetGen(5, 25)
          }};
          let cluster1Params = {
            ...genClusterParams(),
            yOffset: TreeRepo.randomInRange(30, 35)
          };
          let cluster2Params = {
            ...genClusterParams(),
            yOffset: TreeRepo.randomInRange(35, 40)
          };
          let cluster3Params = {
            ...genClusterParams(),
            yOffset: TreeRepo.randomInRange(40, 45)
          };
          let cluster4Params = {
            ...genClusterParams(),
            yOffset: TreeRepo.randomInRange(45, 50)
          };
          let cluster5Params = {
            xMult: TreeRepo.randomInRange(20, 30),
            xOffset: TreeRepo.randomInRange(-5, 5),
            yMult: TreeRepo.randomInRange(15, 25),
            yOffset: TreeRepo.randomInRange(55, 60),
            zMult: TreeRepo.randomInRange(20, 30),
            zOffset: TreeRepo.randomInRange(-5, 5)
          };
          return {
            count: 1500, 
            minDist: 3, 
            maxDist: 20,
            diam: 1,
            baseColor: () => {
              let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
              baseColor.emissiveColor = SketchColor.blue().babylonColor();
              return baseColor;
            }, 
            position: () => {
              let c = Math.random();
              if (c < 0.2) {
                return TreeRepo.generatePointForGeneralTree(
                  cluster1Params.xMult, cluster1Params.xOffset, cluster1Params.yMult, 
                  cluster1Params.yOffset, cluster1Params.zMult, cluster1Params.zOffset);
              } else if (c < 0.4) {
                return TreeRepo.generatePointForGeneralTree(
                  cluster2Params.xMult, cluster2Params.xOffset, cluster2Params.yMult, 
                  cluster2Params.yOffset, cluster2Params.zMult, cluster2Params.zOffset);
              } else if (c < 0.6) {
                return TreeRepo.generatePointForGeneralTree(
                  cluster3Params.xMult, cluster3Params.xOffset, cluster3Params.yMult, 
                  cluster3Params.yOffset, cluster3Params.zMult, cluster3Params.zOffset);
              } else if (c < 0.8) {
                return TreeRepo.generatePointForGeneralTree(
                  cluster4Params.xMult, cluster4Params.xOffset, cluster4Params.yMult, 
                  cluster4Params.yOffset, cluster4Params.zMult, cluster4Params.zOffset);
              } else {
                return TreeRepo.generatePointForHauntedTree(
                  cluster5Params.xMult, cluster5Params.xOffset, cluster5Params.yMult, 
                  cluster5Params.yOffset, cluster5Params.zMult, cluster5Params.zOffset);
              }
            }
          }
        })(), 
        root: {
          position: () => BABYLON.Vector3.Zero(), 
          direction: () => new BABYLON.Vector3(0, 1, 0)
        },
        branchNode: {
          dist: 1.1, 
          diam: 1,
          baseColor: () => {
            let baseColor = new BABYLON.StandardMaterial('baseColor', scene);
            baseColor.emissiveColor = SketchColor.green().babylonColor();
            return baseColor;
          }
        },
        renderer: {
          baseDiam: 0.3,
          diamIncr: 0.0012,
          material: () => {
            let trunkMaterial = new BABYLON.StandardMaterial('trunk', scene);
            trunkMaterial.diffuseTexture = new BABYLON.Texture('./img/textures/tree_bark.jpg', scene);
            return trunkMaterial;
          }
        }
      }}]
    ]);
  }

}

TreeRepo.CUBE = 'basic';
TreeRepo.GENERAL = 'general';
TreeRepo.SPREAD = 'spread';
TreeRepo.PINE = 'pine';
TreeRepo.HAUNTED = 'haunted';
TreeRepo.NATURE = 'nature';

TreeRepo.randomInRange = (min, max) => Math.random() * (max - min) + min;

/**
 * The method chooses spherical coordinates randomly. But for the azimuthal angle, the uniform 
 * random number is chosen over the cosine of the value, instead of the angle itself. Then, the 
 * inverse of this is taken to find the azimuthal angle. This gets rid of the axial streak. This 
 * works because azimuthal angle determines a point on the curved part of a semi-circle: choosing 
 * a uniformly random point on the curve is what we want. Taking the cos-inverse of this random 
 * number allows us use a uniform normal distribution to get the angle. Additionally, we use the 
 * cube root of the chosen radius to prevent clumping in the center.
 * 
 * The random point is generated for a unit sphere, the multipliers and offset are there to 
 * spread it out over a spherical volume.
 * 
 * Source: https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/
 */
 TreeRepo.generatePointInASphere = (rFunc) => {
  let u = Math.random();
  let v = Math.random();
  let theta = u * 2.0 * Math.PI;
  let phi = Math.acos(2.0 * v - 1.0);
  let r = rFunc();
  let sinTheta = Math.sin(theta);
  let cosTheta = Math.cos(theta);
  let sinPhi = Math.sin(phi);
  let cosPhi = Math.cos(phi);
  let x = r * sinPhi * cosTheta;
  let y = r * sinPhi * sinTheta;
  let z = r * cosPhi;
  return new BABYLON.Vector3(x, y, z);
 };

 TreeRepo.generatePointInAUnitSphere = () => TreeRepo.generatePointInASphere(() => Math.cbrt(Math.random()));

 TreeRepo.generatePointForGeneralTree = (xMult, xOffset, yMult, yOffset, zMult, zOffset) => {
   let newPoint = TreeRepo.generatePointInAUnitSphere();
   newPoint.x = newPoint.x * xMult + xOffset;
   newPoint.y = newPoint.y * yMult + yOffset;
   newPoint.z = newPoint.z * zMult + zOffset;
   return newPoint;
 };

/**
 * We want a random point inside a right circular cone of height a and radius of base b, and we 
 * want the point with uniform sampling over the volume of that cone.
 * 
 * Consider the small cone of height h inside that larger cone, both cones with the same apex and 
 * parallel bases. The two cones are of course similar figures, and the square-cube law says that 
 * the volume of the smaller cone varies as the cube of its height. That height varies from 0 to a 
 * and we want its cube to be uniform over that range. Therefore we choose h to vary with the cube 
 * root of a uniform random variable.
 * 
 * h = a * cbrt(random())
 * 
 * Next consider the circular region that is the base of that smaller cone of height h. The radius 
 * of that base is (b / a) * h, by similar triangles. Now think of a smaller circular region of 
 * radius r inside that larger circular region, both circles in the same plane and with the same 
 * center. The area of the smaller circle varies with the square of its radius, so to get a uniform 
 * area over its range we take the square root of a uniform random variable.
 * 
 * r = (b / a) * h * sqrt(random())
 * 
 * We now want the angle t (for theta) of a point on the circumference of that smaller circle of 
 * radius r. The angle in radians obviously does not depend on the other factors, so we just use a 
 * uniform random variable to get:
 * 
 * t = 2 * pi * random()
 * 
 * We now use those three random variables h, r, and t to choose our point inside the starting 
 * cone. If the apex of the cone is at the origin and the axis of the cone is along the positive 
 * y-axis, so that the center of the base is (0, a, 0) and a point on the circumference of the base 
 * is (b, a, 0):
 * 
 * x = r * cos(t)
 * y = h
 * z = r * sin(t)
 * 
 * Source: https://stackoverflow.com/questions/41749411/uniform-sampling-by-volume-within-a-cone
 */
 TreeRepo.generatePointInACone = (maxHt, coneHt, coneBase, xOffset, yOffset, zOffset) => {
  let h = coneHt * Math.cbrt(Math.random());
  let r = (coneBase / coneHt) * h * Math.sqrt(Math.random());
  let t = 2 * Math.PI * Math.random();
  let x = r * Math.sin(t);
  let y = maxHt - h;
  let z = r * Math.cos(t);
  return new BABYLON.Vector3(x + xOffset, y + yOffset, z + zOffset);
};

/**
 * Small tweak to generate point in a HemiSphere for this
 */
TreeRepo.generatePointForHauntedTree = (xMult, xOffset, yMult, yOffset, zMult, zOffset) => {
  let newPoint = TreeRepo.generatePointInAUnitSphere();
  newPoint.x = newPoint.x * xMult + xOffset;
  newPoint.y = Math.abs(newPoint.y) * yMult + yOffset;
  newPoint.z = newPoint.z * zMult + zOffset;
  return newPoint;
};

/**
 * Few additional tweaks to push generated points to the edge. 
 * - rangeMin = 0.6, rangeMax = 1, means theere would be no points in inner sphere of radius 
 * which is 60% of the the unit sphere.
 * 
 * Also tweaked to cut off the bottom of the sphere.
 * - absY = 0.2 means that 80% of the bottom sphere will be cut
 */
TreeRepo.generatePointForSpreadTree = (rangeMin, rangeMax, absY, xMult, xOffset, yMult, yOffset, zMult, zOffset) => {
  let newPoint = TreeRepo.generatePointInASphere(() => TreeRepo.randomInRange(rangeMin, rangeMax));
  newPoint.x = newPoint.x * xMult + xOffset;
  newPoint.y = (Math.abs(newPoint.y) > absY ? Math.abs(newPoint.y) : newPoint.y) 
    * yMult + yOffset;
  newPoint.z = newPoint.z * zMult + zOffset;
  return newPoint;
};