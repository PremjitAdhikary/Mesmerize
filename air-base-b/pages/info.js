class Info {

  enter() {
    let pData = this.sceneArgs.topic;
    this.pageData = {};
    this.pageData.title = pData.title;
    this.pageData.draw = pData.drawFunc();
    this.pageData.para = [];
    pData.para.forEach( p => this.pageData.para.push({...p}));
    this.pageData.para.forEach( p => p.lines = this.wordWrap(p) );
    this.pageData.page = pData.page;
    this.pageData.prev = pData.prev;
    this.pageData.next = pData.next;
  }

  draw() {
    background(bgColor);
    if (!this.pageData) return;
    this.drawTitle(this.pageData.title);
    this.pageData.draw();
    this.pageData.para.forEach(para => this.drawPara(para));
    this.drawInfo();
  }

  drawTitle(title) {
    stroke(darkColor);
    strokeWeight(2);
    fill(darkColor);
    textSize(30);
    textFont(TEXT_FONT);
    let nWid = textWidth(title);
    text(title, width/2 - nWid/2, 50);
  }

  drawPara(para) {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    textSize(Info.TXT_SIZE);
    textFont(TEXT_FONT);
    push();
    translate(para.x, para.y);
    let y = 0;
    for (let line of para.lines) {
      text(line, 0, y);
      y += 30;
    }
    pop();
  }

  wordWrap(para) {
    textSize(Info.TXT_SIZE);
    textFont(TEXT_FONT);
    let lines = [];
    let words = para.txt.split(' ');
    let currWid = 0;
    let currLine = '';
    for (let word of words) {
      let wWid = textWidth(word+' ');
      if (para.w < (currWid + wWid)) {
        lines.push(currLine);
        currWid = 0;
        currLine = '';
      }
      currWid += wWid;
      currLine += (word+' ');
    }
    if (currLine != '') lines.push(currLine);
    return lines;
  }

  drawInfo() {
    stroke(darkColor);
    strokeWeight(1);
    fill(darkColor);
    textSize(15);
    textFont(TEXT_FONT);
    let nWid = textWidth(Info.BACK_INFO);
    text(Info.BACK_INFO, width/2 - nWid/2, 450);
    if (this.pageData.next) {
      let txt = 'Press Enter to' + this.pageData.next().txt;
      nWid = textWidth(txt);
      text(txt, width/2 - nWid/2, 470);
    }
    textSize(12);
    text('Page ' + this.pageData.page, 550, 474);
  }

  keyPressed() {
    if (key == 'Escape') {
      menuScroll();
      manager.showScene(Help);
    }
    if (key == 'Enter' && this.pageData.next) {
      menuScroll();
      GOFactory.FACTORY.returnAllFightersToPool();
      manager.showScene(Info, {
        topic: this.pageData.next().page
      })
    }
  }

}

Info.TXT_SIZE = 20;

Info.BACK_INFO = 'Press Escape to go back to Help';

Info.IDEA_P1 = {
  title: 'What to do?', 
  page: '1 of 3', 
  next: () => {return {
    txt: ' know about Airstrip', 
    page: Info.IDEA_P2
  }}, 
  drawFunc: () => {
    let bg = new AirBaseBG();
    let strip = GOFactory.FACTORY.getAirStrip();
    strip.showHealth = false;
    return () => {
      bg.showGround(360);
      bg.showBuilding(10, 320);
      strip.show();
    }
  },
  para: [
    {
      txt: 'Air Base B is under attack! Team Green (you know who) launched a cowardly '
      + 'air strike.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'Your job is to keep the airstrip safe as long as you can with whatever ' 
      + 'resource you have at your disposal.', 
      x: 50, y: 170, w: 540
    }, 
    {
      txt: 'Play as a Gunner to attack or as an Engineer to defend. Or as Wing '
      + 'Commander for ultimate thrill!', 
      x: 150, y: 270, w: 440
    }
  ]
};

