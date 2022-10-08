let clearRect,blueP, redP, mainContainer, gameContainer, divStartGame, rainContainer;
let pStartGame, pReplayMessage;

let clickAudio;

let turn = 0; //marks who's truen is it

let squares = []; //keeps the reference to all white squares 
let rainArray = []; //tracks the existing raindrops 

let gameEnded = false; //stops futrthur palaying after the game was won
let shouldRain = false; //stops the recalling of rain()
let shouldBlink = false; //stops the recalling of blink()

let red = [], blue = [];
// turn = 0 - blue + x
// turn = 1 - red + o

let blueRGBA = [136,188,216,1], redRGBA = [255,101,66,1]; //keeping the colors values for use in blink()


function init(){ 
  //getting all neccessary references to initiate the game

  clearRect = document.getElementById("clearRect");
  mainContainer = document.getElementById("mainContainer");
  gameContainer = document.getElementById("gameContainer");
  redP = document.getElementById("redP");
  blueP = document.getElementById("blueP");
  pStartGame = document.getElementById("pStartGame");
  divStartGame = document.getElementById("divStartGame");
  pReplayMessage = document.getElementById("pReplayMessage");

  clickAudio = document.createElement("audio");
  clickAudio.src = "sound_effects/click.mp3";
}

function startAnimation(counter,width,height){ 
  //the grow animation of gameContainer and and the creating of the white squares

  divStartGame.style.display = "none"; //hides the start word
  
  gameContainer.style.width = width + "vw";
  gameContainer.style.height = height + "vh";

  height += 0.65;
  width += 0.4;
  counter++;
  if(counter<100){
    setTimeout(()=>{
      startAnimation(counter,width,height);
    },10);
  }
  else{ // initiates the game itself
    createSquares();
    setTimeout(()=>{
      clearRect.style.visibility = "visible";
      pReplayMessage.style.display = "block";
    },500);
    setTimeout(()=>{
      chooseSide();
    },1300);
  }
}

function chooseSide(){ 
  //randomly selects a color to go first
  if(Math.random()>0.49){ //blue 
    blueP.classList.add("blueHighlight");
    turn = 0;
  }
  else{ //red
    redP.classList.add("redHighlight");
    turn = 1;
  }
}

function markSquare(event){ 
  //reacts when clikced on a white square, places the appropirate picture in the square and checks for wins of draw

  if(event.target.marked == "" && !gameEnded){
    
    if(turn == 0){ // x cases
      clickAudio.pause();
      clickAudio.play();
      createX(event.target);
      blue.push(event.target.i);

      if(checkForWin(blue)){ //win
        console.log("blue won");
        gameEnded = true;
        shouldRain = true;
        shouldBlink = true;
        createRainContainer();
        rain(0,"images/grayX.png","images/blueX.png",10);
        blueP.classList.remove("blueHighlight");
        blink(blueP,blueRGBA,false);
      }

      else if(checkForDraw()){ //draw
        blueP.classList.remove("blueHighlight");
        shouldRain = true;
        createRainContainer();
        rain(0,"images/grayX.png","images/grayO.png",10);
      }

      else{ //regualr mark
      blueP.classList.remove("blueHighlight");
      redP.classList.add("redHighlight");
      turn = 1;
      }
    }

    else{ // o cases
      clickAudio.pause();
      clickAudio.play();
      createO(event.target);
      red.push(event.target.i);

      if(checkForWin(red)){ //win
        console.log("red won");
        gameEnded = true;
        shouldRain = true;
        shouldBlink = true;
        createRainContainer();
        rain(0,"images/grayO.png","images/redO.png",10);
        redP.classList.remove("redHighlight");
        blink(redP,redRGBA,false);
      }

      else if(checkForDraw()){ //draw
        redP.classList.remove("redHighlight");
        shouldRain = true;
        createRainContainer();
        rain(0,"images/grayX.png","images/grayO.png",10);
      }

      else{ // regular mark
      redP.classList.remove("redHighlight");
      blueP.classList.add("blueHighlight");
      turn = 0;
      }
    }
  }
}

function checkForWin(arrayColor){ 
  // lists all possible cases of a win, only used due to the little amount of cases and the persistante of them

  if(arrayColor.includes(0) && arrayColor.includes(4) && arrayColor.includes(8))
    return true;
  else if(arrayColor.includes(2) && arrayColor.includes(4) && arrayColor.includes(6))
    return true;
  else if(arrayColor.includes(0) && arrayColor.includes(1) && arrayColor.includes(2))
    return true;
  else if(arrayColor.includes(3) && arrayColor.includes(4) && arrayColor.includes(5))
    return true;
  else if(arrayColor.includes(6) && arrayColor.includes(7) && arrayColor.includes(8))
    return true;
  else if(arrayColor.includes(0) && arrayColor.includes(3) && arrayColor.includes(6))
    return true;
  else if(arrayColor.includes(1) && arrayColor.includes(4) && arrayColor.includes(7))
    return true;
  else if(arrayColor.includes(2) && arrayColor.includes(5) && arrayColor.includes(8))
    return true;

  return false;
}

