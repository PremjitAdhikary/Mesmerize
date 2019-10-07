/**
 * What is a Random Branch?
 * Unlike its super class, the sub branches are of different lengths and angles.
 * The input, angle will identify as the max angle between the extreme sub branches.
 * Similarly, length of all sub branches will wary between 0.5 and 0.8 length of the parent.
 */
class RandomBranch extends Branch {

  constructor(start, end, angle, color, branchColor, weight, level, maxBranches) {
    super(start, end, angle, color, branchColor, weight, level);
    this._maxBranches = maxBranches;

    this.branchOut();
  }

  branchOut() {
    if (!this._maxBranches || this._level <= 1) return;
    this._branches = [];

    let mb = random(1,this._maxBranches);
    let numOfBranches = round(mb);
    let branchPos = [0,1,2,3,4,5];
    shuffle(branchPos, true);

    for (let i=0; i<numOfBranches; i++) {
      let dir = p5.Vector.sub(this._end, this._start);
      dir.mult(random(0.5,0.8)); // shorten branch
      dir.rotate(-this._angle/2);
      let angMultiplier = branchPos.findIndex(pos => pos == i);
      dir.rotate(angMultiplier * this._angle / (branchPos.length-1));
      let subBranch = p5.Vector.add(this._end, dir);
      this._branches.push(new RandomBranch(
        this._end, subBranch, this._angle, this._color, this._branchColor, 
        max(1,this._weight-1), this._level-1, this._maxBranches));
    }
  }

}