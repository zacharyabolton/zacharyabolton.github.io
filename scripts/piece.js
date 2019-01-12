class Piece {
    constructor(x, y, isWhite) {
        this.x = x;
        this.y = y;
        this.pixelPosition = createVector(this.x * squareSide + squareSide/2, this.y * squareSide + squareSide/2);

        this.white = isWhite;
        this.movingThisPiece = false;
        this.taken = false;
        this.specialRules = function(tx, ty, sx, sy) {
            return;
        }
        this.rule = function(tx, ty, sx, sy) {
            return true;
        };
        this.validPieceMove = function(tx, ty, sx, sy) {
            if (this.rule(tx, ty, sx, sy)) {
                if (this.offBoard(tx, ty)) {
                    return false;
                } else 
                if (!(this instanceof Knight) && game.pieceInPath(tx, ty, sx, sy, this)) {
                    return false;
                } else
                if (game.pieceAt(tx, ty) && game.pieceAt(tx, ty).white == this.white) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }
    show() {
        imageMode(CENTER);
        if (this.movingThisPiece) {
            image(this.sprite, mouseX, mouseY, squareSide * 1.2, squareSide * 1.2);
        } else {
            image(this.sprite, this.x * squareSide + squareSide/2, this.y * squareSide + squareSide/2, squareSide, squareSide);
        }
    }
    reposition() {
        image(this.sprite, this.x * squareSide + squareSide/2, this.y * squareSide + squareSide/2, squareSide, squareSide);
        // this.pixelPosition = createVector(this.x * squareSide + squareSide/2, this.y * squareSide + squareSide/2);
    }
    offBoard(tx, ty) {
        if ((tx < 8) && (tx >= 0) && (ty < 8) && (ty >= 0)) {
            return false;
        } else {
            return true;
        }
    }
}

class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.castleable = true;
        this.sprite = isWhite ? KSprite : kSprite;
        this.inCheck = function(casltedOverSquareX, casltedOverSquareY) {
            for (var i = 0; i < game.pieces.length; i ++) {
                if (!game.pieces[i].taken) {
                    if (game.pieces[i].white != this.white) {
                        if (
                                game.pieces[i].validPieceMove(
                                    casltedOverSquareX || this.x, casltedOverSquareY || this.y, 
                                    game.pieces[i].x, game.pieces[i].y
                                )
                            ) {
                            game.checkingPiece = game.pieces[i];
                            return true;
                        };
                    }
                }
            }
            return false;
        }
        this.inCheckmate = function() {
            for (var ud = 0; ud < 3; ud ++) {
                for (var lr = 0; lr < 3; lr ++) {
                    if (!(ud == 1 && lr == 1)) {
                        if (game.legalMove((this.x - 1) + lr, (this.y - 1) + ud, this.x, this.y)) {
                            console.log(' ');
                            return false;
                        }
                    }
                }
            }
            for (var i = 0; i < game.pieces.length; i ++) {
                if (!game.pieces[i].taken) {
                    if (game.pieces[i].white == this.white) {
                        if (
                                game.legalMove(
                                    game.checkingPiece.x, game.checkingPiece.y,
                                    game.pieces[i].x, game.pieces[i].y
                                )
                        ) {
                            console.log(' ');
                            return false;
                        } else if (
                                !(game.checkingPiece instanceof Knight)
                        ) {
                            var xd = game.checkingPiece.x - this.x;
                            var yd = game.checkingPiece.y - this.y;
                            // if yd > 0 that means the attack is from below
                            // if xd > 0 that means the attack is from the right
                            if (xd == 0) {
                                if (yd > 0) {
                                    // directly above
                                    for (var testY = this.y + 1; testY < game.pieces[i].y; testY ++) {
                                        if (game.legalMove(this.x, testY, game.pieces[i].x, game.pieces[i].y)) {
                                            console.log(' ');
                                            return false
                                        }
                                    }
                                } else {
                                    // directly below
                                    for (var testY = this.y - 1; testY > game.pieces[i].y; testY --) {
                                        if (game.legalMove(this.x, testY, game.pieces[i].x, game.pieces[i].y)) {
                                            console.log(' ');
                                            return false
                                        }
                                    }
                                }
                            } else if (yd == 0) {
                                if (xd > 0) {
                                    // directly from the right
                                    for (var testX = this.x + 1; testX < game.pieces[i].x; testX ++) {
                                        if (game.legalMove(testX, this.y, game.pieces[i].x, game.pieces[i].y)) {
                                            console.log(' ');
                                            return false
                                        }
                                    }
                                } else {
                                    // directly from the left
                                    for (var testX = this.x - 1; testX > game.pieces[i].x; testX --) {
                                        if (game.legalMove(testX, this.y, game.pieces[i].x, game.pieces[i].y)) {
                                            console.log(' ');
                                            return false
                                        }
                                    }
                                }
                            } else if (yd > 0 && xd > 0) {
                                // from the bottom right
                                for (var testXY = 0; testXY < yd; testXY ++) {
                                    if (game.legalMove(this.x + testXY, this.y + testXY, game.pieces[i].x, game.pieces[i].y)) {
                                        console.log(' ');
                                        return false;
                                    }
                                }
                            } else if (yd > 0 && xd < 0) {
                                // from the bottom left
                                for (var testXY = 0; testXY < yd; testXY ++) {
                                    if (game.legalMove(this.x - testXY, this.y + testXY, game.pieces[i].x, game.pieces[i].y)) {
                                        console.log(' ');
                                        return false;
                                    }
                                }
                            } else if (yd < 0 && xd > 0) {
                                // from the top right
                                for (var testXY = 0; testXY > yd; testXY --) {
                                    if (game.legalMove(this.x + testXY, this.y + testXY, game.pieces[i].x, game.pieces[i].y)) {
                                        console.log(' ');
                                        return false;
                                    }
                                }
                            } else {
                                // from the top left
                                for (var testXY = 0; testXY > yd; testXY --) {
                                    if (game.legalMove(this.x + testXY, this.y - testXY, game.pieces[i].x, game.pieces[i].y)) {
                                        console.log(' ');
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log(' ');
            return true;
        }
        this.specialRules = function(tx, ty, sx, sy) {
            if (Math.abs(sx - tx) == 2) {
                var kingside = sx - tx == -2;
                var rookToCastle = kingside ? (whitesMove ? game.KR : game.kr) : (whitesMove ? game.QR : game.qr);
                rookToCastle.x = kingside ? 5 : 3;
                this.castleable = false;
                rookToCastle.castleable = false;
            }
        }
        this.rule = function(tx, ty, sx, sy) {
            var normalKingMove = Math.abs(sx - tx) <= 1 && Math.abs(sy - ty) <= 1;
            var kingside = sx - tx == -2;
            var rookPresentAndCastleable = kingside ? (game.pieceAt(7, this.y) instanceof Rook && game.pieceAt(7, this.y).castleable) : (game.pieceAt(0, this.y) instanceof Rook && game.pieceAt(0, this.y).castleable)
            return  normalKingMove ||
                    (
                        (Math.abs(sx - tx) <= 2 && Math.abs(sy - ty) <= 0) &&
                        (
                            this.castleable == true && 
                            rookPresentAndCastleable && 
                            (kingside ? !this.inCheck(5, ty) : !this.inCheck(2, ty)) && 
                            (!this.inCheck(tx, ty)) &&
                            (kingside ? true : (game.pieceAt(1, ty) ? false : true))
                        )
                    );
        }
    }
}

class Queen extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? QSprite : qSprite;
        this.rule = function(tx, ty, sx, sy) {
            return  ((sx == tx) ? !(sy == ty) : (sy == ty)) ||
                    Math.abs(tx - sx) == Math.abs(ty - sy);
        }
    }
}

class Rook extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.castleable = true;
        this.specialRules = function(tx, ty, sx, sy) {
            this.castleable = false;
        }
        this.sprite = isWhite ? RSprite : rSprite;
        this.rule = function(tx, ty, sx, sy) {
            return  (sx == tx) ? !(sy == ty) : (sy == ty);
        }
    }
}

class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? BSprite : bSprite;
        this.rule = function(tx, ty, sx, sy) {
            return  Math.abs(tx - sx) == Math.abs(sy - ty);
        }
    }
}

class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? NSprite : nSprite;
        this.rule = function(tx, ty, sx, sy) {
            return  (Math.abs(tx - sx) == 2 && Math.abs(ty - sy) == 1) ||
                    (Math.abs(ty - sy) == 2 && Math.abs(tx - sx) == 1)
        }
    }
}

