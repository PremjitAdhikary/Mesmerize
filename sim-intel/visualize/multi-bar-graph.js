/**
 * Just like any run of the mill multi bar graph.
 * 
 * The graph can show multiple values for each label
*/
class MultiBarGraph {
  
  /**
   * 
   * @param {*} len length of the bar graph
   * @param {*} wid width of the bar graph
   * @param {*} init initial value, denoted in the left of x axis
   * @param {*} max max value, denoted in the right of the x axis
   * @param {*} labels the labels stacked on the left eg: ['label1', 'label2', 'label3']
   * @param {*} colors colors of the multiple bars for every label ['color1', 'color2']
   */
  constructor(len, wid, init, max, labels, colors) {
    this._len = len;
    this._wid = wid;
    this._init = init;
    this.updateMax(max);
    this._labels = labels;
    this._colors = colors;
    this._x = 0;
    this._y = 0;
    this._values = [];
    for (let color of colors) {
      this._values.push(new Array(this._labels.length).fill(0));
    }
    this._lineLight = SketchColor.white().alpha(0.3).stringify();
  }

  updateMax(max) {
    this._max = Math.ceil(max/10)*10;
  }

  /**
   * Send array of values one for each color. So as per the constructor example, the arguments 
   * should be:
   * arg1 = ['label1-color1', 'label2-color1', 'label3-color1']
   * arg2 = ['label1-color2', 'label2-color2', 'label3-color2']
   */
  updateValues() {
    if (arguments.length != this._values.length) {
      throw 'Values dont match Initialized colors'; // better exceptin later
    }
    for (let i=0; i<arguments.length; i++) {
      if (arguments[i].length != this._labels.length) {
        throw 'Values dont match Initialized labels';
      }
      for (let j=0; j<this._labels.length; j++) {
        this._values[i][j] = arguments[i][j];
      }
    }
  }

  show() {
    stroke(this._lineLight);
    let xOffset = this._len / 10;
    for (let i=1; i<10; i++) {
      line(this._x + MultiBarGraph.BAR_OFFSET + xOffset * i, this._y, 
        this._x + MultiBarGraph.BAR_OFFSET + xOffset * i, this._y + this._wid);
    }
    stroke(0);
    textSize(8);
    fill(255);
    let initText = ''+this._init;
    let tWid = textWidth(initText);
    text(initText, this._x + MultiBarGraph.BAR_OFFSET - tWid/2, this._y + this._wid + 10);
    let midText = '' + Math.round((this._max-this._init)/2);
    tWid = textWidth(midText);
    text(midText, this._x + MultiBarGraph.BAR_OFFSET + this._len/2 - tWid/2, this._y + this._wid + 10);
    let maxText = ''+this._max;
    tWid = textWidth(maxText);
    text(maxText, this._x + MultiBarGraph.BAR_OFFSET + this._len - tWid/2, this._y + this._wid + 10);
    let yOffset = 10;
    let incr = this._wid / this._labels.length;
    let barWid = incr / (this._colors.length + 1);
    for (let l=0; l<this._labels.length; l++) {
      tWid = textWidth(this._labels[l]);
      fill(255);
      text(this._labels[l], MultiBarGraph.BAR_OFFSET - tWid, this._y + yOffset);
      for (let c=0; c<this._colors.length; c++) {
        let vData = this._values[c][l];
        let vLength = map(vData, this._init, this._max, 0, this._len);
        fill(this._colors[c]);
        rect(this._x + MultiBarGraph.BAR_OFFSET, 
          this._y + yOffset - 10 + barWid * c, 
          vLength, barWid);
      }
      stroke(this._lineLight);
      line(this._x + MultiBarGraph.BAR_OFFSET, this._y + yOffset + barWid,
        this._x + MultiBarGraph.BAR_OFFSET + this._len, this._y + yOffset + barWid);

      yOffset += incr;
    }

    stroke(255);
    noFill();
    rect(this._x + MultiBarGraph.BAR_OFFSET, this._y, this._len, this._wid);
  }
}

MultiBarGraph.BAR_OFFSET = 25;