Info.IDEA_P2 = {
  title: 'The Airstrip', 
  page: '2 of 3', 
  next: () => {return {
    txt: ' know your enemies', 
    page: Info.IDEA_P3
  }}, 
  drawFunc: () => {
    let bg = new AirBaseBG();
    let strip = GOFactory.FACTORY.getAirStrip();
    strip.segments[1].currHealth = 12;
    strip.segments[3].currHealth = 25;
    strip.segments[5].currHealth = 40;
    strip.segments[8].currHealth = 10;
    return () => {
      bg.showGround(360);
      bg.showBuilding(10, 320);
      strip.show();
    }
  },
  para: [
    {
      txt: 'The Airstrip has to be kept operational at all costs. Enemy Fighters will keep '
      + 'attacking the airstrip damaging segments of it.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'But make sure you keep the airstrip health at least ' + MIN_STRIP_HEALTH 
      + '%! The health bar on bottom left has a marker to indicate it.', 
      x: 150, y: 195, w: 440
    }, 
    {
      txt: 'If it goes below that, it\'s GAME OVER!', 
      x: 150, y: 315, w: 440
    }
  ]
};

Info.IDEA_P3 = {
  title: 'The Enemies', 
  page: '3 of 3', 
  next: () => {return {
    txt: ' know the basics', 
    page: Info.IDEA_P1
  }}, 
  drawFunc: () => {
    let bomber = GOFactory.FACTORY.getFighterBomber(70, 160, 1.2, false);
    let kamikaze = GOFactory.FACTORY.getFighterKamikaze(550, 250, false);
    kamikaze.a = 0.4;
    let lca = GOFactory.FACTORY.getFighterLCA(75, 350, 0.8, false);
    return () => {
      bomber.show();
      kamikaze.show();
      lca.show();
    }
  },
  para: [
    {
      txt: 'The enemy uses 3 types of fighters.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'Bombers come in formation and to drop bombs. They have heavy armor and need '
      + 'multiple hits to bring thm down.',
      x: 120, y: 130, w: 480
    }, 
    {
      txt: 'Suicide Bombers have heavy damage and can destroy your vehicles in on shot.'
      + ' But they are easier to bring down.', 
      x: 50, y: 230, w: 480
    }, 
    {
      txt: 'LCAs come in pair. They are faster to come in and shoot but not as strong as ' 
      + 'Bombers.',
      x: 120, y: 330, w: 480
    }
  ]
};

Info.GUNNER_P1 = {
  title: 'Gunner Playbook', 
  page: '1 of 2', 
  next: () => {return {
      txt: ' know about anti-aircraft-gun', 
      page: Info.GUNNER_P2
  }}, 
  drawFunc: () => {
    let bg = new AirBaseBG();
    let strip = GOFactory.FACTORY.getAirStrip();
    strip.showHealth = false;
    let gunner = GOFactory.FACTORY.getAntiAircraftGun(240, 400, false);
    return () => {
      bg.showGround(360);
      bg.showBuilding(10, 320);
      strip.show();
      gunner.show();
    }
  },
  para: [
    {
      txt: 'Attack is the best defence! As a gunner it is your job to keep the skies clear '
      + 'of those pesky green mosquitoes and any bombs that they drop.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'An anti-aircraft-gun is what you have at your disposal for the job.', 
      x: 150, y: 230, w: 440
    }, 
    {
      txt: 'Bombs damage the ack-ack gun too. If it gets destroyed, GAME OVER!', 
      x: 150, y: 300, w: 440
    }
  ]
};

Info.GUNNER_P2 = {
  title: 'Anti Aircraft Gun', 
  page: '2 of 2', 
  next: () => {return {
    txt: ' know about game objective', 
    page: Info.GUNNER_P1
  }}, 
  drawFunc: () => {
    let gunner = GOFactory.FACTORY.getAntiAircraftGun(100, 225);
    gunner.currHealth = 25;
    return () => {
      gunner.show();
    }
  },
  para: [
    {
      txt: 'The ack-ack gun, while slow to move, is very fast at firing stream of bullets. It '
      + 'pauses to automatically reload.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'Keep an eye on the health bar above the gun.', 
      x: 150, y: 200, w: 440
    }, 
    {
      txt: 'CONTROLS:', 
      x: 50, y: 275, w: 540
    }, 
    {
      txt: '> Press A to move left and D to right.', 
      x: 50, y: 310, w: 540
    }, 
    {
      txt: '> Hold down S to fire away.', 
      x: 50, y: 345, w: 540
    }, 
    {
      txt: 'When powered up, the guns fire in a frenzy.', 
      x: 50, y: 390, w: 540
    }
  ]
};

