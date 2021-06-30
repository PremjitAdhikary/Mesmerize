class Repo {

  constructor() {
    this.populateSystems();
  }

  populateSystems() {
    let setupStroke = (color, cap, wt) => {
      stroke(color);
      strokeCap(cap);
      strokeWeight(wt);
    };
    let drawLineFunc = (color, cap) => {
      return (nextX, nextY, wt) => {
        setupStroke(color, cap, wt);
        line(0, 0, nextX, nextY);
      };
    };
    let drawCircleFunc = (color) => {
      return (nextX, nextY, wt) => {
        setupStroke(color, ROUND, wt);
        noFill();
        circle(0, 0, 2*Math.abs(nextY));
      };
    };
    let drawSquareFunc = (color) => {
      return (nextX, nextY, wt) => {
        setupStroke(color, ROUND, wt);
        noFill();
        rectMode(CENTER);
        rect(0, nextY, 2*Math.abs(nextY), 2*Math.abs(nextY));
        rectMode(CORNER);
      };
    };
    this._allSystems = new Map([
      [Repo.CANTOR, {
        lenFunc: () => {
          let initLen = width - 20;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => gen => 45,
        positionFunc: () => gen => createVector(10, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => 0,
        drawUnitFunc: () => drawLineFunc(SketchColor.yellow().stringify(), SQUARE),
        axiom: 'F',
        rules: [
          new LRule('F', 'FfF'), 
          new LRule('f', 'fff')
        ],
        maxGenerations: 6
      }], 
      [Repo.CANTOR_A, {
        lenFunc: () => {
          let initLen = width - 20;
          return gen => initLen / Math.pow(2, gen);
        },
        widFunc: () => gen => 45,
        positionFunc: () => gen => createVector(width - 10, height/2),
        initAngleFunc: () => gen => -HALF_PI,
        angleFunc: () => gen => 0,
        drawUnitFunc: () => drawLineFunc(SketchColor.yellow().stringify(), SQUARE),
        axiom: 'SF',
        rules: [
          new LRule('F', 'F(HfF)'), 
          new LRule('f', 'ff')
        ],
        maxGenerations: 6,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.5, 1) // H
        ]
      }], 
      [Repo.CANTOR_PERP, {
        lenFunc: () => {
          let initLen = width / 4;
          return gen => initLen / Math.pow(2, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => createVector(width/2, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.greenyellow().stringify(), ROUND),
        axiom: '[FX][|FX]',
        rules: [
          new LRule('F', 'FF'),
          new LRule('X', '[+FFX][-FFX]')
        ],
        maxGenerations: 8
      }], 
      [Repo.VICSEK_SF, {
        lenFunc: () => {
          let initLen = (height - 30);
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width/2, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.red().stringify(), ROUND),
        axiom: 'X',
        rules: [
          new LRule('F', 'FFF'),
          new LRule('X', '[FXH][-FXH]X[+FXH][|FXH]'),
          new LRule('H', 'FH')
        ],
        maxGenerations: 6,
        customOps: [
          {
            command: 'H', // draw half line
            func: sys => {
              sys._drawUnit(0, -sys._len / 2);
              translate(0, -sys._len / 2);
            }
          }
        ]
      }],

      [Repo.KOCH_C, {
        lenFunc: () => {
          let initLen = width;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => gen => 2,
        positionFunc: () => gen => createVector(0, height*2/3),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.violet()).stringify(), SQUARE),
        axiom: 'F',
        rules: [
          new LRule('F', 'F[-F++F]fF'), 
          new LRule('f', 'fff')
        ],
        maxGenerations: 5
      }],
      [Repo.KOCH_C_V, {
        lenFunc: () => {
          let initLen = width;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(0, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.violet(), SketchColor.green())
          .stringify(), SQUARE),
        axiom: 'F',
        rules: [
          new LRule('F', 'FF++F++F+F++F-F')
        ],
        maxGenerations: 5
      }],
      [Repo.KOCH_SF, {
        lenFunc: () => {
          let initLen = height * 2 / 3;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => gen => 2,
        positionFunc: () => gen => createVector(width / 2 - height / 3, height * 2 / 3),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.blue()).stringify(), SQUARE),
        axiom: 'F--F--F',
        rules: [ new LRule('F', 'F+F--F+F') ],
        maxGenerations: 4
      }],
      [Repo.KOCH_X_SF, {
        lenFunc: () => {
          let initLen = height;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => gen => 2,
        positionFunc: () => gen => createVector(width / 2 - height / 2, 40),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.greenyellow()).stringify(), SQUARE),
        axiom: 'F++F++F',
        rules: [ new LRule('F', 'F+F--F+F') ],
        maxGenerations: 5
      }],
      [Repo.CESARO_X_SF, {
        lenFunc: () => {
          let initLen = height - 40;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => gen => 2,
        positionFunc: () => gen => createVector(width / 2 - height / 2 + 20, 20),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.green(), SketchColor.blue()).stringify(), SQUARE),
        axiom: 'FRFRFRF',
        rules: [ new LRule('F', 'F+F--F+F') ],
        maxGenerations: 5,
        customOps: [
          {
            command: 'R',
            func: sys => rotate(HALF_PI)
          }
        ]
      }],

      [Repo.MINKOWSKI_C, {
        lenFunc: () => {
          let initLen = width;
          return gen => initLen / Math.pow(4, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(0, height / 2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.blue()).stringify(), SQUARE),
        axiom: 'F',
        rules: [ new LRule('F', 'F-F+F+FF-F-F+F') ],
        maxGenerations: 5
      }],
      [Repo.MINKOWSKI_SF, {
        lenFunc: () => {
          let initLen = width / 2 - 40;
          return gen => initLen / Math.pow(4, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.7, gen);
        },
        positionFunc: () => gen => createVector(width / 2 - width / 4 + 20, 
          height / 2 - width / 4 + 20),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.yellow()).stringify(), SQUARE),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'F-F+F+FF-F-F+F') ],
        maxGenerations: 4
      }],
      [Repo.MINKOWSKI_SF_V1, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          let scale = [1, 7, 31, 120, 430];
          return gen => initLen / scale[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.7, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width / 6, height / 2 + width / 3),
            createVector(width * 11 / 42, height / 2 + width / 7),
            createVector(width * 11 / 42, height / 2 + width * 17 / 217),
            createVector(width * 8 / 35, height / 2 + width * 38 / 3255),
            createVector(width * 41 / 210, height / 2 - width * 179 / 3255)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.orange(), SketchColor.violet()).stringify(), SQUARE),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'F+F-F-FFF+F+F-F') ],
        maxGenerations: 4
      }],
      [Repo.MINKOWSKI_SF_V2, {
        lenFunc: () => {
          let initLen = width / 2 - 60;
          return gen => initLen / Math.pow(6, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.65, gen);
        },
        positionFunc: () => gen => createVector(width / 2 - width / 4 + 30, 
          height / 2 - width / 4 + 30),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.orange(), SketchColor.yellow()).stringify(), SQUARE),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'F-FF+FF+F+F-F-FF+F+F-F-FF-FF+F') ],
        maxGenerations: 3
      }],

      [Repo.SIERPINSKI_T, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          return gen => initLen / Math.pow(2, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => gen => createVector(width / 2 - width / 3, height * 6 / 7),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(120),
        drawUnitFunc: () => drawLineFunc(SketchColor.red().stringify(), SQUARE),
        axiom: 'F-G-G',
        rules: [ 
          new LRule('G', 'GG'), 
          new LRule('F', 'F-G+F+G-F') 
        ],
        maxGenerations: 7,
        customOps: [ Repo.commonCustoms.get('forward')('G') ]
      }],
      [Repo.SIERPINSKI_G, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          return gen => initLen / Math.pow(2, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => createVector(width / 2 + width / 3, height * 6 / 7),
        initAngleFunc: () => gen => radians(gen % 2 == 0 ? -90 : -30),
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.greenyellow().stringify(), SQUARE),
        axiom: 'F',
        rules: [ 
          new LRule('F', 'G-F-G'), 
          new LRule('G', 'F+G+F') 
        ],
        maxGenerations: 9,
        customOps: [ Repo.commonCustoms.get('forward')('G') ]
      }],
      [Repo.SIERPINSKI_C, {
        lenFunc: () => {
          let initLen = height - 40;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => createVector(width / 2 - height / 2 + 20, height - 20),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.red().stringify(), ROUND),
        axiom: 'A+B+A+B',
        rules: [ 
          new LRule('A', 'A[+B+A+B]A[+B+A+B]A[+B+A+B]'), 
          new LRule('B', 'FA[+B+A+B]F'),
          new LRule('F', 'FFF')
        ],
        maxGenerations: 4,
        customOps: [
          Repo.commonCustoms.get('forward')('A'), 
          Repo.commonCustoms.get('forward')('B')
        ]
      }],
      [Repo.SIERPINSKI_P, {
        lenFunc: () => {
          let initLen = height / 2;
          let cosSum = 0;
          for (let k = 1; k < 5/4; k++) {
            cosSum += cos(TWO_PI * k / 5);
          }
          let scale = 1 / (2*(1+cosSum));
          return gen => initLen * Math.pow(scale, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width / 2 - height / 4, height * 6 / 7),
        initAngleFunc: () => gen => radians(-18),
        angleFunc: () => gen => radians(36),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.orange()).stringify(), ROUND),
        axiom: 'F++F++F++F++F',
        rules: [ new LRule('F', 'F++F++F|F-F++F') ],
        maxGenerations: 5
      }],
      [Repo.SIERPINSKI_S, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          let scales = [1, 5, 13, 29, 61, 125, 253];
          return gen => initLen / scales[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width / 6, height / 2 - width / 3),
            createVector(width * 13 / 30, height / 2 - width / 3),
            createVector(width * 37 / 78, height / 2 - width / 3),
            createVector(width * 85 / 174, height / 2 - width / 3),
            createVector(width * 86 / 174, height / 2 - width / 3),
            createVector(width * 87 / 174, height / 2 - width / 3),
            createVector(width * 87 / 174, height / 2 - width / 3)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.grey()).stringify(), ROUND),
        axiom: 'F+XF+F+XF',
        rules: [ new LRule('X', 'XF-F+F-XF+F+XF-F+F-X') ],
        maxGenerations: 6
      }],
      [Repo.SIERPINSKI_CR, {
        lenFunc: () => {
          let initLen = height * 2 / 3;
          let scales = [1, 2.7, 6, 12.6, 26, 53, 106];
          return gen => initLen / scales[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width/2, height - 10),
            createVector(width/4 + 20, height - 10),
            createVector(width/4 - 30, height-10),
            createVector(width/4 - 45, height-10),
            createVector(width/4 - 55, height-10),
            createVector(width/4 - 60, height-10),
            createVector(width/4 - 65, height-10)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => radians(-45),
        angleFunc: () => gen => radians(-45),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.violet()).stringify(), ROUND),
        axiom: 'F--XF--F--XF',
        rules: [ new LRule('X', 'XF+G+XF--F--XF+G+X') ],
        maxGenerations: 6,
        customOps: [
          Repo.commonCustoms.get('forward')('G')
        ]
      }],

      [Repo.QUAD_PATT_1, {
        lenFunc: () => {
          let initLen = width / 2;
          let scale = [1, 3, 9, 19, 49, 99];
          return gen => initLen / scale[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.75, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width / 4, height / 2 - width / 4),
            createVector(width / 4, height / 2 - width / 12),
            createVector(width * 13 / 36, height / 2 - width * 5 / 36),
            createVector(width * 11 / 36, height / 2 - width / 16),
            createVector(width * 27 / 72, height / 2 - width / 8),
            createVector(width * 13 / 42, height / 2 - width / 16)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => {
          let angles = [HALF_PI, HALF_PI, -HALF_PI, -HALF_PI, HALF_PI, HALF_PI];
          return gen => angles[gen];
        },
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.red()).stringify(), SQUARE),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'FF+F-F+F+FF') ],
        maxGenerations: 5
      }],
      [Repo.QUAD_PATT_2, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          let scale = [1, 4, 14, 44, 142];
          return gen => initLen / scale[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width / 6, height / 2 - width / 3),
            createVector(width / 3, height / 2 - width / 3),
            createVector(width * 9 / 20, height / 2 - width / 3),
            createVector(width * 9 / 16, height / 2 - width / 3),
            createVector(width * 53 / 80, height / 2 - width * 7 / 24)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.green()).stringify(), SQUARE),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'FF+F+F+F+F+F-F') ],
        maxGenerations: 4
      }],
      [Repo.QUAD_PATT_3, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          return gen => initLen / Math.pow(3, gen);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.75, gen);
        },
        positionFunc: () => gen => createVector(width / 6, height / 2 - width / 3),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.yellow()).stringify(), SQUARE),
        axiom: 'F-F-F-F',
        rules: [ new LRule('F', 'FF-F-F-F-FF') ],
        maxGenerations: 5
      }],
      [Repo.QUAD_PATT_4, {
        lenFunc: () => {
          let initLen = width / 2;
          return gen => initLen / (Math.pow(2, (gen+1)) - 1);
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => {
          let x = Math.sqrt(Math.pow(width/2, 2) / 2);
          return createVector(width / 2 - x, height / 2)
        },
        initAngleFunc: () => gen => radians(135),
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.yellow()).stringify(), ROUND),
        axiom: 'A-A',
        rules: [ new LRule('A', 'AFA-AFA') ],
        maxGenerations: 6,
        customOps: [
          {
            command: 'A', // draw angle
            func: sys => {
              sys._opsMap.get('F')(sys)
              sys._opsMap.get('-')(sys)
              sys._opsMap.get('F')(sys)
            }
          }
        ]
      }],
      [Repo.QUAD_PATT_5, {
        lenFunc: () => {
          let initLen = width * 2 / 3;
          return gen => initLen / (Math.pow(3, gen));
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => gen => createVector(width / 6, height / 2 - width / 3),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.violet()).stringify(), ROUND),
        axiom: 'F+F+F+F',
        rules: [ new LRule('F', 'FF+F++F+F') ],
        maxGenerations: 5
      }],
      [Repo.QUAD_PATT_6, {
        lenFunc: () => {
          let initLen = width  / 3;
          return gen => initLen / (Math.pow(3, gen));
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width / 6, height / 2 - width / 3),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.indigo()).stringify(), ROUND),
        axiom: 'FF+FF+FF+FF',
        rules: [ new LRule('F', 'F+F-F-F+F') ],
        maxGenerations: 5
      }],
      [Repo.QUAD_PATT_7, {
        lenFunc: () => {
          let initLen = 300;
          let scales = [1, 1, 3, 19];
          return gen => initLen / scales[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => gen => createVector(width / 2, height - 25),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => radians(45),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.indigo()).stringify(), ROUND),
        axiom: '-D--D',
        rules: [ 
          new LRule('A', 'F++FFFF--F--FFFF++F++FFFF--F'), 
          new LRule('B', 'F--FFFF++F++FFFF--F--FFFF++F'),
          new LRule('C', 'BFA--BFA'), 
          new LRule('D', 'CFC--CFC')
        ],
        maxGenerations: 3,
        customOps: [
          Repo.commonCustoms.get('dummy')('A'),
          Repo.commonCustoms.get('dummy')('B'),
          Repo.commonCustoms.get('dummy')('C'),
          Repo.commonCustoms.get('dummy')('D')
        ]
      }],

      [Repo.TERDRAGON, {
        lenFunc: () => gen => 3.9,
        widFunc: () => gen => 1.2,
        positionFunc: () => gen => createVector(50, 235),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(120),
        drawUnitFunc: () => drawLineFunc(SketchColor.gold().stringify(), ROUND),
        axiom: 'F',
        rules: [ new LRule('F', 'F-F+F') ],
        maxGenerations: 9
      }],
      [Repo.TRI_PATT_1, {
        lenFunc: () => {
          let lens = [400, 200, 115, 65, 38, 22, 13, 7, 4.5];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(160, 435), createVector(320, 435), createVector(420, 435), 
            createVector(470, 350), createVector(500, 220), createVector(500, 130), 
            createVector(420, 85), createVector(310, 60), createVector(210, 35)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(120),
        drawUnitFunc: () => drawLineFunc(SketchColor.greenyellow().stringify(), ROUND),
        axiom: 'OF+F+F',
        rules: [ new LRule('F', 'F-F+F') ],
        maxGenerations: 8,
        customOps: [ Repo.commonCustoms.get('markTriangle') // O
        ]
      }],
      [Repo.TRI_PATT_1A, {
        lenFunc: () => gen => 4.5,
        widFunc: () => gen => 1.2,
        positionFunc: () => gen => createVector(210, 35),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(120),
        drawUnitFunc: () => drawLineFunc(SketchColor.greenyellow().stringify(), ROUND),
        axiom: 'OF+F+F',
        rules: [ new LRule('F', 'F-F+F') ],
        maxGenerations: 8,
        customOps: [ Repo.commonCustoms.get('markTriangle') // O
        ]
      }],
      
      [Repo.CIR_PATT_1, {
        lenFunc: () => gen => height / 3,
        widFunc: () => gen => 3,
        positionFunc: () => gen => createVector(width/2, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => 0,
        drawUnitFunc: () => drawCircleFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.violet()).stringify()),
        axiom: 'SF',
        rules: [ new LRule('F', '[F](H[ffF][|ffF])') ],
        maxGenerations: 6,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.5, 0.9) // H
        ]
      }],
      [Repo.CIR_PATT_2, {
        lenFunc: () => gen => height / 4,
        widFunc: () => gen => 3,
        positionFunc: () => gen => createVector(width/2, height/2),
        initAngleFunc: () => gen => HALF_PI,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawCircleFunc(SketchColor.blend(
          SketchColor.white(), SketchColor.white(), SketchColor.green()).stringify(), 2),
        axiom: 'SF',
        rules: [ new LRule('F', '[F](H[ffF][+ffF][-ffF][|ffF])') ],
        maxGenerations: 5,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.5, 0.9) // H
        ]
      }],

      [Repo.PEANO_C, {
        lenFunc: () => {
          let initLen = width / 3;
          let scales = [1, 1, 4, 13, 40, 121];
          return gen => initLen / scales[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => gen => createVector(110, height - 25),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.skyblue().stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('X', 'XFYFX+F+YFXFY-F-XFYFX'), 
          new LRule('Y', 'YFXFY-F-XFYFX+F+YFXFY') 
        ],
        maxGenerations: 4,
        customOps: [ Repo.commonCustoms.get('dummy')('Y') ]
      }],
      [Repo.HILBERT_C, {
        lenFunc: () => {
          let initLen = height / 2;
          return gen => initLen / (gen == 0 ? 1 : Math.pow(2, gen - 1));
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width/2 - height/4, height/2 + height/4), 
            createVector(width/2 - height/4, height/2 + height/4), 
            createVector(width/2 - height/4 - height/8, height/2 + height/4 + height/8), 
            createVector(width/2 - height/4 - height/8 - height/16, height/2 + height/4 + height/8 + height/16), 
            createVector(width/2 - height/4 - height/8 - height/16 - height/32, height/2 + height/4 + height/8 + height/16 + height/32), 
            createVector(width/2 - height/4 - height/8 - height/16 - height/32 - height/64, height/2 + height/4 + height/8 + height/16 + height/32 + height/64), 
            createVector(width/2 - height/4 - height/8 - height/16 - height/32 - height/64 - height/128, height/2 + height/4 + height/8 + height/16 + height/32 + height/64 + height/128), 
            createVector(width/2 - height/4 - height/8 - height/16 - height/32 - height/64 - height/128 - height/256, height/2 + height/4 + height/8 + height/16 + height/32 + height/64 + height/128 + height/256), 
            createVector(width/2 - height/4 - height/8 - height/16 - height/32 - height/64 - height/128 - height/256 - height/512, height/2 + height/4 + height/8 + height/16 + height/32 + height/64 + height/128 + height/256 + height/512)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.yellow(), SketchColor.orange(), SketchColor.white(), SketchColor.skyblue()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('X', '-YF+XFX+FY-'), 
          new LRule('Y', '+XF-YFY-FX+') 
        ],
        maxGenerations: 7,
        customOps: [ Repo.commonCustoms.get('dummy')('Y') ]
      }],
      [Repo.MOORE_C, {
        lenFunc: () => {
          let initLen = height - 20;
          return gen => initLen / (Math.pow(2, gen + 1) - 1)
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(width/2 + (height - 20) / 2, height - 10), 
            createVector(width/2 + (height - 20) / 6, height - 10), 
            createVector(width/2 + (height - 20) / 14, height - 10), 
            createVector(width/2 + (height - 20) / 30, height - 10), 
            createVector(width/2 + (height - 20) / 62, height - 10), 
            createVector(width/2 + (height - 20) / 126, height - 10), 
            createVector(width/2 + (height - 20) / 254, height - 10), 
            createVector(width/2 + (height - 20) / 510, height - 10)
          ];
          return gen => positions[gen];
        },
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.white(), SketchColor.yellow()
        ).stringify(), ROUND),
        axiom: 'LFL+F+LFL',
        rules: [ 
          new LRule('L', '-RF+LFL+FR-'), 
          new LRule('R', '+LF-RFR-FL+') 
        ],
        maxGenerations: 6,
        customOps: [
          Repo.commonCustoms.get('dummy')('L'), 
          Repo.commonCustoms.get('dummy')('R')
        ]
      }],
      [Repo.DRAGON_C, {
        lenFunc: () => {
          let lens = [70, 65, 60, 55, 50, 40, 25, 16, 9, 7, 4, 3, 3, 3, 3];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => gen => createVector(width/2-160, height/2-70),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => -HALF_PI,
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.orange(), SketchColor.white(), SketchColor.green()
        ).stringify(), ROUND),
        axiom: 'FX',
        rules: [ 
          new LRule('X', 'X+YF+'), 
          new LRule('Y', '-FX-Y') 
        ],
        maxGenerations: 14,
        customOps: [ Repo.commonCustoms.get('dummy')('Y') ]
      }],
      [Repo.LEVY_C, {
        lenFunc: () => {
          let lens = [200, 141, 100, 70, 50, 35, 25, 18, 12.5, 9, 6.25, 4.5, 3.125];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.95, gen);
        },
        positionFunc: () => gen => createVector(width/2 + 75, height/2 + 100),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(45),
        drawUnitFunc: () => drawLineFunc(SketchColor.gold().stringify(), ROUND),
        axiom: 'F',
        rules: [ new LRule('F', '-F++F-') ],
        maxGenerations: 12
      }],
      [Repo.GOSPER_C, {
        lenFunc: () => {
          let lens = [55, 55, 55, 18, 7, 3];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => {
          let positions = [
            createVector(140, 330), createVector(140, 330), createVector(140, 330), 
            createVector(140, 250), createVector(140, 180), createVector(140, 110)];
          return gen => positions[gen]
        },
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(-60),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.red(), SketchColor.orange(), SketchColor.white(), SketchColor.green()
        ).stringify(), ROUND),
        axiom: 'RF',
        rules: [ 
          new LRule('F', 'F-G--G+F++FF+G-'), 
          new LRule('G', '+F-GG--G-F++F+G')
        ],
        maxGenerations: 5,
        customOps: [
          Repo.commonCustoms.get('forward')('G'), 
          {
            command: 'R', // mark starting line as red
            func: sys => {
              stroke(SketchColor.red().stringify());
              strokeCap(ROUND);
              strokeWeight(4);
              line(0, 0, 0, -sys._len);
            }
          }
        ]
      }],

      [Repo.BINARY_T, {
        lenFunc: () => gen => height * 3 / 7,
        widFunc: () => gen => 15,
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(45),
        drawUnitFunc: () => drawLineFunc(SketchColor.yellow().stringify(), SQUARE),
        axiom: 'SF',
        rules: [ new LRule('F', 'F(H[-F][+F])') ],
        maxGenerations: 7,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.6, 0.7) // H
        ]
      }],
      [Repo.TRINARY_T, {
        lenFunc: () => gen => height * 3 / 5 - 5,
        widFunc: () => gen => 15,
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(60),
        drawUnitFunc: () => drawLineFunc(SketchColor.green().stringify(), SQUARE),
        axiom: 'SF',
        rules: [ new LRule('F', 'F(H[-F][F][+F])') ],
        maxGenerations: 7,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.4, 0.6) // H
        ]
      }],
      [Repo.RANDOM_T, {
        lenFunc: () => gen => height * 3 / 13 - 5,
        widFunc: () => gen => 10,
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(25),
        drawUnitFunc: () => drawLineFunc(SketchColor.greenyellow().stringify(), ROUND),
        axiom: 'SFY',
        rules: [ 
          new LRule('Y', '(H[--X][-X][X][+X][++X])'), 
          new ChanceLRule('X', 'FY', 0.75)
        ],
        maxGenerations: 14,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(0.8, 0.6), // H
          Repo.commonCustoms.get('dummy')('Y')
        ]
      }],
      [Repo.PYTHAGOREAN_T, {
        lenFunc: () => gen => 40,
        widFunc: () => gen => 3,
        positionFunc: () => gen => createVector(width/2, height - 50),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(45),
        drawUnitFunc: () => drawSquareFunc(SketchColor.greenyellow().stringify()),
        axiom: 'SFX',
        rules: [ new LRule('X', 'f[--f(H+++f--FX)][++f(H---f++FX)]') ],
        maxGenerations: 10,
        customOps: [
          Repo.commonCustoms.get('storeLenWid'), // S
          Repo.commonCustoms.get('pushLenWid'),  // (
          Repo.commonCustoms.get('popLenWid'),   // )
          Repo.commonCustoms.get('setLenWid')(sin(radians(45)), 0.9) // H
        ]
      }],

      [Repo.STICKS_1, {
        lenFunc: () => {
          let lens = [1, 150, 50, 22, 10.5, 5, 2.5, 1.2, 0.6];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(8),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.red(), SketchColor.orange(), SketchColor.white(), SketchColor.green()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FF'), 
          new LRule('X', '-F[+F][---X]+F-F[++++X]-X')
        ],
        maxGenerations: 8
      }],
      [Repo.STICKS_2, {
        lenFunc: () => {
          let lens = [1, 150, 52, 24, 11.5, 5.5, 2.75, 1.35];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(22.5),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.orange(), SketchColor.white()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FF'), 
          new LRule('X', 'F-[[X]+X]+F[+FX]-X')
        ],
        maxGenerations: 7
      }],
      [Repo.STICKS_3, {
        lenFunc: () => {
          let lens = [1, 200, 70, 30, 14, 7, 3.5, 1.75, 0.87];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(20),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.red(), SketchColor.orange(), SketchColor.white(), SketchColor.green()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FF'), 
          new LRule('X', 'F[+X]F[-X]+X')
        ],
        maxGenerations: 8
      }],
      [Repo.STICKS_4, {
        lenFunc: () => {
          let lens = [1, 150, 52, 24, 11.5, 5.6, 2.75, 1.4];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.85, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(25),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.orange(), SketchColor.white()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FF'), 
          new LRule('X', 'F+[[X]-X]-F[-FX]+X')
        ],
        maxGenerations: 7
      }],
      [Repo.STICKS_5, {
        lenFunc: () => {
          let lens = [1, 150, 45, 19, 9, 4.5, 2.2, 1.4];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(20),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.yellow(), SketchColor.violet(), SketchColor.white()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FF'), 
          new LRule('X', 'F+[-F-XF-X][+FF][--XF[+X]][++F-X]')
        ],
        maxGenerations: 6
      }],
      [Repo.STICKS_6, {
        lenFunc: () => {
          let lens = [1, 150, 57, 24.5, 12, 5.7];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width / 3, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(18),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.yellow(), SketchColor.greenyellow(), SketchColor.skyblue()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FX[FX[+XF]]'), 
          new LRule('X', 'FF[+XZ++X-F[+ZX]][-X++F-X]'), 
          new LRule('Z', '[+F-X-F][++ZX]')
        ],
        maxGenerations: 5,
        customOps: [ Repo.commonCustoms.get('dummy')('Z') ]
      }],

      [Repo.BUSH_1, {
        lenFunc: () => {
          let lens = [1, 150, 50, 17, 5.5, 1.8, 0.6, 1.75, 0.87];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.75, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(25.7),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.yellow(), SketchColor.grey()
        ).stringify(), ROUND),
        axiom: 'F',
        rules: [ new LRule('F', 'F[+F]F[-F]F') ],
        maxGenerations: 6
      }],
      [Repo.BUSH_2, {
        lenFunc: () => {
          let lens = [1, 200, 67, 30, 14, 7, 3.5, 1.7, 0.85];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width / 2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(18),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.yellow(), SketchColor.greenyellow(), SketchColor.skyblue()
        ).stringify(), ROUND),
        axiom: 'F',
        rules: [ 
          new LRule('F', 'FF-[XY]+[XY]'), 
          new LRule('X', '+FY'), 
          new LRule('Y', '-FX')
        ],
        maxGenerations: 8,
        customOps: [ Repo.commonCustoms.get('dummy')('Y') ]
      }],
      [Repo.BUSH_3, {
        lenFunc: () => {
          let lens = [1, 150, 65, 30, 14.5, 7.2, 3.5, 1.75];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.8, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(20),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.green(), SketchColor.white()
        ).stringify(), ROUND),
        axiom: 'F',
        rules: [ new LRule('F', 'F[+F]F[-F][F]') ],
        maxGenerations: 6
      }],
      [Repo.BUSH_4, {
        lenFunc: () => {
          let lens = [1, 90, 35, 16, 8, 4, 2, 1.75, 0.87];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 4;
          return gen => initWid * Math.pow(0.75, gen);
        },
        positionFunc: () => gen => createVector(width/2, height),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(22.5),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.greenyellow(), SketchColor.yellow(), SketchColor.greenyellow()
        ).stringify(), ROUND),
        axiom: 'F',
        rules: [ new LRule('F', 'FF+[+F-F-F]-[-F+F+F]') ],
        maxGenerations: 5
      }],
      [Repo.BUSH_5, {
        lenFunc: () => {
          let lens = [1, 150, 56, 22.5, 12, 10, 6];
          return gen => lens[gen];
        },
        widFunc: () => {
          let initWid = 3;
          return gen => initWid * Math.pow(0.9, gen);
        },
        positionFunc: () => gen => createVector(width / 3, height * 2 / 3),
        initAngleFunc: () => gen => 0,
        angleFunc: () => gen => radians(18),
        drawUnitFunc: () => drawLineFunc(SketchColor.blend(
          SketchColor.yellow(), SketchColor.orange(), SketchColor.grey()
        ).stringify(), ROUND),
        axiom: 'X',
        rules: [ 
          new LRule('F', 'FXF[-F[-FX]+FX]'), 
          new LRule('X', 'F++F')
        ],
        maxGenerations: 6
      }],
      
      [Repo.PHYLLOTAXIS_1, this.phyllotaxisConfig(
        137.3, SketchColor.blend(
          SketchColor.skyblue(), SketchColor.yellow(), SketchColor.white()).stringify()
      )], 
      [Repo.PHYLLOTAXIS_2, this.phyllotaxisConfig(
        137.5, SketchColor.blend(
          SketchColor.violet(), SketchColor.white(), SketchColor.white()).stringify()
      )], 
      [Repo.PHYLLOTAXIS_3, this.phyllotaxisConfig(
        137.6, SketchColor.blend(
          SketchColor.green(), SketchColor.white(), SketchColor.white()).stringify()
      )]
    ]);
  }

  phyllotaxisConfig(angle, color) {
    return {
      lenFunc: () => gen => 5,
      widFunc: () => gen => 2,
      positionFunc: () => gen => createVector(width/2, height/2),
      initAngleFunc: () => gen => 0,
      angleFunc: () => gen => radians(angle),
      drawUnitFunc: () => {},
      axiom: 'S[D]X',
      rules: [ new LRule('X', '+[D]X+[D]X') ],
      maxGenerations: 10,
      customOps: [
        {
          command: 'S', // store n (num of petals)
          func: sys => sys.addCustomProp('gen', 0)
        },
        {
          command: 'D', // draw petal at distance according to formula
          func: sys => {
            stroke(color);
            strokeWeight(1);
            fill(color);
            sys.addCustomProp('gen', (sys.getCustomProp('gen')+1));
            translate(0, -sys._len * Math.sqrt(sys.getCustomProp('gen')));
            circle(0, 0, 3);
          }
        }
      ]
    }
  }

}

