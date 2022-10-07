let clearRect,blueP, redP,mainContainer;
let turn = 0;
let gameEnded = false;
let squares = [];
let rainArray = [];
let red = [], blue = [];
// turn = 0 - blue + x
// turn = 1 - red + o
let blueRGBA = [136,188,216,1], redRGBA = [255,101,66,1];


function init(){
  clearRect = document.getElementById("clearBack");
  mainContainer = document.getElementById("mainContainer");
  redP = document.getElementById("redP");
  blueP = document.getElementById("blueP");
  blueP.classList.add("blueHighlight");
  createSquares();
}

function createSquares(){
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

function markSquare(event){
  if(event.target.marked == "" && !gameEnded){
    if(turn == 0){
      createX(event.target);
      blue.push(event.target.i);
      if(checkForWin(blue)){
        console.log("blue won");
        gameEnded = true;
        rain(0,"images/grayX.png","images/grayX.png",10);
        blueP.classList.remove("blueHighlight");
        blink(blueP,blueRGBA,false);
      }
      else if(checkForDraw()){
        blueP.classList.remove("blueHighlight");
        rain(0,"images/grayX.png","images/grayO.png",10);
      }
      else{
      blueP.classList.remove("blueHighlight");
      redP.classList.add("redHighlight");
      turn = 1;
      }
    }
    else{
      createO(event.target);
      red.push(event.target.i);
      if(checkForWin(red)){
        console.log("red won");
        gameEnded = true;
        rain(0,"images/grayO.png","images/grayO.png",10);
        redP.classList.remove("redHighlight");
        blink(redP,redRGBA,false);
      }
      else if(checkForDraw()){
        redP.classList.remove("redHighlight");
        rain(0,"images/grayX.png","images/grayO.png",10);
      }
      else{
      redP.classList.remove("redHighlight");
      blueP.classList.add("blueHighlight");
      turn = 0;
      }
    }
  }
}

function createX(objectName){
  let img = document.createElement("img");
  img.src = "images/x.png";
  objectName.appendChild(img);
  objectName.marked = "x";
}

function createO(objectName) {
  let img = document.createElement("img");
  img.src = "images/o.png";
  objectName.appendChild(img);
  objectName.marked = "o";
}

function checkForWin(arrayColor){
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
  for(let i = 0; i<squares.length; i++){
    if(!squares[i].marked)
      return false;
  }
  return true;
}

function rain(counter,img1,img2, amountOfElements){
  for(let i = 0; i<rainArray.length; i++){
    rainArray[i].reference.style.left = rainArray[i].x + "vw";
    rainArray[i].reference.style.top = rainArray[i].y + "vh";
    rainArray[i].y += 0.1;
    rainArray[i].reference.style.opacity = 1-(rainArray[i].y*0.01)-0.1 +"";
    if(rainArray[i].y > 90){
      mainContainer.removeChild(rainArray[i].reference);
      rainArray.splice(i,1);
    }
  }

  counter++;
  if(counter == 100){
    newRowOfRain(img1,img2,amountOfElements);
    counter = 0;
  }
  setTimeout(()=>{rain(counter, img1,img2, amountOfElements);},10);
}

function newRowOfRain(img1,img2,number){
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
    mainContainer.appendChild(tempImg);
  }
}

function blink(elementColor,arrayColor,goesUp){
  let i = arrayColor[arrayColor.length-1];
  if(goesUp){
    i += 0.01;
    arrayColor[arrayColor.length-1] = i;
    if(i>1)
      goesUp = false;
  }
  else{
    i -= 0.01;
    arrayColor[arrayColor.length-1] = i;
    if(i<0.3)
      goesUp = true;
  }
  elementColor.style.backgroundColor = "rgba("+arrayColor[0]+","+arrayColor[1]+","+arrayColor[2]+","+arrayColor[3]+")";
  setTimeout(()=>{
    blink(elementColor,arrayColor,goesUp);
  },10);
}