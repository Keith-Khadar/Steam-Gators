// Load the c++ files
const {performance} = require("perf_hooks"); // used to time the functions

let factory = require("./cplusplus_data.js"); // the c++ code
let searchFunction; // this is the varible that will store all the c++ code

// get the elements from the html doc that we will use
const posReview_text = document.getElementById("Posreview");
const negReview_text = document.getElementById("Negreview");
const SearchBar_text = document.getElementById("SearchBar");

const gameImage = document.getElementById("gameImage");
const orderedTime = document.getElementById("orderedMapSearchTime");
const unorderedTime = document.getElementById("unorderedMapSearchTime");

// declare variables
let ids = []; // List of ids, used to draw the names on the visualization
let movements = []; // used to determine which dirention on the tree to move next (left or right)
let iterations = 1; // how many times we had to redraw the tree
let levels = 5; // how many levels to draw
let levelsTraversed = 0;


let timer = null; // this is used for the animations

// get the code from the c++ file and save it in search function
factory().then((instance) => {
    searchFunction = instance;
});

// Search and visualize the tree
 function searchTree(){
    // clear the animations
    clearTimeout(timer);

    // get the id from the search input
    let text = SearchBar_text.value;
    let startOfID = text.lastIndexOf("(");
    if(startOfID != -1){
        text = text.substr(startOfID + 1, text.length - startOfID - 2);
    }

    // get the postive review
    posReview_text.value = searchFunction.searchTreePos(text);

    // get the negative reivew and time how long that takes
    var startTime = window.performance.now();
    negReview_text.value = searchFunction.searchTreeNeg(text);
    var endTime = window.performance.now();

    // get the game image
    gameImage.src = "https://steamcdn-a.akamaihd.net/steam/apps/" + text + "/header.jpg";

    // displays the time it took for the ordered map
    orderedTime.innerHTML = (endTime - startTime).toFixed(4) + " milliseconds";
    
    // time the unordered map
    startTime = window.performance.now();
    searchFunction.callToUnordered(text);
    endTime = window.performance.now();

    // display that time
    unorderedTime.innerHTML = (endTime - startTime).toFixed(4) + " milliseconds";

    // clear the visualization screen
    context.clearRect(0,0,screenWidth,screenHeight);

    // initalize all the varibles
    ids = [];
    titles = [];
    movements = [];
    iterations = 1;
    levels = 5;
    timer = null;
    levelsTraversed = 0;

    // draw the tree
    drawTree();

    // from the c++ code get all the ids and which directions to move through the tree
    idsVector = searchFunction.getIDs(text);
    for (var i = 0; i < idsVector.size(); i++) {
        if(i < idsVector.size()/2){
            ids.push(idsVector.get(i));
            if(i > 0){
                if(parseInt(ids.at(i-1)) < parseInt(ids.at(i))){
                    movements.push(1);
                }
                else{
                    movements.push(0);
                }
            }
        }
        else{
            titles.push(idsVector.get(i));
        }
        
    }
    // animate the tree (visualize going through the tree)
    animateTree();
}


// get the elements from the html doc for the animation
const myCanvas = document.getElementById("treeCanvas");
const context = myCanvas.getContext("2d");

const screenWidth = myCanvas.width;
const screenHeight = myCanvas.height;

const maxlevels = 15;

// draw the tree on startup
drawTree();

function drawTree(){
    let depth = levels;
    // if we are nearing the end of the tree we do not need to diplay so many levels
    if(levelsTraversed + levels + 1 > maxlevels){
        depth = maxlevels - levelsTraversed - 3;
    }

    // go through each level in the tree
    for(let i = 0; i <= depth; i++){
        let amountOfNodes = 2 ** i;

        let offest = screenWidth / (amountOfNodes * 2);
        let pos = 0;

        // draw each node in that level
        for(let j = 0; j < amountOfNodes; j++){
            pos += offest;

            if(i != 0){
                // draws the lines connecting the nodes
                context.globalCompositeOperation = "destination-over";
                let parentPos = ((Math.floor((pos / offest) / 4) * 2) + 1) * (offest * 2);
                context.moveTo(parentPos, 15 + (60 * (i - 1)));
                context.lineTo(pos, 15 + (60 * i))
                context.strokeStyle = "white";
                context.stroke();
            }
            // draw the node
            drawNode(pos, i, "blue");

            pos += offest;
        }
    }
}

function animateTree(){
    let pos = screenWidth / 2;

    // make the root node red and display its name
    drawNode(pos, 0, "red");
    drawID(pos, 0, 0);

    // if we need to move through the tree more times than the levels we can display, truncate how many levels we will move through
    // then redraw the tree and repeate this process

    let depth = movements.length;
    if(depth > levels){
        depth = levels;
    }

    // move through the levels
    for(let i = 1; i <= depth; i++){
        let amountOfNodes = 2 ** i;
        let offest = screenWidth / (amountOfNodes * 2);

        // go left
        if(movements[i - 1] == 0){
            pos = pos - offest;
        }
        // go right
        else{
            pos = pos + offest;
        }
        // make this node red
        timer = setTimeout(animateFrame, 250 * i, pos, i); // set timeout is used to give a delay between
        // making each node red so that its not all done instantly but instead is animated
        levelsTraversed++;
    }
    // if we still need move recenter the tree and animate it again
    if(depth < movements.length){
        timer = setTimeout(recenter, 250 * depth + 250, pos,15 + (depth * 60));
        for(let i = 0; i < depth; i++){
            movements.shift();
        }
    }
}

function animateFrame(pos, i){
    drawNode(pos, i, "red");
    drawID(pos, i, i);
    
}

function recenter(pos, height){

    clearInterval(timer);
    timer = setInterval(frame, 10);

    function frame(){
        // clear the screen
        context.clearRect(0,0,screenWidth,screenHeight);

        // while the node we are moving to be the new root is not at the top of the screen
        // continue to move it towards the top middle
        // if it is at the top stop this animation and continue animating the tree
        if(height < 15){
            clearInterval(timer);

            // delete the ids and titles we already went through
            for(let i = 0; i < levels; i++){
                ids.shift();
                titles.shift();
            }

            // redraw the tree and continue the animation
            drawTree();
            animateTree();
        }
        else{
            // move the node towards the middle left
            drawNode(pos,height/60,"red");
            drawID(pos, levels, height/60);

            if(pos < screenWidth / 2){
                pos += 2;
            }
            else{
                pos -= 2;
            }
            height -= 4;
        }
    }
}

function drawNode(pos, i, color){
    context.beginPath();
    context.arc(pos, 15 + (60 * i), 12.5, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.globalCompositeOperation = "source-over";
    context.fill();
    context.stroke();
}

function drawID(pos, i, height){
    context.font = "bold 16px Arial";
    context.fillStyle = "white";

    // if the id is on the left draw it more to the right so it does not clip out of the screen
    // same for on the right side
    // if its in the middle just draw it in the middle

    if(pos < screenWidth/2 + 40 && pos > screenWidth/2 - 40){
        context.fillText(titles[i],pos - (4 * titles[i].length),15 + (60 * height)+ 30);
    }
    else if(pos > screenWidth/2){
        context.fillText(titles[i],pos - (8 * titles[i].length),15 + (60 * height)+ 30);
    }
    else{
        context.fillText(titles[i],pos + (2 * titles[i].length),15 + (60 * height)+ 30);
    }
}

module.exports = {'searchTree': searchTree};
