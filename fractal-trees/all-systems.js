class AllSystems {
  constructor(gens, system) {
    this._lSystem = new LSystem(this.createSystem(gens, system));
  }

  createSystem(gens, system) {
    let proto = AllSystems.ALL[system-1];
    return {
      axiom: proto.axiom,
      rules: proto.rules,
      angle: radians(proto.angle),
      len: proto.lens[gens-1],
      generations: gens,
      color: proto.color,
      min_generations: proto.min_generations,
      max_generations: proto.max_generations
    };
  }

  show() {
    let output = this._lSystem.generateOutput();
    this._lSystem.render(output);
  }
}

AllSystems.generationsInfo = function(system) {
  let genInfo = (({ min_generations, max_generations }) => 
      ({ min_generations, max_generations }))(AllSystems.ALL[system-1]);
  return genInfo;
};

AllSystems.ONE = {
  lens: [150, 50, 22, 10, 5, 2.5, 1.2],
  axiom: 'X',
  rules: [
    new LRule('F', 'FF'), 
    new LRule('X', '-F[+F][---X]+F-F[++++X]-X')],
  angle: 8,
  color: SketchColor.greenyellow().stringify(),
  min_generations: 1,
  max_generations: 7
};

AllSystems.TWO = {
  lens: [150, 50, 25, 12, 5.8, 2.8, 1.4],
  axiom: 'X',
  rules: [
    new LRule('F', 'FF'), 
    new LRule('X', 'F-[[X]+X]+F[+FX]-X')],
  angle: 22.5,
  color: SketchColor.green().stringify(),
  min_generations: 1,
  max_generations: 7
};

AllSystems.THREE = {
  lens: [180, 70, 32, 15, 7.5, 3.8, 1.9],
  axiom: 'X',
  rules: [new LRule('F', 'FF'), new LRule('X', 'F[+X]F[-X]+X')],
  angle: 20,
  color: SketchColor.blend(SketchColor.green(), SketchColor.orange()).stringify(),
  min_generations: 1,
  max_generations: 7
};

// Barnsley fern
AllSystems.FOUR = {
  lens: [150, 55, 25, 12, 6, 3],
  axiom: 'X',
  rules: [
    new LRule('F', 'FF'), 
    new LRule('X', 'F+[[X]-X]-F[-FX]+X')],
  angle: 25,
  color: SketchColor.blend(SketchColor.green(), SketchColor.red(), SketchColor.white()).stringify(),
  min_generations: 1,
  max_generations: 6
};

AllSystems.FIVE = {
  lens: [90, 35, 17, 8.5, 4],
  axiom: 'F',
  rules: [new LRule('F', 'FF+[+F-F-F]-[-F+F+F]')],
  angle: 25,
  color: SketchColor.blend(SketchColor.green(), SketchColor.yellow()).stringify(),
  min_generations: 1,
  max_generations: 5
};

AllSystems.SIX = {
  lens: [150, 45, 20, 10, 4.8, 2.3],
  axiom: 'X',
  rules: [
    new LRule('F', 'FF'), 
    new LRule('X', 'F+[-F-XF-X][+FF][--XF[+X]][++F-X]')],
  angle: 20,
  color: SketchColor.blend(SketchColor.green(), SketchColor.white()).stringify(),
  min_generations: 1,
  max_generations: 6
};

AllSystems.ALL = [AllSystems.ONE, AllSystems.TWO, AllSystems.THREE, 
  AllSystems.FOUR, AllSystems.FIVE, AllSystems.SIX];