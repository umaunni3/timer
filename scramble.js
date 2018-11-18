// scramble generation

var moves = ["R", "R2", "R'", "L", "L2", "L'", "U", "U2", "U'", "D", "D2", "D'", "F", "F2", "F'", "B", "B2", "B'"];

function chooseRandElem(arr) {
    // randomly choose an element from the array
    return arr[Math.floor(Math.random() * arr.length)];
}

var scrambleLength = 22; // longer scrambles to compensate for bad scramble generation method

function generateScramble() {
    // generate a scramble and return it as a string
    var scramble = "";
    for (var i = 0; i < scrambleLength; i++) {
        scramble += " " + chooseRandElem(moves) + "    ";
    }
    return scramble;
}