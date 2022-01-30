const G = 0.04;
class Particle {
  //direction vector is random, everything else is given
  constructor(x, y, speed, type, corner){
    this.pos = createVector(x,y);
    this.lifetime = 255;
    this.rspeed = random(-0.05,0.05);
    this.angle = 0.0;
    this.type = type;
    //corner stuff is primarily for the boss particles
    if (corner == 0)this.vel = p5.Vector.random2D();
    else this.vel = p5.Vector.fromAngle(random(corner*PI/2, corner*PI/2 + PI/2));
    
    
    this.vel.mult(speed);
  }
  
  display(){
    let size = this.lifetime/6;
    imageMode(CENTER);
    
    //each type is a different style of asteroid
    if (this.type == 2 || this.type == 3 || this.type == 4){//grey rectangle particle
      noStroke();
      fill(this.lifetime);
      push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle,(this.x,this.y));
      ellipse(0, 0, size/2);
      pop();
    }else if(this.type == 1){//for the image asteroid type
      push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);      
      image(asteroid,0,0,size/2,size/2);
      pop();
    }else if(this.type == 5){ //the yellow sparks
      noStroke();
      push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle,(this.x,this.y));
      fill(255,255,0);
      ellipse(0, 0, size/6);
      pop();
    }else if(this.type == 6){//the orange sparks
      noStroke();
      push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle,(this.x,this.y));
      fill(255,196,0);
      ellipse(0, 0, size/6);
      pop();
    }else if(this.type == 7){//boss stuff
      noStroke();
      push();
      translate(this.pos.x,this.pos.y);
      fill(230,0,255);
      ellipse(0, 0, size/2);
      pop();
    }
  
  }
  
  //calculated changes
  update(){
    //add gravity to velocity, then velocity to position
    this.vel.add(0,G);
    this.pos.add(this.vel.x,this.vel.y);
    this.angle += this.rspeed;
    this.lifetime -= 2;
  }
}