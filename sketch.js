// Gravitational Attraction
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/EpgB3cNhKPM
// https://thecodingtrain.com/learning/nature-of-code/2.5-gravitational-attraction.html
// https://editor.p5js.org/codingtrain/sketches/MkLraatd

let movers = [];
let spikes = [];
let player;
let blocks = [];
let particles = [];
let gameState = 0; //maybe 0 will be the title screen or something
let timer = 0;
let tick = 0; //just counts how long the game has been running
let pFrame = 0; //this is how we pause the game for a few frames for that effect
let sFrame = 0; //these are for screen shake stuff
let dx = 0;
let dy = 0;
let kCount = 0; // kill count for how many blocks were destroyed

//edit these values to change the game
let shakeMag = 3; //the shake magnitude
let spikeDmg = 2; //the damage the spike does every frame
let bossMaxHealth = 25;//what the Boss's health should be
let phase1 = bossMaxHealth; //determines what health each phase should be
let phase2 = 15;
let phase3 = 5;
let pause = 3; //this is how long you want a pause for
let bardiaMode = false;
let godMode = false;//basically diables damage. useful for bug testing\
let slowDown = 0.12; //this is how much you want to scale the velocity of the ball when it hits an enemy
let particleGrav = 0.04; //this controls the gravity applied to the particles
let easing = 0.05;//easing for animations

//the images
let ufo;
let asteroid;
let bg;
let wball;
let ego;
let egoA;

function preload() {
  ufo = loadImage("ufo.png");
  asteroid = loadImage("asteroid.png");
  bg = loadImage("space2.jpg");
  wball = loadImage("baby.png");
  ego = loadImage("ego0.png");
  egoA = loadImage("egoAngry.png");
}

function setup() {
  createCanvas(600, 600);
  player = new Attractor(width / 2, height / 2, 100);
  boss = new Boss(300,150);
  createLevel(1);
  background(bg);
}

