class MesPaint extends PhoneApp {

  constructor() {
    super('MesPaint', '/sim-phone/img/app-icons/mesPaint.png');

    this._tools = new Map();
    for (let t of MesPaint.TOOLS_MENU_ORDER) 
      this._tools.set(t, {});
    for (let s of MesPaint.SELECTORS_ORDER) 
      this._tools.set(s, {});

    this._colors = new Map();
    this._strokes = new Map();
  }

  build() {
    super.build();
    this._appRoot.style.backgroundColor = 'rgb(232, 247, 230)';
    this.buildCanvas();
    this.buildTools();
  }

  buildCanvas() {
    let canvasHolder = document.createElement('div');
    this.css(canvasHolder, MesPaint.CANVAS_HOLDER_STYLE);

    this._canvas = document.createElement('canvas');
    this._canvas.width = MesPaint.CANVAS_WD;
    this._canvas.height = MesPaint.CANVAS_HT;
    this.css(this._canvas, { width: MesPaint.CANVAS_WD + 'px', height: MesPaint.CANVAS_HT + 'px' });
    canvasHolder.appendChild(this._canvas);

    this._appRoot.appendChild(canvasHolder);
  }

  buildTools() {
    let toolsHolder = document.createElement('div');
    this.css(toolsHolder, MesPaint.TOOLS_HOLDER_STYLE);

    this.buildToolsMenu(toolsHolder);
    this.buildSelectorMenu(toolsHolder);
    this.buildColorSelectionMenu(toolsHolder);
    this.buildStrokeSelectionMenu(toolsHolder);

    this._appRoot.appendChild(toolsHolder);
  }

  buildToolsMenu(toolsHolder) {
    this._toolsMenu = document.createElement('div');
    this.css(this._toolsMenu, MesPaint.TOOLS_MENU_STYLE);
    toolsHolder.appendChild(this._toolsMenu);

    for (let t of MesPaint.TOOLS_MENU_ORDER) {
      let dom = document.createElement('div');
      this.css(dom, MesPaint.TOOL_STYLE);
      if (MesPaint.TOOL_ICON_MAP.has(t)) {
        dom.style.backgroundImage = 'url(' + MesPaint.TOOL_ICON_MAP.get(t) + ')';
      }
      this._toolsMenu.appendChild(dom);
      this._tools.get(t).dom = dom;
    }
  }

  buildSelectorMenu(toolsHolder) {
    let selectorMenu = document.createElement('div');
    this.css(selectorMenu, MesPaint.SELECTOR_STYLE);
    toolsHolder.appendChild(selectorMenu);

    for (let s of MesPaint.SELECTORS_ORDER) {
      let dom = document.createElement('div');
      this.css(dom, MesPaint.TOOL_STYLE);
      if (MesPaint.TOOL_ICON_MAP.has(s)) {
        dom.style.backgroundImage = 'url(' + MesPaint.TOOL_ICON_MAP.get(s) + ')';
      }
      selectorMenu.appendChild(dom);
      this._tools.get(s).dom = dom;
    }
  }

  buildColorSelectionMenu(toolsHolder) {
    this._colorSelectionMenu = document.createElement('div');
    this.css(this._colorSelectionMenu, MesPaint.COLOR_SELECTION_STYLE);
    toolsHolder.appendChild(this._colorSelectionMenu);

    for (let c = 1; c <= MesPaint.COLORS_ORDER.length; c++) {
      let dom = document.createElement('div');
      this.css(dom, { backgroundColor: MesPaint.COLORS_ORDER[c-1], border: '1px solid white' });
      this._colorSelectionMenu.appendChild(dom);
      this._colors.set( 'c'+c, { color: MesPaint.COLORS_ORDER[c-1], dom: dom } );
    }
  }

  buildStrokeSelectionMenu(toolsHolder) {
    this._strokeSelectionMenu = document.createElement('div');
    this.css(this._strokeSelectionMenu, MesPaint.STROKE_SELECTION_STYLE);
    toolsHolder.appendChild(this._strokeSelectionMenu);

    for (let s = 1; s <= 5; s++) {
      let dom = document.createElement('div');
      this.css(dom, MesPaint.STROKE_SELECT_TOOL);
      dom.style.backgroundImage = 'url(' + MesPaint.STROKES_BG_IMG[s-1] + ')';
      this._strokeSelectionMenu.appendChild(dom);
      this._strokes.set( 's'+s, { wt: s, dom } );
    }
  }

