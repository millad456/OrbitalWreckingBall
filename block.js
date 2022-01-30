class Block{
  
  constructor(x, y, type){
    this.pos = createVector(x,y);
    this.type = type;
    this.health = 1;
    this.size = 80;
    this.angle = random(2*PI);
    if (type == 2){
      this.speed = random([2,3,4]);    
    }else if (type == 3){
      this.speed = 3;    
    }
  }
  
  display(){
    push();
    //draw asteroid
    if (this.health > 0){
      translate(this.pos.x,this.pos.y);
      strokeWeight(4);
      fill(128);
      //ellipse(0,0,this.size);
      imageMode(CENTER);
      
      rotate(this.angle);
      image(asteroid,0,0,this.size + 14,this.size + 14);
      pop();
    }
    
  }
  
  update(){
    if (this.type == 2 || this.type == 3){
      this.pos.y += this.speed;
    }
  }
}