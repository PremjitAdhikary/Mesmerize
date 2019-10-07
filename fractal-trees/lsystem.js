class LSystem {

  constructor(system) {
    this._system = system;
  }

  generateOutput() {
    let output = this._system.axiom;
    for (let i=0; i<this._system.generations; i++) {
      output = this.generate(output, this._system.rules);
    }
    return output;
  }

  generate(input, rules) {
    let output = '';
    for (let i=0; i<input.length; i++) {
      let c = input.charAt(i);
      let found = false;
      for (let r of rules) {
        if (r.match(c)) {
          output += r._output;
          found = true;
          break;
        }
      }
      if (!found)
        output += c;
    }
    return output;
  }

  render(generatedOutput) {
    background(0);
    stroke(this._system.color);
    resetMatrix();
    translate(width/2, height);
    for (let i=0; i<generatedOutput.length; i++) {
      let c = generatedOutput.charAt(i);
      LSystem.turtle[c](this._system);
    }
  }
}

LSystem.turtle = {};
LSystem.turtle['F'] = (s) => {
  line(0,0,0,-s.len);
  translate(0,-s.len);
};
LSystem.turtle['+'] = (s) => {
  rotate(s.angle);
};
LSystem.turtle['-'] = (s) => {
  rotate(-s.angle);
};
LSystem.turtle['['] = (s) => {
  push();
};
LSystem.turtle[']'] = (s) => {
  pop();
};
LSystem.turtle['X'] = (s) => {
  // do nothing
};

class LRule {
  constructor(input, output) {
    this._input = input;
    this._output = output;
  }

  match(input) {
    return this._input == input;
  }
}