  postBuild() {
    this.addColorSelectionBehaviors();
    this.addStrokeSelectionBehaviors();
    this.addCanvasBehavior();
    this.addDrawingToolsBehavior();
    this.addUndoToolBehavior();
    this.addSaveToolBehavior();

    this.setupKeyEvents();
  }

  addColorSelectionBehaviors() {
    this._tools.get('C').dom.addEventListener('click', e => this.hideAllShowOne(this._colorSelectionMenu));
    this._services.registerEvent('ColorChange', () => {
      let c = this._services.memoryRetrieve('color');
      this._tools.get('C').dom.style.backgroundColor = c;
    });

    let colorSelectedEvent = c => {
      return e => {
        this._services.memoryStore('color', this._colors.get(c).color);
        this._services.dispatchEvent( 'ColorChange', {} );
        this.hideAllShowOne(this._toolsMenu);
      };};

    for (let c of this._colors.keys()) 
      this._colors.get(c).dom.addEventListener('click', colorSelectedEvent(c));
    
    this._colors.get('c1').dom.click();
  }

  addStrokeSelectionBehaviors() {
    this._tools.get('Z').dom.addEventListener('click', e => this.hideAllShowOne(this._strokeSelectionMenu));
    this._services.registerEvent('StrokeChange', e => {
      let s = this._services.memoryRetrieve('strokeWt');
    });

    let strokeSelectedEvent = s => {
      return e => {
        this._services.memoryStore('strokeWt', this._strokes.get(s).wt);
        this._services.dispatchEvent( 'StrokeChange', {} );
        for (let a = 1; a <= 5; a++)
          this._strokes.get('s'+a).dom.style.border = '2px white solid';
        this._strokes.get(s).dom.style.border = '2px rgba(14, 43, 10, 0.9) solid';
  
        this.hideAllShowOne(this._toolsMenu);
      };
    }; 

    for (let s of this._strokes.keys()) 
      this._strokes.get(s).dom.addEventListener('click', strokeSelectedEvent(s));
    
    this._strokes.get('s2').dom.click();
  }

  hideAllShowOne(showHolder) {
    this._toolsMenu.style.display = 'none';
    this._colorSelectionMenu.style.display = 'none';
    this._strokeSelectionMenu.style.display = 'none';
    showHolder.style.display = 'grid';
  }

  addCanvasBehavior() {
    let getMousePosition = e => {
      let rect = this._canvas.getBoundingClientRect();
      return { 
        x: Math.floor((e.clientX - rect.left) / MesPaint.CANVAS_SCALE), 
        y: Math.floor((e.clientY - rect.top) / MesPaint.CANVAS_SCALE) 
      };
    };

    let canvasMouseDown = e => {
      let pos = getMousePosition(e);
      this._services.dispatchEvent( 'DrawStart', { pos } );

      let mouseMove =  e => {
        let newPos = getMousePosition(e);
        if (newPos.x != pos.x || newPos.y != pos.y) {
          pos = newPos;
          this._services.dispatchEvent( 'DrawDrag', { pos } );
        }
      };
      let mouseUp = e => {
        pos = getMousePosition(e);
        this._canvas.removeEventListener('mousemove', mouseMove);
        this._canvas.removeEventListener('mouseout', mouseUp);
        this._canvas.removeEventListener('mouseup', mouseUp);
        this._services.dispatchEvent( 'DrawEnd', { pos } );
      };
      this._canvas.addEventListener('mousemove', mouseMove);
      this._canvas.addEventListener('mouseout', mouseUp);
      this._canvas.addEventListener('mouseup', mouseUp);
    };

    this._canvas.addEventListener('mousedown', canvasMouseDown);

    let storeCanvasEvent = e => {
      let cd = e.canvas;
      this._services.memoryStore('canvas', cd);
      cd.render(e.full);
    };

    this._services.registerEvent('StoreCanvas', storeCanvasEvent);

    this._services.dispatchEvent('StoreCanvas', { canvas : new CanvasData(this._canvas) } );
  }