Repo.CANTOR = 'cantor';
Repo.CANTOR_A = 'cantor-asymmetric';
Repo.CANTOR_PERP = 'cantor-perp';
Repo.VICSEK_SF = 'vicsek-snowflake';

Repo.KOCH_C = 'koch-curve';
Repo.KOCH_C_V = 'koch-curve-variant';
Repo.KOCH_SF = 'koch-snowflake';
Repo.KOCH_X_SF = 'koch-anti-snowflake';
Repo.CESARO_X_SF = 'cesaro-anti-snowflake';

Repo.MINKOWSKI_C = 'minkowski-curve';
Repo.MINKOWSKI_SF = 'minkowski-snowflake';
Repo.MINKOWSKI_SF_V1 = 'minkowski-snowflake-variant';
Repo.MINKOWSKI_SF_V2 = 'minkowski-snowflake-variant-2';

Repo.SIERPINSKI_T = 'sierpinski-triangle';
Repo.SIERPINSKI_G = 'sierpinski-gasket';
Repo.SIERPINSKI_C = 'sierpinski-carpet';
Repo.SIERPINSKI_P = 'sierpinski-pentagon';
Repo.SIERPINSKI_S = 'sierpinski-square';
Repo.SIERPINSKI_CR = 'sierpinski-curve';

