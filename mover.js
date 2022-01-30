// Gravitational Attraction
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/EpgB3cNhKPM
// https://thecodingtrain.com/learning/nature-of-code/2.5-gravitational-attraction.html
// https://editor.p5js.org/codingtrain/sketches/MkLraatd


//I'm repurposing the mover class to be the wrecking Ball
class Mover {
  constructor(x, y, vx, vy ) {
    this.pos = createVector(x, y);
    this.vel = createVector(1.2, 0);
    //this.vel = p5.Vector.random2D();
    this.vel.mult(5);
    this.acc = createVector(0, 0);
    this.mass = 100;
    this.r = sqrt(this.mass) * 2;
    this.mew = 0.02;//friction value
  }

  applyForce(force) {
    //this is force of gravity btw
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
    
    //friction time
    let friction = this.vel.copy();
    friction.normalize();
    friction.mult(-1);
    friction.mult(this.mew);
    
       this.acc.add(friction);
  }

  update() {
    //dis = sqrt(this.pos.x - attractor);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(this.vel.mag()/3);
    line(player.pos.x,player.pos.y,this.pos.x,this.pos.y);
    noStroke();
    fill(91);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    fill(28);
    
    //for the spikes
    strokeWeight(4);
    stroke(255);
    noFill();
    for (let i = 0; i < 8; i++){ 
      arc(this.pos.x, this.pos.y, this.r * 2.2, this.r * 2.2, (i*PI)/4 - PI/128, (i*PI/4) + PI/128);
    }
    //Bardia mode
    if(bardiaMode){
    imageMode(CENTER);
    image(wball,this.pos.x, this.pos.y,this.r*2.5,this.r*2.5);
    }
    strokeWeight(1);
    
  }
}