  addDrawingToolsBehavior() {
    this.addToolSelectionBehavior();
    this._services.registerEvent('DrawStart', e => this._services.memoryRetrieve('drawing-tool').start(e));
    this._services.registerEvent('DrawDrag', e => this._services.memoryRetrieve('drawing-tool').drag(e));
    this._services.registerEvent('DrawEnd', e => this._services.memoryRetrieve('drawing-tool').end(e));

    // this.setupBrushTool();
    this.setupBrushToolSmoothened();
    this.setupShapeTool('L', this.drawLineAlgo); // setupLineTool
    this.setupShapeTool('R', this.drawRectAlgo); // setupRectTool
    this.setupShapeTool('O', this.drawCircleAlgo); // setupCircleTool
    // this.setupFillTool();
    this.setupFillToolOptimized();
    this.setupColorPicker();
  }

  addToolSelectionBehavior() {
    for (let t of MesPaint.DRAWING_TOOLS) 
      this._tools.get(t).dom.addEventListener('click', e => {
        MesPaint.DRAWING_TOOLS.forEach( t => this._tools.get(t).dom.style.border = '2px white solid' );
        this._services.memoryStore('drawing-tool', this._tools.get(t));
        this._tools.get(t).dom.style.border = '2px rgba(14, 43, 10, 0.3) solid';
      });
    
    this._tools.get('B').dom.click();
  }

  setupBrushTool() {
    let draw = e => {
      let canvas = this._services.memoryRetrieve('canvas');
      this._services.dispatchEvent('StoreCanvas', { 
        canvas : canvas
          .update( this.brushStroke(canvas, [{ x: e.pos.x, y: e.pos.y }], 
            this._services.memoryRetrieve('color'), this._services.memoryRetrieve('strokeWt') - 1) )
      } );
    };
    this._tools.get('B').start = draw;
    this._tools.get('B').drag = draw;
    this._tools.get('B').end = e => {
      draw(e);
      this._services.dispatchEvent('Log', {});
    };
  }

  setupBrushToolSmoothened() {
    let prevPos;
    let draw = e => {
      let canvas = this._services.memoryRetrieve('canvas');
      let color = this._services.memoryRetrieve('color');
      let updatedCanvas = this.drawLineAlgo(canvas, prevPos, color, e.pos, this.brushStroke, this._services);
      this._services.dispatchEvent('StoreCanvas', { canvas : updatedCanvas } );
    };
    this._tools.get('B').start = e => {
      prevPos = e.pos;
      draw(e);
    };
    this._tools.get('B').drag = e => {
      draw(e)
      prevPos = e.pos;
    };
    this._tools.get('B').end = e => {
      draw(e);
      prevPos = undefined;
      this._services.dispatchEvent('Log', {});
    };
  }

  setupShapeTool(tool, drawAlgo) {
    let canvas;
    let lastCanvas;
    let color;
    let startPos;
    let draw = e => drawAlgo(canvas, startPos, color, e.pos, this.brushStroke, this._services);
    this._tools.get(tool).start = e => {
      canvas = this._services.memoryRetrieve('canvas');
      color = this._services.memoryRetrieve('color');
      startPos = e.pos;
    };
    this._tools.get(tool).drag = e => {
      lastCanvas = draw(e);
      lastCanvas.render(true);
    };
    this._tools.get(tool).end = e => {
      this._services.dispatchEvent( 'StoreCanvas', { canvas : lastCanvas } );
      this._services.dispatchEvent('Log', {});
    };
  }

  drawLineAlgo(canvas, startPos, color, endPos, brushStroke, services) {
    let stWt = services.memoryRetrieve('strokeWt') - 1;
    let linePoints = [];
    if (Math.abs(startPos.x - endPos.x) > Math.abs(startPos.y - endPos.y)) {
      if (startPos.x > endPos.x) [startPos, endPos] = [endPos, startPos];
      let slope = (endPos.y - startPos.y) / (endPos.x - startPos.x);
      for (let {x , y} = startPos; x <= endPos.x; x++) {
        linePoints.push({ x, y: Math.round(y) });
        y += slope;
      }
    } else {
      if (startPos.y > endPos.y) [startPos, endPos] = [endPos, startPos];
      let slope = (endPos.x - startPos.x) / (endPos.y - startPos.y);
      for (let {x , y} = startPos; y <= endPos.y; y++) {
        linePoints.push({ x: Math.round(x), y });
        x += slope;
      }
    }
    return canvas.update(brushStroke(canvas, linePoints, color, stWt));
  }

