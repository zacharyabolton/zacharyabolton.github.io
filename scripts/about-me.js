var board;
var boardSide;
var squareSide;

var r, n, b, q, k, p, R, N, B, Q, K, P;

var moving = false;
var movingPiece;
var startingSquare;

var game;

function windowResized() {
    boardSide = min(windowWidth, 700);
    squareSide = boardSide/8;
    board = createCanvas(boardSide, boardSide);
    game.resize();
};

function preload() {
    // lowercase = black; uppercase = white;
    r = loadImage('../assets/chess_pieces/black_rook.svg');
    R = loadImage('../assets/chess_pieces/white_rook.svg');
    n = loadImage('../assets/chess_pieces/black_knight.svg');
    N = loadImage('../assets/chess_pieces/white_knight.svg');
    b = loadImage('../assets/chess_pieces/black_bishop.svg');
    B = loadImage('../assets/chess_pieces/white_bishop.svg');
    q = loadImage('../assets/chess_pieces/black_queen.svg');
    Q = loadImage('../assets/chess_pieces/white_queen.svg');
    k = loadImage('../assets/chess_pieces/black_king.svg');
    K = loadImage('../assets/chess_pieces/white_king.svg');
    p = loadImage('../assets/chess_pieces/black_pawn.svg');
    P = loadImage('../assets/chess_pieces/white_pawn.svg');
}

function setup() {
    boardSide = min(windowWidth, 700);
    squareSide = boardSide/8;
    board = createCanvas(boardSide, boardSide);

    game = new Board()
}

function draw() {
    // background('green');
    drawBoard();
    game.show();

}

function drawBoard() {
    for (var rank = 0; rank < 8; rank ++) {
        for (var file = 0; file < 8; file ++) {
            var black = ((rank + file) % 2);
            fill(black ? 'green' : 'white');
            noStroke();
            rect(rank * squareSide, file * squareSide, squareSide, squareSide);
        }
    }
}

function mousePressed(e) {
    var x = floor(mouseX/squareSide);
    var y = floor(mouseY/squareSide);
    startingSquare = {x: x, y: x};
    if (!moving) {
        movingPiece = game.getPieceAt(x, y);
        if (movingPiece != null) {
            movingPiece.movingThisPiece = true;
            e.preventDefault();
        } else {return}
    } else {
        if (movingPiece.canMove(x, y)) {
            movingPiece.move(x, y);
            movingPiece.movingThisPiece = false;
        } else {return}
    }
    moving = !moving;
}

function mouseReleased() {
    var x = floor(mouseX/squareSide);
    var y = floor(mouseY/squareSide);
    if (movingPiece) {
        if (movingPiece.canMove(x, y)) {
            movingPiece.move(x, y);
            movingPiece.movingThisPiece = false;
            movingPiece.movingThisPiece = false;
            startingSquare = null;
        } else {
            movingPiece.move(startingSquare.x, startingSquare.y);
            movingPiece.movingThisPiece = false;
            startingSquare = null;
        }
    } else {return}
    moving = !moving;
}
