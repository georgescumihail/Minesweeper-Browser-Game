var gamefield = []
var visited = []
var mudHoles = []

var tableSize = 10;
var lost = false;

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');


var lostMessage = document.getElementById('lost-message');


var canvasSize = 400;

canvas.width = canvasSize;
canvas.height = canvasSize;

var sectionSize = canvasSize / tableSize;

canvas.addEventListener('mousedown', function (e) {

    if (e.button == 0) {
        clickedSection(e);
    }

    if (e.button == 2) {
        //rightClickedSection(e);
    }
});


var restartButton = document.getElementById('restart');
restartButton.addEventListener('click', startGame);



startGame();

function startGame() {

    lost = false;
    lostMessage.innerText = '';
    context.clearRect(0, 0, canvasSize, canvasSize);
    context.globalAlpha = 1;

    generateField();
    generateMud();
    calculateValues();

    context.fillStyle = '#66DD66';
    context.fillRect(0, 0, canvasSize, canvasSize);

    drawGrid();
}


function drawGrid() {
    for (var i = 0; i <= tableSize; i++) {

        context.strokeStyle = '#000000';
        context.globalAlpha = 0.8;
        context.beginPath();
        context.moveTo(0, i * (canvas.height / tableSize));
        context.lineTo(600, i * (canvas.height / tableSize));
        context.stroke();
        context.stroke();

        context.beginPath();
        context.moveTo(i * (canvas.height / tableSize), 0);
        context.lineTo(i * (canvas.height / tableSize), 600);
        context.stroke();
        context.stroke();
    }

    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function generateField() {

    for (var i = 0; i < tableSize; i++) {
        gamefield[i] = [];

        for (var j = 0; j < tableSize; j++) {
            gamefield[i][j] = 0;
        }
    }

    for (var i = 0; i < tableSize; i++) {
        visited[i] = [];

        for (var j = 0; j < tableSize; j++) {
            visited[i][j] = false;
        }
    }

}

function generateMud() {

    mudHoles = []
    var tries = tableSize;

    for (var i = 0; i < tries; i++) {

        var randX = Math.floor(Math.random() * tableSize);
        var randY = Math.floor(Math.random() * tableSize);

        if (mudHoles.some(m => m.x === randX) && mudHoles.some(m => m.y === randY)) {
            tries++;
        }
        else {
            gamefield[randX][randY] = 99;
            mudHoles.push({ x: randX, y: randY });
        }

    }
}

function calculateValues() {

    for (var i = 0; i < tableSize; i++) {       // checking if there is mud next to each field
        for (var j = 0; j < tableSize; j++) {

            if (gamefield[i][j] !== 99) {
                if (i > 0) {                                    // top
                    if (gamefield[i - 1][j] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (i > 0 && j < tableSize - 1) {               // top-right
                    if (gamefield[i - 1][j + 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (j < tableSize - 1) {                         // right
                    if (gamefield[i][j + 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (i < tableSize - 1 && j < tableSize - 1) {    // bottom-right
                    if (gamefield[i + 1][j + 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (i < tableSize - 1) {                        // bottom
                    if (gamefield[i + 1][j] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (i < tableSize - 1 && j > 0) {               // bottom-left
                    if (gamefield[i + 1][j - 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (j > 0) {                                    // left
                    if (gamefield[i][j - 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
                if (i > 0 && j > 0) {                           // top-left
                    if (gamefield[i - 1][j - 1] == 99) {
                        gamefield[i][j]++;
                    }
                }
            }

        }
    }
}

function clickedSection(e) {

    var coordX = e.clientX - canvas.offsetLeft;
    var coordY = e.clientY - canvas.offsetTop + window.pageYOffset;

    var iSelected = Math.floor(coordY / sectionSize);
    var jSelected = Math.floor(coordX / sectionSize);

    if (visited[iSelected][jSelected] == false && lost == false) {

        drawSection(iSelected, jSelected);
    }

}

/*
function rightClickedSection(e) {

    var coordX = e.clientX - canvas.offsetLeft;
    var coordY = e.clientY - canvas.offsetTop + window.pageYOffset;

    var iSelected = Math.floor(coordY / sectionSize);
    var jSelected = Math.floor(coordX / sectionSize);

    if (visited[iSelected][jSelected] == 99 && lost == false) {

        context.fillStyle = '#775511';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);
    }
}

*/

function drawSection(i, j) {

    if (gamefield[i][j] == 99) {

        context.fillStyle = '#775511';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);

        lost = true;
        lostDisplay();
    }

    else if (gamefield[i][j] > 0) {
        context.font = '25px Comic Sans MS';
        context.fillStyle = '#AAFFAA';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);
        context.fillStyle = '#EE4444';
        context.fillText(gamefield[i][j], j * sectionSize + sectionSize / 3, i * sectionSize + sectionSize / 1.4);
    }
    else {
        context.fillStyle = '#AAFFAA';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);
    }
    visited[i][j] = true;

    if (gamefield[i][j] == 0) {     // recursive call to reveal all sections around an empty section if they are empty as well

        if (i > 0 && visited[i - 1][j] == false) { drawSection(i - 1, j); }
        if (j > 0 && visited[i][j - 1] == false) { drawSection(i, j - 1); }
        if (i < tableSize - 1 && visited[i + 1][j] == false) { drawSection(i + 1, j); }
        if (j < tableSize - 1 && visited[i][j + 1] == false) { drawSection(i, j + 1); }
        if (i > 0 && j > 0 && visited[i - 1][j - 1] == false) { drawSection(i - 1, j - 1); }
        if (i > 0 && j < tableSize - 1 && visited[i - 1][j + 1] == false) { drawSection(i - 1, j + 1); }
        if (i < tableSize - 1 && j > 0 && visited[i + 1][j - 1] == false) { drawSection(i + 1, j - 1); }
        if (i < tableSize - 1 && j < tableSize - 1 && visited[i + 1][j + 1] == false) { drawSection(i + 1, j + 1); }
    }
    else {

        return;
    }

    console.log(i + " " + j);
}


function lostDisplay() {

    var lostMessage = document.getElementById('lost-message');
    lostMessage.innerText = "You fell in the mud puddle. Try again!";
}

console.log(gamefield);