  brushStroke(canvas, points, color, stWt) {
    let drawn = [];
    let visited = new Array(canvas._wd * canvas._ht).fill(false);
    for (let lp of points) {
      for (let x = lp.x - stWt; x <= lp.x + stWt; x++) {
        for (let y = lp.y - stWt; y <= lp.y + stWt; y++) {
          if (!visited[canvas.index(x, y)]) {
            drawn.push( { x, y, color } );
            visited[canvas.index(x, y)] = true;
          }
        }
      }
    }
    return drawn;
  }

  drawRectAlgo(canvas, startPos, color, endPos) {
    let minX = Math.min(startPos.x, endPos.x);
    let minY = Math.min(startPos.y, endPos.y);
    let maxX = Math.max(startPos.x, endPos.x);
    let maxY = Math.max(startPos.y, endPos.y);
    let drawn = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        drawn.push({ x, y, color });
      }
    }
    return canvas.update(drawn);
  }

  drawCircleAlgo(canvas, startPos, color, endPos) {
    let rSq = (endPos.x - startPos.x) * (endPos.x - startPos.x) + (endPos.y - startPos.y) * (endPos.y - startPos.y);
    let rCeil = Math.ceil(Math.sqrt(rSq));
    let drawn = [];
    for (let rx = -rCeil; rx <= rCeil; rx++) {
      for (let ry = -rCeil; ry <= rCeil; ry++) {
        let dSq = rx * rx + ry * ry;
        if (dSq > rSq) continue;
        let x = startPos.x + rx, y = startPos.y + ry;
        if (x < 0 || x >= canvas._wd || y < 0 || y >= canvas._ht) continue;
        drawn.push({ x, y, color });
      }
    }
    return canvas.update(drawn);
  }

  setupFillTool() {
    this._tools.get('F').start = () => {};
    this._tools.get('F').drag = () => {};

    this._tools.get('F').end = e => {
      this._services.showLoadingScreen();
      let color = this._services.memoryRetrieve('color');
      let canvas = this._services.memoryRetrieve('canvas');
      let targetC = canvas.pixel(e.pos.x, e.pos.y);
      let services = this._services;
      setTimeout(() => {
        let drawn = [ { x: e.pos.x, y: e.pos.y, color } ];
        for (let done = 0; done < drawn.length; done++) {
          for (let { x, y } of MesPaint.FILL_TOOL_NEIGHBORS) {
            let newX = drawn[done].x + x, newY = drawn[done].y + y;
            if (newX >= 0 && newX < canvas._wd && newY >= 0 && newY < canvas._ht 
              && canvas.pixel(newX, newY) == targetC && !drawn.some( d => d.x == newX && d.y == newY )) 
                drawn.push( { x: newX, y: newY, color } );
          }
        }
        services.dispatchEvent('StoreCanvas', 
          { canvas : services.memoryRetrieve('canvas').update(drawn), full: true } );
        services.hideLoadingScreen();
        services.dispatchEvent('Log', {});
      }, 20);
    };
  }

  // Span fill algorithm from wikipedia (https://en.wikipedia.org/wiki/Flood_fill)
  setupFillToolOptimized() {
    this._tools.get('F').start = () => {};
    this._tools.get('F').drag = () => {};

    this._tools.get('F').end = e => {
      let color = this._services.memoryRetrieve('color');
      let canvas = this._services.memoryRetrieve('canvas');
      let targetC = canvas.pixel(e.pos.x, e.pos.y);

      let filled = new Array(canvas._wd * canvas._ht).fill(false);
      let drawn = [];

      let inside = (x, y) => x >= 0 && x < canvas._wd && y >= 0 && y < canvas._ht 
        && canvas.pixel(x, y) == targetC && !filled[canvas.index(x, y)];
      
      let set = (x, y) => {
        drawn.push( { x, y, color } );
        filled[canvas.index(x, y)] = true;
      };
      
      let x = e.pos.x, y = e.pos.y;
      if (!inside(x, y)) return;
      let s = [];
      s.push( {x1: x, x2: x, y, dy: 1} );
      s.push( {x1: x, x2: x, y: y-1, dy: -1} );
      while (s.length > 0) {
        let { x1, x2, y, dy} = s.pop();
        let x = x1;
        if (inside(x, y)) {
          while (inside(x - 1, y)) {
            set(x - 1, y);
            x--;
          }
        }
        if (x < x1) s.push( {x1: x, x2: x1-1, y: y-dy, dy: -dy} );
        while (x1 < x2) {
          while (inside(x1, y)) {
            set(x1, y);
            x1++;
          }
          s.push( {x1: x, x2: x1-1, y: y+dy, dy} );
          if (x1 - 1 > x2) s.push( {x1: x2+1, x2: x1-1, y: y-dy, dy: -dy} );
          while (x1 < x2 && !inside(x1, y)) 
            x1++;
          x = x1;
        }
      }

      this._services.dispatchEvent('StoreCanvas', 
        { canvas : this._services.memoryRetrieve('canvas').update(drawn), full: true } );
      this._services.hideLoadingScreen();
      this._services.dispatchEvent('Log', {});
    };
  }

  setupColorPicker() {
    this._tools.get('P').start = () => {};
    this._tools.get('P').drag = () => {};
    this._tools.get('P').end = e => {
      let color = this._services.memoryRetrieve('canvas').pixel(e.pos.x, e.pos.y);
      this._services.memoryStore('color', color);
      this._services.dispatchEvent( 'ColorChange', {} );
    };
  }

  addUndoToolBehavior() {
    this._services.memoryStore('canvasStack', []);
    this._services.registerEvent('Log', e => this._services.memoryRetrieve('canvasStack').push(
      this._services.memoryRetrieve('canvas')));
    this._services.dispatchEvent('Log', {});

    let undoClickedEvent = e => {
      if (this._services.memoryRetrieve('canvasStack').length < 2) return;
      let stack = this._services.memoryRetrieve('canvasStack');
      stack.pop();
      let canvas = stack[stack.length - 1];
      this._services.memoryStore('canvas', canvas);
      canvas.render(true);
    };
    this._tools.get('U').dom.addEventListener('click', undoClickedEvent);
  }

  addSaveToolBehavior() {
    let saveClickedEvent = e => {
      let link = document.createElement('a');
      link.setAttribute('href', this._canvas.toDataURL());
      link.setAttribute('download', 'mesArt.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    
    this._tools.get('S').dom.addEventListener('click', saveClickedEvent);
  }

  loadImage() {
    let startLoad = () => {
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.addEventListener('change', () => finishLoad(input.files[0]));
      document.body.appendChild(input);
      input.click();
      input.remove();
    };

    let finishLoad = file => {
      if (file == null) return;
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        let image = document.createElement('img');
        image.setAttribute('src', reader.result);
        image.addEventListener('load', () => picFromImage(image));
      });
      reader.readAsDataURL(file);
    };

    let picFromImage = img => {
      if (img.width != MesPaint.CANVAS_WD || img.height != MesPaint.CANVAS_HT) {
        console.error('Not a Loadable image!');
        return;
      }
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let cx = canvas.getContext('2d');
      cx.drawImage(img, 0, 0);
      let pixels = [];
      let { data } = cx.getImageData(0, 0, img.width, img.height);
      function hex(n) {
        return n.toString(16).padStart(2, '0');
      }
      let currCanvas = this._services.memoryRetrieve('canvas');
      for (let y = 0; y < currCanvas._ht; y++) {
        for (let x = 0; x < currCanvas._wd; x++) {
          let i = ((y * 2) * img.width + (x * 2)) * 4;
          let [r, g, b] = data.slice(i, i + 3);
          pixels.push("#" + hex(r) + hex(g) + hex(b));
        }
      }
      currCanvas._pixels = pixels;
      currCanvas._previous = null;
      this._services.dispatchEvent('StoreCanvas', { canvas : currCanvas } );
      this._services.memoryStore('canvasStack', []);
      this._services.dispatchEvent('Log', {});
    };

    startLoad();
  }

  setupKeyEvents() {
    let keyPressedFunc = e => {
      if (e.key === 'l') {
        this.loadImage();
      }
    };
    this._canvas.setAttribute("tabindex", 0);
    this._canvas.addEventListener('keydown', keyPressedFunc);
  }

}