Repo.QUAD_PATT_1 = 'quadratic-pattern-1';
Repo.QUAD_PATT_2 = 'quadratic-pattern-2';
Repo.QUAD_PATT_3 = 'quadratic-pattern-3';
Repo.QUAD_PATT_4 = 'quadratic-pattern-4'; // krishna anklets
Repo.QUAD_PATT_5 = 'quadratic-pattern-5'; // crystal
Repo.QUAD_PATT_6 = 'quadratic-pattern-6'; // Quadratic Snowflake
Repo.QUAD_PATT_7 = 'quadratic-pattern-7'; // Kolam

Repo.TERDRAGON = 'terdragon';
Repo.TRI_PATT_1 = 'triangle-pattern-1';
Repo.TRI_PATT_1A = 'triangle-pattern-1-alt';

Repo.CIR_PATT_1 = 'circle-pattern-1';
Repo.CIR_PATT_2 = 'circle-pattern-2';

Repo.PEANO_C = 'peano-curve';
Repo.HILBERT_C = 'hilbert-curve';
Repo.MOORE_C = 'moore-curve';
Repo.DRAGON_C = 'dragon-curve';
Repo.LEVY_C = 'levy-curve';
Repo.GOSPER_C = 'gosper-curve';

Repo.BINARY_T = 'binary-tree';
Repo.TRINARY_T = 'trinary-tree';
Repo.RANDOM_T = 'random-tree';
Repo.PYTHAGOREAN_T = 'pythagorean';