function checkForDraw(){ 
  //checkks if all the squares are marked to declair draw
  
  for(let i = 0; i<squares.length; i++){
    if(!squares[i].marked)
      return false;
  }
  return true;
}

function restart(event){ 
  //restarts all varibles and array of the model and reintitiates with new white squares 

  if(event.keyCode == 32){
    rainArray = [];
    red = [];
    blue = [];
    squares = [];

    gameEnded = false;
    shouldBlink = false;
    shouldRain = false;

    redP.classList.remove("redHighlight");
    blueP.classList.remove("blueHighlight");

    setTimeout(()=>{
      chooseSide();
    },500);

    deleteChildNodes(clearRect);
    createSquares();
    if(rainContainer != null) document.body.removeChild(rainContainer);    
      
  }
}


//all element creating/deleting realated functions
function createX(objectName){ 
  //creates and element with the x image in the refered object 

  let img = document.createElement("img");
  img.src = "images/x.png";
  objectName.appendChild(img);
  objectName.marked = "x";
}

function createO(objectName){ 
  //creates and element with the o image in the refered object 

  let img = document.createElement("img");
  img.src = "images/o.png";
  objectName.appendChild(img);
  objectName.marked = "o";
}

function createSquares(){ 
  //creating and placing the squares in the clearRect

  for(let i =0; i<9; i++){
    let tempSquare = document.createElement("div");

    tempSquare.className = "square";
    tempSquare.i = i;
    tempSquare.marked = "";
    tempSquare.onclick = markSquare;

    clearRect.appendChild(tempSquare);
    squares.push(tempSquare);
  }
}

function deleteChildNodes(object){ 
  //deletes all child nodes of a given element

  if(object.firstChild != null){
    object.removeChild(clearRect.firstChild);
    return deleteChildNodes(object);
  }
}


//all animation related functions
function blink(elementColor,arrayColor,goesUp){ 
  //resposible for the winner blinking animation, changes the alpha var in the color and restores to the original when it should not run anymore

  if(shouldBlink){
    let alpha = arrayColor[arrayColor.length-1]; 

    if(goesUp){
      alpha += 0.01;
      arrayColor[arrayColor.length-1] = alpha;
      if(alpha>1)
        goesUp = false;
    }

    else{
      alpha -= 0.01;
      arrayColor[arrayColor.length-1] = alpha;
      if(alpha<0.3)
        goesUp = true;
    }

    elementColor.style.backgroundColor = "rgba("+arrayColor[0]+","+arrayColor[1]+","+arrayColor[2]+","+arrayColor[3]+")";

    setTimeout(()=>{
      blink(elementColor,arrayColor,goesUp);
    },10);
  }

  else{ //restores the original alpha val
    blueP.style.backgroundColor = "rgba("+blueRGBA[0]+","+blueRGBA[1]+","+blueRGBA[2]+",0.3)";
    redP.style.backgroundColor = "rgba("+redRGBA[0]+","+redRGBA[1]+","+redRGBA[2]+",0.3)";
  }
}

function rain(counter,img1,img2, amountOfElements){ 
  //maintainning the positions of all raindrops existing 

  if(shouldRain){
    for(let i = 0; i<rainArray.length; i++){
      rainArray[i].reference.style.left = rainArray[i].x + "vw";
      rainArray[i].reference.style.top = rainArray[i].y + "vh";
      
      rainArray[i].y += 0.1;
      rainArray[i].reference.style.opacity = 1-(rainArray[i].y*0.01)-0.1 +"";
      
      if(rainArray[i].y > 90){ //if a raindrop hit the limit I specified (90vh) it would be removed 
        rainContainer.removeChild(rainArray[i].reference);
        rainArray.splice(i,1);
      }
    }
  
    counter++; //tracks one complete second when the page is running to avoid overcreations of raindrops
    if(counter == 100){
      newRowOfRain(img1,img2,amountOfElements);
      counter = 0;
    }

    setTimeout(()=>{rain(counter, img1,img2, amountOfElements);},10);
  }
}

function newRowOfRain(img1,img2,number){ 
  //creates the raindrops elements in the rainContainer

  for(let i = 0; i<number; i++){
    let tempImg = document.createElement("img");
    tempImg.src = Math.random() > 0.49 ? img1 : img2;

    tempImg.style.position = "absolute";
    tempImg.style.top = -10+"px";
    tempImg.style.zIndex = "3";
    
    let tempObject = {
      x:Math.floor((Math.random())*(100/number))+(100/number)*i,
      y:-10,
      reference: tempImg
    };
    
    if(tempObject.x>96)
      tempObject.x = 96;
    
    rainArray.push(tempObject);
    rainContainer.appendChild(tempImg);
  }
}

function createRainContainer(){ 
  //create the container of the rain drops to easy delete when needed

  rainContainer = document.createElement("div");
  rainContainer.id = "rainContainer";
  document.body.appendChild(rainContainer);
}
