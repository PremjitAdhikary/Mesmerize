class IntermediateDropPoints {
    constructor(camel) {
        this.camel = camel;
        this.stepIdx = 0;
        this.calculateDropPoints();
        this.steps = [
            () => this.dropAtP1(), 
            () => this.dropAtP2(), 
            () => this.lastDrop()
        ];
        this.directionRight = true;
        this.markColor = SketchColor.red().stringify();
    }

    calculateDropPoints() {
        this.p1 = Math.floor(routeLength/5)-1;
        this.p2 = this.p1 + Math.floor(routeLength/3);
    }

    run() {
        if (this.camel.position == routeLength-1) return;
        this.steps[this.stepIdx]();
        this.drawDropPoints();
    }

    drawDropPoints() {
        fill(this.markColor);
        noStroke();
        let drawTraingle = dp => {
            let dpx = theRoute[dp].x;
            let dpy = theRoute[dp].y - milestoneDiam/2 + 5;
            triangle(dpx, dpy, dpx-5, dpy-5, dpx+5, dpy-5);
        };
        drawTraingle(this.p1);
        drawTraingle(this.p2);
    }

    dropAtP1() {
        return this.dropAtIntermediatePoint(-1, this.p1);
    }

    dropAtP2() {
        return this.dropAtIntermediatePoint(this.p1, this.p2);
    }

    dropAtIntermediatePoint(start, end) {
        if (this.directionRight) {
            this.moveForward(start, end);
        } else {
            this.moveBackward(start);
        }
        return true;
    }

    lastDrop() {
        if (this.camel.position == this.p2) this.camel.pickUpMax();
        this.camel.position++;
        this.camel.eat();
        return true;
    }

    moveForward(start, end) {
        if (this.camel.position == start) this.camel.pickUpMax();
        this.camel.position++;
        this.camel.eat(); 
        if (this.camel.position != end) return;
        this.camel.drop();
        let hasPickupBehind = (start == -1 ? routeStart : theRoute[start]).bananas > 0;
        if (hasPickupBehind) {
            this.directionRight = false;
            this.camel.pickUp(end - start);
        } else {
            this.stepIdx++;
        }
    }

    moveBackward(start) {
        this.camel.position--;
        this.camel.eat();
        if (this.camel.position == start) {
            this.directionRight = true;
        }
    }

}