Repo.STICKS_1 = 'sticks-1';
Repo.STICKS_2 = 'sticks-2';
Repo.STICKS_3 = 'sticks-3';
Repo.STICKS_4 = 'sticks-4';
Repo.STICKS_5 = 'sticks-5';
Repo.STICKS_6 = 'sticks-6';

Repo.BUSH_1 = 'bush-1';
Repo.BUSH_2 = 'bush-2';
Repo.BUSH_3 = 'bush-3';
Repo.BUSH_4 = 'bush-4';
Repo.BUSH_5 = 'bush-5'; // nest

Repo.PHYLLOTAXIS_1 = 'phyllotaxis-1';
Repo.PHYLLOTAXIS_2 = 'phyllotaxis-2';
Repo.PHYLLOTAXIS_3 = 'phyllotaxis-3';

Repo.commonCustoms = new Map([
  ['storeLenWid', {
    command: 'S',
    func: sys => {
      sys.addCustomProp('lStk', []);
      sys.addCustomProp('wStk', []);
    }
  }], 
  ['pushLenWid', {
    command: '(',
    func: sys => {
      sys.getCustomProp('lStk').push(sys.getLen());
      sys.getCustomProp('wStk').push(sys.getWid());
    }
  }], 
  ['popLenWid', {
    command: ')',
    func: sys => {
      sys.setLen(sys.getCustomProp('lStk').pop());
      sys.setWid(sys.getCustomProp('wStk').pop());
    }
  }],
  ['setLenWid', (lenMult, widMult) => {
    return {
      command: 'H',
      func: sys => {
        sys.setLen(sys.getLen() * lenMult);
        sys.setWid(sys.getWid() * widMult);
      }
    }
  }],
  ['dummy', command => {
    return {
      command,
      func: sys => sys._opsMap.get('X')(sys)
    }
  }],
  ['forward', command => {
    return {
      command,
      func: sys => sys._opsMap.get('F')(sys)
    }
  }],
  ['markTriangle', {
    command: 'O',
    func: sys => {
      stroke(SketchColor.red().stringify());
      strokeCap(ROUND);
      strokeWeight(4);
      sys._opsMap.get('[')(sys)
      line(0, 0, 0, -sys._len);
      sys._opsMap.get('f')(sys)
      sys._opsMap.get('+')(sys)
      line(0, 0, 0, -sys._len);
      sys._opsMap.get('f')(sys)
      sys._opsMap.get('+')(sys)
      line(0, 0, 0, -sys._len);
      sys._opsMap.get(']')(sys)
    }
  }]
]);