function draw() {
  //handles view translation of screen shake
  if (sFrame >= 0) shake();

  //game Over Screen
  if (gameState == -1) {
    background(0);
    //title
    textSize(70);
    textAlign(CENTER);
    fill(255);
    textStyle(BOLD);
    text("GAME", width / 2, 160);
    text("OVER", width / 2, 240);
    spikes.splice(0, spikes.length);

    //Try Again Button
    textStyle(NORMAL);
    textSize(30);
    if (mouseOver(100, 300, 400, 80)) {
      //mouse collision
      strokeWeight(4);
      textSize(32);
      //reset to title screen
      if (mouseIsPressed) gameState = 0;
    }
    noStroke();
    text("Return To Title Screen", width / 2, 350);
    noFill();
    stroke(255);
    rect(100, 300, 400, 80);
    strokeWeight(1);
  }
  //title screen
  else if (gameState == 0) {
    stroke(2);
    stroke(0);
    imageMode(CORNER);
    background(bg);

    //title
    textSize(70);
    textAlign(CENTER);
    fill(255);
    textStyle(BOLD);
    text("ORBITAL", width / 2, 120);
    text("WRECKING", width / 2, 200);
    text("BALL", width / 2, 280);

    //level select
    textSize(20);
    textStyle(NORMAL);
    textAlign(LEFT);
    text("Levels:", width / 5, 400);

    //drawbuttons
    noFill();
    stroke(255);

    for (let i = 1; i < 4; i++) {
      //repeat this 3 times
      strokeWeight(2);
      textAlign(CENTER);
      //top row
      if (mouseOver((i * width) / 5 + 2, 420, width / 5 - 4, 30)) {
        strokeWeight(4);
        if (mouseIsPressed) {
          gameState = (i - 1) * 3 + 1;
        }
      }
      rect((i * width) / 5 + 2, 420, width / 5 - 4, 30);
      text(i, (i * width) / 5 + (width / 5 - 4) / 2, 442);

      strokeWeight(2);
      //bottom row
      if (mouseOver((i * width) / 5 + 2, 460, width / 5 - 4, 30)) {
        strokeWeight(4);
        if (mouseIsPressed) {
          gameState = (i - 1) * 3 + 10;
        }
      }
      rect((i * width) / 5 + 2, 460, width / 5 - 4, 30);
      text(i + 3, (i * width) / 5 + (width / 5 - 4) / 2, 482);
    }
  }
  //level 1
  else if (gameState == 1) {
    //setup level 1
    createLevel(1);
    reset();
    gameState++;
  } 
  else if (gameState == 2) {
    //play level 1
    play();
    player.drawHUD();
    if (blocks.length == 0) {
      gameState++; //winstate
      timer = 180;
    }
    if (player.health <= 0) gameState = -1; //lose state
  }
  else if (gameState == 3) {
    //end level 1
    play();
    timer--;
    if (timer == 0) {
      //when the ending animation is done
      gameState = 0;
    }
  }
  //level 2
  else if (gameState == 4) {
    //setup level 2
    createLevel(2);
    reset();
    gameState++;
  } 
  else if (gameState == 5) {
    //play level 2
    play();
    player.drawHUD();
    if (kCount == 30) {
      gameState++; //winstate
      timer = 180;
    }
    if (player.health <= 0) gameState = -1; //lose state
    if (tick % 60 == 0)
      blocks.push(new Block(random(width), random(height), 1));
  }
  else if (gameState == 6) {
    //end level 2
    play();
    timer--;
    if (timer == 0) {
      //when the ending animation is done
      gameState = 0;
    }
  }
  //level 3
  else if (gameState == 7) {
    //setup level 3
    createLevel(3);
    reset();
    gameState++;
  } 
  else if (gameState == 8) {
    //play level 3
    play();
    player.drawHUD();
    if (kCount == 28) {
      gameState++; //winstate
      timer = 180;
    }
    if (player.health <= 0) gameState = -1; //lose state
    //weird spike collision thing
    if (
      (player.pos.x >= 120 &&
        player.pos.x <= 480 &&
        player.pos.y >= 180 &&
        player.pos.y <= 520) == false
    ) {
      player.health -= spikeDmg;
    }
  }
  else if (gameState == 9) {
    //end level 3
    play();
    timer--;
    if (timer == 0) {
      //when the ending animation is done
      spikes.splice(0, spikes.length);
      gameState = 0;
    }
  }
  //level 4
  else if (gameState == 10) {
    //setup level 4
    createLevel(4);
    reset();
    gameState++;
  }
  else if (gameState == 11) {
    //play level 4
    play();
    player.drawHUD();
    if (kCount == 30) {
      gameState++; //winstate
      timer = 180;
    }
    if (player.health <= 0) gameState = -1; //lose state
    if (tick % 45 == 0) blocks.push(new Block(random(width), 0, 2));
    if (tick % 60 == 12)
      spikes.push(new Spike(0, random(height), random([3, 4])));
  }
  else if (gameState == 12) {
    //end level 4
    play();
    timer--;
    if (timer == 0) {
      //when the ending animation is done
      gameState = 0;
    }
  }
  //level 5
  else if (gameState == 13) {
    //setup level 5
    createLevel(5);
    reset();
    gameState++;
  }
  else if (gameState == 14) {
    //play level 5
    play();
    player.drawHUD();
    if (kCount == 9) {
      gameState++; //winstate
      timer = 180;
    }
    if (player.health <= 0) gameState = -1; //lose state
  }
  else if (gameState == 15) {
    //end level 5
    play();
    streaks();
    timer--;
    if (timer == 0) {
      //when the ending animation is done
      gameState = 0;
    }
  }
  //level 6/boss fight
  else if (gameState == 16) {
    //setup Boss fight
    createLevel(6);
    reset();
    gameState++;
  } else if (gameState == 17) {
    //play Boss fight
    play();
    player.drawHUD();
    
    boss.display();
    if (pFrame == 0)boss.update();
    
    //spike damage zone stuff
    if ((
      (player.pos.x >= 0 &&
        player.pos.x <= 600 &&
        player.pos.y >= 300 &&
        player.pos.y <= 600) == false
    ) && !godMode) {
      player.health -= spikeDmg;
    }

    if (boss.health == 0) {
      // replace with boss health == 0 for win state
      timer = 180;
      gameState++;
    }
    print(boss.pos.y);
    if(boss.pos.y > 300) gameState = -1;
    if (player.health <= 0) gameState = -1; //lose state
  } else if (gameState == 18) {
    //end Boss fight
    play();
    timer--;
    boss.display();
    if (timer == 0) {
      //when the ending animation is done
      gameState = 0;
    }
  }
  //the end calculations
  tick++;
  //print(tick);
  if (pFrame > 0) pFrame--;
}

