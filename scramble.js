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
    var prevMove = null;
    for (var i = 0; i < scrambleLength; i++) {
        var move = chooseRandElem(moves);
        if (prevMove != null) {
            // can't index into prevMove when it's null
            while (prevMove[0] == move[0]) {
            // if this move starts with the same letter as the last move, choose a new move
            move = chooseRandElem(moves);
            }
        }
        
        scramble += move + " ";
        prevMove = move;
    }
    return scramble;
}