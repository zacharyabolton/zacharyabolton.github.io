class Piece {
    constructor(x, y, isWhite, letter) {
        this.matrixPosition = createVector(x, y);
        this.pixelPosition = createVector(x * squareSide + squareSide/2, y * squareSide + squareSide/2);

        this.taken = false;
        this.white = isWhite;
        this.letter = letter;
        this.movingThisPiece = false;
    }
    show() {

        imageMode(CENTER);
        if (this.movingThisPiece) {
            image(this.sprite, mouseX, mouseY, squareSide * 1.2, squareSide * 1.2);
        } else {
            image(this.sprite, this.pixelPosition.x, this.pixelPosition.y, squareSide, squareSide);
        }
        
    }
    reposition() {
        this.pixelPosition = createVector(this.matrixPosition.x * squareSide + squareSide/2, this.matrixPosition.y * squareSide + squareSide/2);
    }
    move(x, y) {
        this.matrixPosition = createVector(x, y);
        this.pixelPosition = createVector(x * squareSide + squareSide/2, y * squareSide + squareSide/2);

    }
    canMove(x, y) {
        return true;
    }
}

class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? K : k;
    }
}

class Queen extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? Q : q;
    }
}

class Rook extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? R : r;
    }
}

class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? B : b;
    }
}

class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? N : n;
    }
}

class Pawn extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? P : p;
    }
}