//this is the main game function. It runs all the objects, does collisions, and is used for every level
function play() {
  imageMode(CORNER);
  background(bg);
  strokeWeight(1);

  if (gameState == 14) streaks();

  //run all wrecking balls
  for (i = 0; i < movers.length; i++) {
    if (pFrame == 0) movers[i].update();
    movers[i].show();
    if (pFrame == 0) player.attract(movers[i]);
    //calculate wrecking ball and player collisions
    if (
      dist(movers[i].pos.x, movers[i].pos.y, player.pos.x, player.pos.y) <
        movers[i].r + player.r &&
      pFrame == 0
    ) {
      movers[i].vel.set(0, 0);
      if(!godMode)player.health--;
      player.isHit = true;
    } else player.isHit = false;
  }

  //player stuff
  if (mouseIsPressed && pFrame == 0) {
    player.pos.x = mouseX;
    player.pos.y = mouseY;
  }
  player.show();

  //draw blocks and particle effects
  for (i = 0; i < blocks.length; i++) {
    if (pFrame == 0) blocks[i].update();
    blocks[i].display();

    //calculate  block/wrecking ball collisions
    for (j = 0; j < movers.length; j++) {
      //this calculates circular collision
      if (
        dist(
          movers[j].pos.x,
          movers[j].pos.y,
          blocks[i].pos.x,
          blocks[i].pos.y
        ) <
        movers[j].r + blocks[i].size / 2
      ) {
        //slow down ball, pause screen, shake, and remove health
        movers[j].vel.mult(slowDown);
        pFrame = pause;
        if (sFrame == 0) shakeSetup();
        blocks[i].health--;
        //only used on level 2. adds destroyed block to the count
        if (
          gameState == 5 ||
          gameState == 8 ||
          gameState == 11 ||
          gameState == 14
        )
          kCount++;
      }
      //if a block is dead, remove it and spawn particle effects
    if (blocks[i].health <= 0 || (blocks[i].pos.x > width + blocks[i].size || blocks[i].pos.x < -blocks[i].size || blocks[i].pos.y > height+ blocks[i].size || blocks[i].pos.y < -blocks[i].size)) {
      
      //only spawns particle effect if the block dropped to zero hp
      if (blocks[i].health <= 0){
        for (let j = 0; j < 50; j++) {
          particles.push(
            new Particle(
              blocks[i].pos.x,
              blocks[i].pos.y,
              random(5),
              random([1, 2, 3, 4, 5, 6]), 0
            )
          );
        }
      }
      //else just quietly remove it
      blocks.splice(i, 1);
    }
    
      //also remove blocks that are out of bounds, without spawning particles
       
    }
  }
  
  
  //run all particles
  for (let i = 0; i < particles.length; i++) {
    if (pFrame == 0) particles[i].update();
    particles[i].display();
    if (particles[i].lifetime <= 0) {
      particles.splice(i, 1);
    }
  }

  //run all Spikes
  for (i = 0; i < spikes.length; i++) {
    spikes[i].display();
    spikes[i].update();
    if (pFrame == 0) spikes[i].update();
    //player collision
    if (
      player.pos.x >= spikes[i].pos.x &&
      player.pos.x <= spikes[i].pos.x + spikes[i].size &&
      player.pos.y >= spikes[i].pos.y &&
      player.pos.y <= spikes[i].pos.y + spikes[i].size
    ) {
      if(!godMode)player.health -= spikeDmg;
    }
    //remove all spikes that leave the screen. this helps with optimizations
    if(spikes[i].pos.x > width || spikes[i].pos.x < -spikes[i].size || spikes[i].pos.y > height|| spikes[i].pos.y < -spikes[i].size)spikes.splice(i,1);
  }
  
}

