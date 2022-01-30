class Boss{
  
  constructor(x, y){
    this.pos = createVector(x,y);
    this.timer = 150;//this timer handles animations and stuff
    this.vel = createVector(2,0);
    this.health = 10;//bossMaxHealth;
    this.state = 1;
    this.iFrame = 0;
    this.action = 1;//action refers to what it is doing
    this.target = createVector(50,50);
    this.suckmadick = 2; //for bug testing reasons
  }
  
  display(){
    push();
    //draw boss
    imageMode(CENTER);
    translate(this.pos.x,this.pos.y);
    scale(0.3);
    //ellipse(0,0,420);//this is just to visualize the hitbox
    //the if statement refers to image flicker
    if(this.iFrame % 4 == 0 || this.iFrame % 4 == 1){
      image(ego,0,0);
      if(this.state == 2){
        noStroke();
        fill(255,0,0);
        ellipse(-45,-42,30);
        ellipse(45,-42,30);
      }else if(this.state == 3){
        noStroke();
        fill(255,255,0);
        ellipse(-45,-42,30);
        ellipse(45,-42,30);
      }
    }
    pop();
    
    
    //healthbar
    rectMode(CENTER);
    fill(0);
    strokeWeight(3);
    stroke(255);
    rect(width/2, 30, 500, 20);
    rectMode(CORNER);
    noStroke();
    fill(230,0,255);
    //this is the actual boss health section of the health bar
    rect(width/2 - 250 +((bossMaxHealth-this.health)*(500/bossMaxHealth)), 20, this.health*(500/bossMaxHealth), 20);
    //here we draw the lines to mark the different phases
    fill(0);
    noStroke()
    rect(width/2 - 250 +((bossMaxHealth-phase2)*(500/bossMaxHealth)), 20, 2, 20);
    rect(width/2 - 250 +((bossMaxHealth-phase3)*(500/bossMaxHealth)), 20, 2, 20);

  }
  
  update(){
    //now for the finite state machine AI thing
    
    if(this.health > phase3){
      if(this.state == 1){
        //move back and fourth
        if(this.pos.x > 550 ||this.pos.x < 50) this.vel.mult(-1);
        this.pos.add(this.vel);
        if(this.health <= phase2 && this.health > phase3)this.pos.y += 2*sin(0.025*this.pos.x);
        //pick new action
        if (this.timer <= 0){
          this.state = random([2,3]);
          this.timer = 45;
        }

      } 
      else if (this.state == 2){
        //drop asteroid
        if (this.timer == 10){
          //drop middle asteroid
          blocks.push(new Block(this.pos.x, this.pos.y + 30, 3));
          //if phase 2, drop a few
          if (this.health <= phase2){
            blocks.push(new Block(this.pos.x-80, this.pos.y, 3));
            blocks.push(new Block(this.pos.x+80, this.pos.y, 3));
          }
        } 
        
        //go back to moving
        if (this.timer <= 0){
          this.state = 1;
          this.timer = round(random(30,300));
        }
      }
      else if (this.state == 3){
        //drop spike
        if (this.timer == 10){
          spikes.push(new Spike(this.pos.x, this.pos.y + 30, 2));
          spikes.push(new Spike(this.pos.x-40, this.pos.y + 30, 2));
          //phase 2 attack
          if (this.health <= phase2){
          spikes.push(new Spike(this.pos.x, this.pos.y -10, 2));
          spikes.push(new Spike(this.pos.x-40, this.pos.y -10, 2));
          spikes.push(new Spike(this.pos.x+40, this.pos.y -10, 2));
          spikes.push(new Spike(this.pos.x-80, this.pos.y -10, 2));
          spikes.push(new Spike(this.pos.x+40, this.pos.y + 30, 2));
          spikes.push(new Spike(this.pos.x-80, this.pos.y + 30, 2));
          }
        } 
        //go back to moving
        if (this.timer <= 0){
          this.state = 1;
          this.timer = round(random(30,300));
        }
      }
    }//final/desperation phase
    else {
      
      if (this.state != 0){
        
        this.pos.x = 55;
        this.pos.y = 80;
        this.state = 0;
        this.vel = (5,0);
        
      }
      //animation to setup phase
      else {
        this.state = 0;
        this.pos.x += this.suckmadick * (6-this.health);
        if(this.pos.x > 550 ||this.pos.x < 50){
          this.suckmadick = this.suckmadick*-1;
          this.pos.y += 10;
        }
        
      }
      
    }
    
    //I know this is bad programming practice, but we calculating the collisions in the boss update method because efficiency
    //anyways, heres the circular collision for the boss and all the wrecking balls 
    for (let i = 0; i < movers.length; i++){
      //circular collision and if boss isn't invincible b/c iFrame stuff
      if ((dist( movers[i].pos.x, movers[i].pos.y, this.pos.x, this.pos.y) < movers[i].r*2 + 50 && this.iFrame == 0) ){
        //first remove health and give him some iFrames
        this.health--;
        this.iFrame = 120;
        //then pause and screen shake
        pFrame = pause;
        if (sFrame == 0) shakeSetup();
        //then paricle effects. we spawn a particle at each corner with a different direciton range
        for (let j = 0; j < 6; j++){
          particles.push(new Particle(this.pos.x-25, this.pos.y +25, random(1,4), random([5, 6,7]), 1));
          particles.push(new Particle(this.pos.x -25, this.pos.y -25, random(1,4), random([5, 6,7]), 2));
          particles.push(new Particle(this.pos.x + 25, this.pos.y -25, random(1,4), random([5, 6,7]), 3));
          particles.push(new Particle(this.pos.x + 25, this.pos.y +25, random(1,4), random([5, 6,7]), 4));
        } 
        //and finally we reduce the velocity of the wrecking balls
        movers[i].vel.mult(slowDown);
      }
    } 
    
    
    //to reset damage stuff
    if (this.iFrame > 0){
      this.iFrame --;
    }
    this.timer--;
  }
  
  

}