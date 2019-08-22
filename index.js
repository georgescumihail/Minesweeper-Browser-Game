var gamefield = []
var mudHoles = []

var tableSize = 10;

generateField();
generateMud();
calculateValues();


var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;


drawGrid();

for (var i = 0; i < tableSize; i++) {
    for (var j = 0; j < tableSize; j++) {

        if (gamefield[i][j] == 99) {

            context.fillStyle = '#775511';
            context.fillRect(j * (canvas.height / tableSize), i * (canvas.height / tableSize), canvas.height / tableSize, canvas.height / tableSize);
        }

        else if (gamefield[i][j] > 0) {
            context.font = '25px Comic Sans MS';
            context.fillStyle = '#AAFFAA';
            context.fillRect(j * (canvas.height / tableSize), i * (canvas.height / tableSize), canvas.height / tableSize, canvas.height / tableSize);
            context.fillStyle = '#EE4444';
            context.fillText(gamefield[i][j], j * (canvas.height / tableSize) + canvas.height / tableSize / 3, i * (canvas.height / tableSize) + canvas.height / tableSize / 1.4);
        }
        else {
            context.font = '25px Comic Sans MS';
            context.fillStyle = '#AAFFAA';
            context.fillRect(j * (canvas.height / tableSize), i * (canvas.height / tableSize), canvas.height / tableSize, canvas.height / tableSize);
            context.fillStyle = '#111111';
            context.fillText(gamefield[i][j], j * (canvas.height / tableSize) + canvas.height / tableSize / 3, i * (canvas.height / tableSize) + canvas.height / tableSize / 1.4);
        }
    }

}

drawGrid();

function drawGrid() {
    for (var i = 0; i <= tableSize; i++) {

        context.strokeStyle = '#111111';
        context.beginPath();
        context.moveTo(0, i * (canvas.height / tableSize));
        context.lineTo(600, i * (canvas.height / tableSize));
        context.stroke();

        context.beginPath();
        context.moveTo(i * (canvas.height / tableSize), 0);
        context.lineTo(i * (canvas.height / tableSize), 600);
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

}


function generateMud() {

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

console.log(gamefield);