//create level takes in a level as a parameter and then creates the corresponding level
function createLevel(level) {
  //clear the screen
  movers.splice(0, movers.length);
  blocks.splice(0, blocks.length);
  particles.splice(0, particles.length);

  //level 1, a randomly generated maze of asteroids
  if (level == 1) {
    movers.push(new Mover(200, 200, 1.2, 0));
    blocks.push(new Block(100, 100, 1));
    for (let i = 0; i < 20; i++) {
      blocks.push(new Block(random(width), random(height), 1));
    }
  } else if (level == 2) {
    movers.push(new Mover(200, 200, 1.2, 0));
    blocks.push(new Block(100, 100, 1));
    kCount = 0;
    for (let i = 0; i < 6; i++) {
      blocks.push(new Block(random(width), random(height), 1));
    }
  } else if (level == 3) {
    movers.push(new Mover(300, 300, -2, 5));
    kCount = 0;
    //box of spikes
    for (let i = 0; i < 9; i++) {
      spikes.push(new Spike(120 + i * 40, 480, 1));
      spikes.push(new Spike(120 + i * 40, 180, 1));
    }
    for (let i = 0; i < 7; i++) {
      spikes.push(new Spike(120, 220 + i * 40, 1));
      spikes.push(new Spike(440, 220 + i * 40, 1));
    }

    //surrounding asteroids
    for (let i = 0; i < 10; i++)
      blocks.push(
        new Block(40 + 60 * i + random(-20, 20), 100 + random(-60, 60), 1)
      );
    for (let i = 0; i < 6; i++)
      blocks.push(
        new Block(40 + 100 * i + random(-20, 20), 550 + random(-40, 40), 1)
      );
    for (let i = 0; i < 6; i++)
      blocks.push(
        new Block(50 + random(-30, 30), 100 + 100 * i + random(-40, 40), 1)
      );
    for (let i = 0; i < 6; i++)
      blocks.push(
        new Block(550 + random(-30, 30), 100 + 100 * i + random(-40, 40), 1)
      );
  } else if (level == 4) {
    movers.push(new Mover(200, 200, 1.2, 0));
    kCount = 0;
  } else if (level == 5) {
    movers.push(new Mover(300, 200, 1.26, 0));
    blocks.push(new Block(width / 2 - 45, 100, 1));
    blocks.push(new Block(width / 2 + 45, 100, 1));
    for (let i = 0; i < 7; i++) {
      blocks.push(new Block(i * 80 + 60, 450, 1));
    }
  } else if (level == 6) {
    movers.push(new Mover(300, 200, 1.26, 0));
    //spawn boss

    //spawn spikes around player
    for (let i = 0; i < 15; i++) {
      spikes.push(new Spike(i * 40, 300, 1));
      spikes.push(new Spike(i * 40, 560, 1));
    }
    for (let i = 0; i < 6; i++) {
      spikes.push(new Spike(0, 340 + i * 40, 1));
      spikes.push(new Spike(560, 340 + i * 40, 1));
    }
  } else {
    //many movers
    for (let i = 0; i < 1; i++) {
      let x = random(width);
      let y = random(height);
      let m = random(50, 150);
      movers[i] = new Mover(x, y, m);
    }
  }
}

//resets game related variables
function reset() {
  player.health = 100;
  player.isHit = false;
  kCount = 0;
  boss.health = bossMaxHealth;
  boss.pos.x = 300;
  boss.pos.y = 150;
}

//call this to start screen shake
function shakeSetup() {
  //dy and dx are the direction of shake determined by the magnitude
  dx = shakeMag * random([-1, 1]);
  dy = shakeMag * random([-1, 1]);
  sFrame = 4;
}

//handles screen shake
function shake() {
  if (sFrame == 8) translate(dx, 0);
  else if (sFrame == 7) translate(dx, dy);
  else if (sFrame == 6) translate(0, dy);
  else if (sFrame == 5) translate(0, 0);
  else if (sFrame == 4) translate(0, -dy);
  else if (sFrame == 3) translate(-dx, -dy);
  else if (sFrame == 2) translate(-dx, 0);
  else if (sFrame == 1) translate(0, 0);
  if (sFrame != 0) sFrame--;
}

//this just simplifies mouse collisions
function mouseOver(x, y, w, h) {
  if (mouseX >= x && mouseY >= y && mouseX <= x + w && mouseY <= y + h) {
    return true;
  }
  return false;
}

//draws the streaks messages
function streaks() {
  textSize(70);
  textAlign(CENTER);
  fill(255);
  text("G", width / 2 - 45, 120);
  text("N", width / 2 + 45, 120);
  text("S", 60 + 0 * 80, 470);
  text("T", 60 + 1 * 80, 470);
  text("R", 60 + 2 * 80, 470);
  text("E", 60 + 3 * 80, 470);
  text("A", 60 + 4 * 80, 470);
  text("K", 60 + 5 * 80, 470);
  text("S", 60 + 6 * 80, 470);
}
