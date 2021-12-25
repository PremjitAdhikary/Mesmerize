function drawPoly(xCords, yCords, strokeC, strokeW = 1, 
  doFill = false, fillColor = bgColor, doScribbleFill = false, scribXCords, scribYCords, 
  scribC = bgColor, scribW = 1, scribGap = 5, scribAngle = -30) {
  if (graphics == SCRIBBLE) {
    drawScribblePoly(xCords, yCords, strokeC, strokeW, doFill, fillColor, 
      doScribbleFill, scribXCords, scribYCords, scribC, scribW, scribGap, scribAngle);
  } else if (graphics == BASIC) {
    drawBasicPoly(xCords, yCords, strokeC, strokeW, doFill, fillColor, doScribbleFill, scribC);
  } else if (graphics == OUTLINE) {
    drawScribblePoly(xCords, yCords, strokeC, strokeW, doFill, fillColor, false);
  }
}

function drawBasicPoly(xCords, yCords, strokeC, strokeW, 
  doFill, fillColor, doScribbleFill, scribC) {
  strokeSetup(strokeC, strokeW);
  fillSetup((doFill || doScribbleFill), (doScribbleFill ? scribC : fillColor));
  beginShape();
  for (let i=0; i<xCords.length; i++) {
    vertex(xCords[i], yCords[i]);
  }
  endShape(CLOSE);
}

function drawScribblePoly(xCords, yCords, strokeC, strokeW, 
  doFill, fillColor, doScribbleFill, scribXCords, scribYCords, 
  scribC, scribW, scribGap, scribAngle) {
  if (doFill) {
    drawBasicPoly(xCords, yCords, strokeC, 0, true, fillColor);
  }
  if (doScribbleFill) {
    strokeSetup(scribC, scribW);
    scribble.scribbleFilling( scribXCords, scribYCords, scribGap, scribAngle );
  }
  strokeSetup(strokeC, strokeW);
  for (let i=0; i<xCords.length-1; i++) {
    scribble.scribbleLine( xCords[i], yCords[i], xCords[i+1], yCords[i+1] );
  }
  scribble.scribbleLine( xCords[0], yCords[0], xCords[xCords.length-1], yCords[xCords.length-1] );
}

function drawRect(x, y, w, h, strokeC, strokeW = 1, doFill = false, fillColor = bgColor) {
  if (graphics == SCRIBBLE || graphics == OUTLINE) {
    drawScribbleRect(x, y, w, h, strokeC, strokeW, doFill, fillColor);
  } else if (graphics == BASIC) {
    drawBasicRect(x, y, w, h, strokeC, strokeW, doFill, fillColor);
  }
}

function drawBasicRect(x, y, w, h, strokeC, strokeW, doFill, fillColor) {
  strokeSetup(strokeC, strokeW);
  fillSetup(doFill, fillColor);
  rect(x, y, w, h);
}

function drawScribbleRect(x, y, w, h, strokeC, strokeW, doFill, fillColor) {
  if (doFill) {
    drawBasicRect(x, y, w, h, strokeC, 0, true, fillColor);
  }
  strokeSetup(strokeC, strokeW);
  scribble.scribbleRect(x + w/2, y + h/2, w, h);
}

function drawEllipse(x, y, w, h, strokeC, strokeW = 1, doFill = false, fillColor = bgColor) {
  if (graphics == SCRIBBLE || graphics == OUTLINE) {
    drawScribbleEllipse(x, y, w, h, strokeC, strokeW, doFill, fillColor);
  } else if (graphics == BASIC) {
    drawBasicEllipse(x, y, w, h, strokeC, strokeW, doFill, fillColor);
  }
}

function drawBasicEllipse(x, y, w, h, strokeC, strokeW, doFill, fillColor) {
  strokeSetup(strokeC, strokeW);
  fillSetup(doFill, fillColor);
  ellipse( x, y, w, h );
}

function drawScribbleEllipse(x, y, w, h, strokeC, strokeW, doFill, fillColor) {
  strokeSetup(strokeC, strokeW);
  fillSetup(doFill, fillColor);
  scribble.scribbleEllipse( x, y, w, h );
}

function drawLine(x1, y1, x2, y2, strokeC, strokeW = 1) {
  if (graphics == SCRIBBLE || graphics == OUTLINE) {
    drawScribbleLine(x1, y1, x2, y2, strokeC, strokeW);
  } else if (graphics == BASIC) {
    drawBasicLine(x1, y1, x2, y2, strokeC, strokeW);
  }
}

function drawBasicLine(x1, y1, x2, y2, strokeC, strokeW) {
  strokeSetup(strokeC, strokeW);
  line( x1, y1, x2, y2 );
}

function drawScribbleLine(x1, y1, x2, y2, strokeC, strokeW) {
  strokeSetup(strokeC, strokeW);
  scribble.scribbleLine( x1, y1, x2, y2 );
}

function strokeSetup(strokeC, strokeW) {
  stroke(strokeC);
  strokeWeight(strokeW);
}

function fillSetup(doFill, fillColor) {
  if (doFill) {
    fill(fillColor);
  } else {
    noFill();
  }
}

function drawModal() {
  noStroke();
  fill(bgColor, 200);
  rect(0, 0, width, height);
}