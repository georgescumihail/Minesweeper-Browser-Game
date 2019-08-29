var gamefield = []
var savedGamefield = []
var visited = []
var mudHoles = []
var piggies = 10;
var mudLeft = 10;

var tableSize = 10;
var lost = false;

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var piggyImage = new Image();
piggyImage.src = 'img/piggy-mine.png';
piggyImage.width = 40;
piggyImage.height = 40;
piggyImage.globalAlpha = 0.5;

var lostMessage = document.getElementById('lost-message');
var wonMessage = document.getElementById('won-message');
var pigScore = document.getElementById('score');


var canvasSize = 400;

canvas.width = canvasSize;
canvas.height = canvasSize;

var sectionSize = canvasSize / tableSize;

canvas.addEventListener('mousedown', function (e) {

    if (e.button == 0) {
        clickedSection(e);
    }

    if (e.button == 2 && piggies >= 0) {
        rightClickedSection(e);
    }
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);

var restartButton = document.getElementById('restart');
restartButton.addEventListener('click', startGame);



startGame();

function startGame() {


    lost = false;
    lostMessage.innerText = '';
    wonMessage.innerText = '';
    context.clearRect(0, 0, canvasSize, canvasSize);
    context.globalAlpha = 1;
    piggies = 10;
    mudLeft = 10;

    generateField();
    generateMud();
    calculateValues();

    context.fillStyle = '#66DD66';
    context.fillRect(0, 0, canvasSize, canvasSize);

    drawGrid();
    displayNumberLeft();
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
        savedGamefield[i] = [];

        for (var j = 0; j < tableSize; j++) {
            savedGamefield[i][j] = 0;
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

    for (var i = 0; i < tableSize; i++) {
        for (var j = 0; j < tableSize; j++) {
            savedGamefield[i][j] = gamefield[i][j];
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


function rightClickedSection(e) {

    var coordX = e.clientX - canvas.offsetLeft;
    var coordY = e.clientY - canvas.offsetTop + window.pageYOffset;

    var iSelected = Math.floor(coordY / sectionSize);
    var jSelected = Math.floor(coordX / sectionSize);


    if (gamefield[iSelected][jSelected] == 99 && lost == false && piggies > 0) {

        context.drawImage(piggyImage, jSelected * sectionSize, iSelected * sectionSize);

        visited[iSelected][jSelected] = true;
        gamefield[iSelected][jSelected] = 88; // 88 means mine marked correctly
        piggies--;
        mudLeft--;

    }

    else if (lost == false && gamefield[iSelected][jSelected] < 10 && visited[iSelected][jSelected] == false && piggies > 0) {

        context.drawImage(piggyImage, jSelected * sectionSize, iSelected * sectionSize);
        gamefield[iSelected][jSelected] = 77; // 77 means false alarm
        piggies--;
        visited[iSelected][jSelected] = true;
    }

    else if (gamefield[iSelected][jSelected] == 77 && lost == false) {

        context.clearRect(jSelected * sectionSize, iSelected * sectionSize, sectionSize, sectionSize);
        context.fillStyle = '#66DD66';
        context.fillRect(jSelected * sectionSize, iSelected * sectionSize, sectionSize, sectionSize);
        gamefield[iSelected][jSelected] = savedGamefield[iSelected][jSelected];
        piggies++;
        visited[iSelected][jSelected] = false;
    }

    else if (gamefield[iSelected][jSelected] == 88 && lost == false) {

        context.clearRect(jSelected * sectionSize, iSelected * sectionSize, sectionSize, sectionSize);
        context.fillStyle = '#66DD66';
        context.fillRect(jSelected * sectionSize, iSelected * sectionSize, sectionSize, sectionSize);
        gamefield[iSelected][jSelected] = 99;
        visited[iSelected][jSelected] = false;
        piggies++;
        mudLeft++;
    }

    if (piggies == 0 && mudLeft == 0) {
        wonDisplay();
    }

    console.log(gamefield[iSelected][jSelected]);
    displayNumberLeft();
}



function drawSection(i, j) {

    if (gamefield[i][j] == 99) {

        context.fillStyle = '#775511';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);

        lost = true;
        lostDisplay();
    }

    else if (gamefield[i][j] > 0 && gamefield[i][j] < 10) {
        context.font = '25px Comic Sans MS';
        context.fillStyle = '#AAFFAA';
        context.fillRect(j * sectionSize, i * sectionSize, sectionSize, sectionSize);
        context.fillStyle = '#EE4444';
        context.fillText(gamefield[i][j], j * sectionSize + sectionSize / 3, i * sectionSize + sectionSize / 1.4);
    }
    else if (gamefield[i][j] == 0) {
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

    if (piggies == 0 && mudLeft == 0) {
        wonDisplay();
    }

    console.log(i + ' ' + j);
}


function lostDisplay() {

    lostMessage.innerText = 'You fell in the mud puddle. Try again!';
}

function wonDisplay() {

    for (var i = 0; i < tableSize; i++) {    // reveals the whole field
        for (var j = 0; j < tableSize; j++) {
            if (visited[i][j] == false) {
                drawSection(i, j);
            }
        }
    }
    wonMessage.innerText = 'All the piggies are in their mud puddles! Congratulations!';
}

function displayNumberLeft() {

    pigScore.innerText = 'Piggies: ' + piggies;
}

console.log(gamefield);