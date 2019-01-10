class Piece {
    constructor(x, y, isWhite) {
        this.x = x;
        this.y = y;
        // this.matrixPosition = createVector(this.x, this.y);
        this.pixelPosition = createVector(this.x * squareSide + squareSide/2, this.y * squareSide + squareSide/2);

        this.white = isWhite;
        this.movingThisPiece = false;
        this.taken = false;
        this.specialRules = function(tx, ty, sx, sy) {
            return;
        }
        this.rule = function(tx, ty, sx, sy, debug) {
            return true;
        };
        this.legalMove = function(tx, ty, sx, sy, debug) {
            if (this.rule(tx, ty, sx, sy, debug)) {
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
                                        game.pieces[i].legalMove(
                                            casltedOverSquareX || this.x, casltedOverSquareY || this.y, 
                                            game.pieces[i].x, game.pieces[i].y,
                                            false
                                        )
                            ) {
                            return true;
                        };
                    }
                }
            }
            return false;
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
        this.rule = function(tx, ty, sx, sy, debug) {
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
        this.rule = function(tx, ty, sx, sy, debug) {
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
        this.rule = function(tx, ty, sx, sy, debug) {
            return  (sx == tx) ? !(sy == ty) : (sy == ty);
        }
    }
}

class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? BSprite : bSprite;
        this.rule = function(tx, ty, sx, sy, debug) {
            return  Math.abs(tx - sx) == Math.abs(sy - ty);
        }
    }
}

class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.sprite = isWhite ? NSprite : nSprite;
        this.rule = function(tx, ty, sx, sy, debug) {
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
        this.rule = function(tx, ty, sx, sy, debug) {
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
            if (debug) {
                // console.log({
                //     'enemy piece on EP square': enemyPieceOnEPSquare, 
                //     'friendly piece on EP square': friendlyPieceOnEPSquare, 
                //     'enemy piece catureable EP': enemyPieceOnEPSquare ? enemyPieceOnEPSquare.captureableEP : 'no such piece',
                //     'is pawn capture': pawnCapture
                // });
            }
            
            if (hasNotMoved) {
                if (doubleMove) {
                    this.captureableEP = true;
                }
                return  unoccupied ? 
                        (normalPawnMove || doubleMove) :
                        pawnCapture;
            } else if (EPCapture) {
                enemyPieceOnEPSquare.taken = true;
                // game.removePiece(enemyPieceOnEPSquare);
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
