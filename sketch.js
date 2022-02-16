let score = 0;
let bugSpriteSheet;
let sx = 0;
let x = 2, y = 2;
let move = 0;
let facing = 1;
let direction = [0, 90, 180, 270];
let gameState = 'wait';
let speed;
let array_bug = [];
let BUG_COUNT = 100;
let startTime;


function preload()
{
  bugSpriteSheet = loadImage("bugSpriteSheet.png")
}

function setup() 
{
  createCanvas(1920, 1080);
  imageMode(CENTER);
  // bug = new Bug(bugSpriteSheet, random(0, 1920), random(0, 1080));
  for(var i = 0; i < BUG_COUNT; i++) 
  {
    array_bug.push(new Bug(bugSpriteSheet, random(0, 1920), random(0, 1080)));
  }
 
}

function timer()
{
  return int((millis(startTime) / 1000));
}



function draw() 
{
  background(220);

  if(gameState == 'wait')
  {
    textSize(30);
    text('Click to start', 760, 540);
    if(mouseIsPressed)
    {
      startTime = millis();
      gameState = 'playing';
    } 
  }
  else if(gameState == 'playing')
  {
    let current_count = array_bug.length;
    for(i = 0; i < current_count; i++) 
    {
      array_bug[i].checkFadeTimer();
      if(array_bug[i].getFadeTimer() > 3)
      {
        array_bug.splice(i, 1);
        i--;
        
        current_count--;
      }
    }
    for(i = 0; i < array_bug.length; i++)
    {
      array_bug[i].boundary();
      array_bug[i].draw();
    }

    let time = timer();

    text("Time: " + time, 10, 30);
    text("Score:" + score, 10, 60);
    if (time >= 30)
    {
      gameState = 'end';
    }
  }
  else if (gameState == 'end')
  {
    text("Game over", 760, 540);
    text("Click to restart", 760, 400);
    if(mouseIsPressed)
    {
      location.reload();
    }
  }
}

//checks if bug is being killed 
function mousePressed() 
{
  for(i = 0; i < array_bug.length; i++)
  {
    array_bug[i].squish();
    if(!array_bug[i].isAdded()) 
    {
      if(array_bug[i].isSquished()) 
      {
        array_bug.push(new Bug(bugSpriteSheet, random(0, 1920), random(0, 1080)));
        array_bug[i].setAdded();
      }
    }
  }
}

class Bug
{
  constructor(bugSpriteSheet, x, y)
  {
    this.bugSpriteSheet = bugSpriteSheet;
    this.sx = 0;
    this.x = x;
    this.y = y;
    this.speed = speed;
    if(random(0, 1920) > 960)
    {
      this.move = 1;
      this.facing = 1;
    }
    else {
      this.move = -1;
      this.facing = -1;
    }
    this.squished = false;
    this.added = false;
    this.addFade = 0;
    this.startCount = 0;
  }
  draw() 
  {
    push();
    if(!this.squished)
    {
      translate(this.x, this.y);
      rotate(PI/2);
      scale(1, this.facing);

      if(this.move == 0)
      {
        image(this.bugSpriteSheet, 0, 0, 100, 100, 0, 0, 297, 297);
      }
      else
      {
        image(this.bugSpriteSheet, 0, 0, 100, 100, 297 * (this.sx + 1), 0, 297, 297);
      }

  
      if (frameCount % 5 == 0)
      {
        this.sx = (this.sx + 1) % 6;
      }
      
      this.x += 1 * this.move * (1 + score * .15); 
      }
      else
      {
        translate(this.x, this.y);
        rotate(3 * PI/2);
        scale(this.facing, 1);
        image(this.bugSpriteSheet, 0, 0, 100, 100, 297 * 7, 0, 297, 297);
      }

    pop();
  }
  

  boundary()
  {
    if(this.x < 0)
    {
      this.move = 1;
      this.facing = 1;
    }
    else if(this.x > 1920)
    {
      this.move = -1;
      this.facing = -1;
    }
  }

  isSquished() 
  {
    return this.squished;
  }

  setAdded() 
  {
    this.added = true;
  }

  isAdded() 
  {
    return this.added;
  }

  checkFadeTimer() 
  {
    if(this.squished)
    {
      this.fadeTimer = (millis() - this.startCount) / 1000;
    }
  }

  getFadeTimer() 
  {
    return this.fadeTimer;
  }

  squish()
  {
    if(!this.squished && (mouseX > this.x - 50) && (mouseX < this.x + 50) && (mouseY > this.y - 50) && (mouseY < this.y + 50))
    {
      this.move = 0;
      this.squished = true;
      this.startCount = millis();
      score++;
    }
  }
}