Info.ENGINEER_P1 = {
  title: 'Engineer Playbook', 
  page: '1 of 2', 
  next: () => {return {
    txt: ' know about repair truck', 
    page: Info.ENGINEER_P2
  }},  
  drawFunc: () => {
    let bg = new AirBaseBG();
    let strip = GOFactory.FACTORY.getAirStrip();
    strip.showHealth = false;
    let roller = GOFactory.FACTORY.getRoadRoller(400, 400, false);
    return () => {
      bg.showGround(360);
      bg.showBuilding(10, 320);
      strip.show();
      roller.show();
    }
  },
  para: [
    {
      txt: 'You gotta do what you gotta do! As an engineer it is your job to keep the strip '
      + 'in top condition.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'To do the job you have a repair truck at your disposal.', 
      x: 50, y: 195, w: 540
    }, 
    {
      txt: 'Repair the damaged segments and keep the truck away from bombs. If it gets ' 
      + 'destroyed, GAME OVER!', 
      x: 150, y: 265, w: 440
    }
  ]
};

Info.ENGINEER_P2 = {
  title: 'Repair Truck', 
  page: '2 of 2', 
  next: () => {return {
    txt: ' know about game objective', 
    page: Info.ENGINEER_P1
  }},  
  drawFunc: () => {
    let roller = GOFactory.FACTORY.getRoadRoller(500, 260);
    roller.currHealth = 10;
    return () => {
      roller.show();
    }
  },
  para: [
    {
      txt: 'The repair truck moves around at breakneck speed! But takes time to repair '
      + 'damaged segments. While repairing it also self repairs any damage it has taken ' 
      + 'from bombs.',
      x: 50, y: 100, w: 540
    }, 
    {
      txt: 'Don\'t forget the health bar.', 
      x: 50, y: 230, w: 440
    }, 
    {
      txt: 'CONTROLS:', 
      x: 50, y: 275, w: 440
    }, 
    {
      txt: '> Press J to move left and L to right.', 
      x: 50, y: 310, w: 540
    }, 
    {
      txt: '> Hold down K to repair.', 
      x: 50, y: 345, w: 540
    }, 
    {
      txt: 'When powered up, the truck sends out EMP which destroys enemies in its range.', 
      x: 50, y: 390, w: 540
    }
  ]
};

Info.COMMANDER_P1 = {
  title: 'Wing Commander Playbook', 
  page: '1 of 2', 
  next: () => {return {
    txt: ' know about SAM launcher', 
    page: Info.COMMANDER_P2
  }},  
  drawFunc: () => {
    let bg = new AirBaseBG();
    let strip = GOFactory.FACTORY.getAirStrip();
    strip.showHealth = false;
    let gunner = GOFactory.FACTORY.getAntiAircraftGun(240, 400, false);
    let roller = GOFactory.FACTORY.getRoadRoller(400, 400, false);
    let sam = GOFactory.FACTORY.getSAM(600, 400, false);
    return () => {
      bg.showGround(360);
      bg.showBuilding(10, 320);
      strip.show();
      roller.show();
      gunner.show();
      sam.show();
      sam.loadMissiles();
    }
  },
  para: [
    {
      txt: 'With great power comes great responsibility!',
      x: 50, y: 100, w: 545
    }, 
    {
      txt: 'As Wing Commander you have both ack-ack gun and repair truck at your ' 
      + 'disposal. Attack and Defend! GAME OVER if both of them are destroyed.', 
      x: 50, y: 140, w: 540
    }, 
    {
      txt: 'You also have a SAM launcher which cannot be targeted. But it can '
      + 'definitely target and destroy those pesky mosquitoes!', 
      x: 150, y: 260, w: 440
    }
  ]
};

Info.COMMANDER_P2 = {
  title: 'SAM Launcher', 
  page: '2 of 2', 
  next: () => {return {
    txt: ' know about game objective', 
    page: Info.COMMANDER_P1
  }},  
  drawFunc: () => {
    let sam = GOFactory.FACTORY.getSAM(540, 230, false);
    sam.loadMissiles();
    return () => {
      sam.show();
    }
  },
  para: [
    {
      txt: 'The SAM launcher holds 2 missiles which it fires at the same time. These are '
      + 'guided missiles with enough firepower to take out a fighter in 1 shot!',
      x: 50, y: 100, w: 545
    }, 
    {
      txt: 'The vehicle moves away to reload and comes back into action once reloaded.', 
      x: 50, y: 220, w: 500
    }, 
    {
      txt: 'It also has a fail-safe where missiles are launched only if 2 or more targets are '
      + 'present.', 
      x: 50, y: 280, w: 540
    }, 
    {
      txt: 'CONTROLS:', 
      x: 50, y: 380, w: 440
    }, 
    {
      txt: '> Press Space-bar to fire missiles.', 
      x: 50, y: 415, w: 540
    }
  ]
};