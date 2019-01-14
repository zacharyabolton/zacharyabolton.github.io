var boardSide;
var squareSide;
var board;
var game;

var rSprite, nSprite, bSprite, qSprite, kSprite, pSprite, RSprite, NSprite, BSprite, QSprite, KSprite, PSprite;
var impactFont;
var movingPiece;
var sx, sy;
var tx, ty;

var whitesMove = true;

function preload() {
    rSprite = loadImage('../assets/chess_pieces/black_rook.svg');
    RSprite = loadImage('../assets/chess_pieces/white_rook.svg');
    nSprite = loadImage('../assets/chess_pieces/black_knight.svg');
    NSprite = loadImage('../assets/chess_pieces/white_knight.svg');
    bSprite = loadImage('../assets/chess_pieces/black_bishop.svg');
    BSprite = loadImage('../assets/chess_pieces/white_bishop.svg');
    qSprite = loadImage('../assets/chess_pieces/black_queen.svg');
    QSprite = loadImage('../assets/chess_pieces/white_queen.svg');
    kSprite = loadImage('../assets/chess_pieces/black_king.svg');
    KSprite = loadImage('../assets/chess_pieces/white_king.svg');
    pSprite = loadImage('../assets/chess_pieces/black_pawn.svg');
    PSprite = loadImage('../assets/chess_pieces/white_pawn.svg');
    impactFont = loadFont('../assets/Impact.ttf')
}

function setup() {
    boardSide = min(windowWidth, 700);
    squareSide = boardSide/8;
    board = createCanvas(boardSide, boardSide);

    game = new Game()
}

function windowResized() {
    boardSide = min(windowWidth, 700);
    squareSide = boardSide/8;
    board = createCanvas(boardSide, boardSide);
    game.resize();
}

function draw() {
    game.show();
}

function mousePressed(e) {
    sx = floor(mouseX/squareSide);
    sy = floor(mouseY/squareSide);
    movingPiece = game.pieceAt(sx, sy);
    if (movingPiece && movingPiece.white === whitesMove) {
        e.preventDefault();
        movingPiece.movingThisPiece = true;
    } else {
        movingPiece = null;
        sx = null;
        sy = null;
    }
}

function mouseReleased() {
    if (movingPiece) {
        tx = floor(mouseX/squareSide);
        ty = floor(mouseY/squareSide);
        game.move(tx, ty, sx, sy);
    }
    movingPiece = null;
    sx = null;
    sy = null;
    tx = null;
    ty = null;
}