class CanvasData {

  constructor(canvas, pixels = CanvasData.generateBlankPixelArray(), previous = null) {
    this._pixels = pixels;
    this._wd = Math.ceil(MesPaint.CANVAS_WD / MesPaint.CANVAS_SCALE);
    this._ht = Math.ceil(MesPaint.CANVAS_HT / MesPaint.CANVAS_SCALE);
    this._canvas = canvas;
    this._previous = previous;
  }

  update(drawn) {
    let copy = this._pixels.slice();
    for (let p of drawn) 
      copy[p.x + p.y * this._wd] = p.color;
    return new CanvasData(this._canvas, copy, this);
  }

  render(full = false) {
    let cx = this._canvas.getContext("2d");
    for (let y = 0; y < this._ht; y++) {
      for (let x = 0; x < this._wd; x++) {
        let color = this.pixel(x, y);
        if (this._previous == null || full || (!full && this._previous.pixel(x, y) != color)) {
          cx.fillStyle = color;
          cx.fillRect(x * MesPaint.CANVAS_SCALE, y * MesPaint.CANVAS_SCALE, 
            MesPaint.CANVAS_SCALE, MesPaint.CANVAS_SCALE);
        }
      }
    }
  }

  pixel(x, y) {
    return this._pixels[x + y * this._wd];
  }