class Pawn extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? PSprite : pSprite;
        this.captureableEP = false;
        this.specialRules = function(tx, ty, sx, sy) {
            if (this.white ? ty == 0 : ty == 7) {
                game.promote(tx, ty, this.white)
            }
        }
        this.rule = function(tx, ty, sx, sy) {
            var hasNotMoved = this.white ? this.y == 6 : this.y == 1;
            var doubleMove = tx == sx && ty - sy == (this.white ? -2 : 2);
            var unoccupied = game.pieceAt(tx, ty) == null;
            var normalPawnMove = tx == sx && (ty - sy == (this.white ? -1 : 1));
            var pawnCapture = Math.abs(tx - sx) == 1 && ty - sy == (this.white ? -1 : 1);
            var enemyPieceOnEPSquare = game.pieceAt(tx, (this.white ? 3 : 4));
            var friendlyPieceOnEPSquare = sy == (this.white ? 3 : 4);
            var EPCapture = enemyPieceOnEPSquare && friendlyPieceOnEPSquare && enemyPieceOnEPSquare.captureableEP && pawnCapture;
            var enemyPieceToCapture = game.pieceAt(tx, ty);
            var normalCapture = enemyPieceToCapture != null && pawnCapture;
            if (hasNotMoved) {
                if (doubleMove) {
                    this.captureableEP = true;
                }
                return  unoccupied ? 
                        (normalPawnMove || doubleMove) :
                        pawnCapture;
            } else if (EPCapture) {
                enemyPieceOnEPSquare.taken = true;
                return  true;
            } else if (normalCapture) {
                enemyPieceToCapture.taken = true;
                return true;
            } else {
                return  unoccupied && normalPawnMove;
            }
        }
    }
}
