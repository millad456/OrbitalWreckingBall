class Spike{
  
  constructor(x, y, type){
    this.pos = createVector(x,y);
    this.type = type;
    this.size = 40;
    if(type == 2)this.speed = 1.5;
    else this.speed = random([1,1.5]);
    if(type == 3) this.pos.x = 0;
    if(type == 4) this.pos.x = 600;
  }
  
  display(){
    //btw, this is totally a placeholder image. idk what to do for the spike block
    stroke(255);
    strokeWeight(2);
    line(this.pos.x, this.pos.y, this.pos.x + this.size, this.pos.y + this.size);
    line(this.pos.x + this.size/2, this.pos.y, this.pos.x + this.size, this.pos.y + this.size/2);
    line(this.pos.x, this.pos.y + this.size, this.pos.x + this.size, this.pos.y);
    line(this.pos.x, this.pos.y + this.size/2, this.pos.x + this.size/2, this.pos.y);
    line(this.pos.x, this.pos.y + this.size/2, this.pos.x + this.size/2, this.pos.y + this.size);
    line(this.pos.x + this.size/2, this.pos.y + this.size, this.pos.x + this.size, this.pos.y + this.size/2);
  }
  
  update(){
    
    if (this.type == 2){ //dropped spikes
      this.pos.y += this.speed;
    }
    else if (this.type == 3){ //sideways spikes
      this.pos.x += this.speed;
    }
    else if (this.type == 4){ //sideways spikes
      this.pos.x -= this.speed;
    }
  }
}