  index(x, y) {
    return (x + y * this._wd);
  }
}

CanvasData.generateBlankPixelArray = () => {
  return new Array(
    Math.ceil(MesPaint.CANVAS_WD / MesPaint.CANVAS_SCALE) 
    * Math.ceil(MesPaint.CANVAS_HT / MesPaint.CANVAS_SCALE)).fill('#ffffff')
};

// constants

MesPaint.CANVAS_WD = 225;
MesPaint.CANVAS_HT = 250;
MesPaint.CANVAS_SCALE = 2;

MesPaint.TOOLS_MENU_ORDER = ['B', 'R', 'F', 'U', 'L', 'O', 'P', 'S'];
MesPaint.DRAWING_TOOLS = ['B', 'R', 'L', 'O', 'F', 'P'];
MesPaint.SELECTORS_ORDER = ['C', 'Z'];
MesPaint.COLORS_ORDER = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#e6e4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
  '#000040', '#800000', '#ff8080', '#ff80ff', '#ffff80', '#808040', '#008040', '#004080', '#000080', '#800080'
];
MesPaint.STROKES_BG_IMG = [
  './img/mes-paint/stroke_1.png', './img/mes-paint/stroke_2.png', './img/mes-paint/stroke_3.png', 
  './img/mes-paint/stroke_4.png', './img/mes-paint/stroke_5.png'
];
MesPaint.TOOL_ICON_MAP = new Map([
  ['B', './img/mes-paint/brushTool.png'], ['L', './img/mes-paint/lineTool.png'], 
  ['R', './img/mes-paint/rectTool.png'], ['O', './img/mes-paint/circTool.png'], 
  ['F', './img/mes-paint/fillTool.png'], ['P', './img/mes-paint/pickTool.png'], 
  ['U', './img/mes-paint/undoTool.png'], ['S', './img/mes-paint/saveTool.png'], 
  ['Z', './img/mes-paint/strokeSelect.png']
]);
MesPaint.FILL_TOOL_NEIGHBORS = [ { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 } ];

// styles

MesPaint.CANVAS_HOLDER_STYLE = {
  height: '250px',
  backgroundColor: 'white'
};

MesPaint.TOOLS_HOLDER_STYLE = {
  height: '55px',
  backgroundColor: 'rgb(232, 247, 230)', 
  display: 'grid', 
  gridTemplateColumns: '4fr 1fr',
  gridTemplateAreas: '"tools selectors"'
};

MesPaint.TOOLS_MENU_STYLE = {
  gridArea: 'tools',
  display: 'grid', 
  gridTemplateRows: '1fr 1fr', 
  gridTemplateColumns: 'repeat(4, 1fr)'
};

MesPaint.TOOL_STYLE = {
  border: '2px white solid',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain'
};

MesPaint.SELECTOR_STYLE = {
  gridArea: 'selectors',
  display: 'grid', 
  gridTemplateRows: '1fr 1fr',
  gridTemplateCols: '1fr'
};

MesPaint.COLOR_SELECTION_STYLE = {
  display: 'grid', 
  gridTemplateRows: 'repeat(3, 1fr)', 
  gridTemplateColumns: 'repeat(10, 1fr)'
};

MesPaint.STROKE_SELECTION_STYLE = {
  display: 'grid', 
  gridTemplateRows: '1fr', 
  gridTemplateColumns: 'repeat(5, 1fr)'
};

MesPaint.STROKE_SELECT_TOOL = {
  border: '1px solid black',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '100%',
  height: '100%'
};