// Gravitational Attraction
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/EpgB3cNhKPM
// https://thecodingtrain.com/learning/nature-of-code/2.5-gravitational-attraction.html
// https://editor.p5js.org/codingtrain/sketches/MkLraatd


//this is the player character now
class Attractor {
  
  constructor(x,y,m) {
    this.pos = createVector(x,y);
    this.vel = createVector(0, 0);
    this.mass = m;
    this.r = sqrt(this.mass)*2;
    this.maxSpeed = 6;
    this.acc = 0.5;
    this.health = 100;
    this.isHit = false;
  }
  
  //this attracts the wrecking ball with the gravity equation. Again, thank you coding train
  attract(mover) {
    let force = p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let G = 5;
    let strength = G * (this.mass * mover.mass) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }
  
  //displays the ufo
  show() {
    noStroke();
    fill(255,0, 100);
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    //ellipse(0, 0, this.r*2);  
    image(ufo,0,-5,this.r*3,this.r*3);
    pop();
  }
  
  drawHUD(){
    //healthbar
    if(this.isHit)strokeWeight(3);
    else strokeWeight(1);
    stroke(255);
    noFill();
    rect(378,579,202,16);
    
    noStroke();
    fill(0);
    rect(380,580,200,15);
    fill(255,0,0);
    rect(380 + (200 - 2*this.health),580,2*this.health, 15);
    if(this.isHit){
      fill(255,255,0);
      rect(380+ (200 - 2*this.health), 580, 2,15);
    }
    
    //draw health amount
    textSize(12);
    textAlign(RIGHT);
    fill(255);
    text(player.health + "%", 580, 592);
    
    //left side hud thing
    textSize(18);
    textAlign(LEFT);
    fill(0);
    rect(18, 575, 160, 20);
    fill(255);
    //now for the level specific HUDS
    if (gameState == 2){//lvl 1
      text("REMAINING: " + blocks.length, 20, 592);
    }else if (gameState == 5){//lvl2
      text("REMAINING: " + (30-kCount), 20, 592);
    }
    else if (gameState == 8){//lvl4
      text("REMAINING: " + (28-kCount), 20, 592);
    }
    else if (gameState == 11){//lvl4
      text("REMAINING: " + (30-kCount), 20, 592);
    }
    else if (gameState == 14){//lvl5
      text("REMAINING: " + (9-kCount), 20, 592);
    }
    else if (gameState == 17){//lvl5
      text("REMAINING: ONE" , 20, 592);
    }
    
  }
}