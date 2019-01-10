class Game {
    constructor(boardSide) {
        this.qr = new Rook(0, 0, false);this.qn = new Knight(1, 0, false);this.qb = new Bishop(2, 0, false);this.q = new Queen(3, 0, false);this.k = new King(4, 0, false);this.kb = new Bishop(5, 0, false);this.kn = new Knight(6, 0, false);this.kr = new Rook(7, 0, false);
        this.qrp = new Pawn(0, 1, false);this.qnp = new Pawn(1, 1, false);this.qbp = new Pawn(2, 1, false);this.qp = new Pawn(3, 1, false);this.kp = new Pawn(4, 1, false);this.kbp = new Pawn(5, 1, false);this.knp = new Pawn(6, 1, false);this.krp = new Pawn(7, 1, false);
        this.QRP = new Pawn(0, 6, true);this.QNP = new Pawn(1, 6, true);this.QBP = new Pawn(2, 6, true);this.QP = new Pawn(3, 6, true);this.KP = new Pawn(4, 6, true);this.KBP = new Pawn(5, 6, true);this.KNP = new Pawn(6, 6, true);this.KRP = new Pawn(7, 6, true);
        this.QR = new Rook(0, 7, true);this.QN = new Knight(1, 7, true);this.QB = new Bishop(2, 7, true);this.Q = new Queen(3, 7, true);this.K = new King(4, 7, true);this.KB = new Bishop(5, 7, true);this.KN = new Knight(6, 7, true);this.KR = new Rook(7, 7, true);
        this.pieces = [this.K, this.k, this.Q, this.q, this.KR, this.kr, this.QR, this.qr, this.KB, this.kb, this.QB, this.qb, this.KN, this.kn, this.QN, this.qn, this.QRP, this.QNP, this.QBP, this.QP, this.KP, this.KBP, this.KNP, this.KRP, this.qrp, this.qnp, this.qbp, this.qp, this.kp, this.kbp, this.knp, this.krp];
        this.extraQueens = 0;
    }
    promote(tx, ty, isWhite) {
        this.pieceAt(tx, ty).taken = true;
        this.extraQueens ++;
        if (isWhite) {

            this.Q = new Queen(tx, ty, isWhite);
            this.pieces.push(this.Q);
        } else {
            this.q = new Queen(tx, ty, isWhite);
            this.pieces.push(this.q)
        }
    }
    show() {
        for (var rank = 0; rank < 8; rank ++) {
            for (var file = 0; file < 8; file ++) {
                var black = ((rank + file) % 2);
                fill(black ? 'green' : 'white');
                noStroke();
                rect(rank * squareSide, file * squareSide, squareSide, squareSide);
            }
        }
        for (var i = 0; i < this.pieces.length; i ++) {
            if (!this.pieces[i].taken) {
                this.pieces[i].show();
            }
        }
    }
    resize() {
        for (var i = 0; i < this.pieces.length; i ++) {
            this.pieces[i].reposition();
        }
    }
    pieceAt(x, y) {
        for (var i = 0; i < this.pieces.length; i ++) {
            if (!this.pieces[i].taken) {
                if (this.pieces[i].x == x && this.pieces[i].y == y) {
                    return this.pieces[i];
                }
            }
        }
        return null;
    }
    // removePiece(piece) {
    //    this.pieces = this.pieces.filter(ele => ele != piece);
    // }
    pieceInPath(tx, ty, sx, sy, movingPiece) {
        var dxc, dyc, dxl, dyl, cross, found;
        found = false;
        for (var i = 0; i < this.pieces.length; i ++) {
            if (!this.pieces[i].taken) {
                if (
                            this.pieces[i] != movingPiece && 
                            !(
                                this.pieces[i].x == tx &&
                                this.pieces[i].y == ty
                            ) &&
                            !(
                                this.pieces[i].x == sx &&
                                this.pieces[i].y == sy
                            )

                ) {
                    if (found) {
                        return true;
                    }

                    dxc = this.pieces[i].x - sx;
                    dyc = this.pieces[i].y - sy;

                    dxl = tx - sx;
                    dyl = ty - sy;

                    cross = dxc * dyl - dyc * dxl;
                    if (cross == 0) {
                        if (Math.abs(dxl) >= Math.abs(dyl)) {
                            found = dxl > 0 ?
                                sx <= this.pieces[i].x && this.pieces[i].x <= tx :
                                tx <= this.pieces[i].x && this.pieces[i].x <= sx
                        } else {
                            found = dyl > 0 ?
                                sy <= this.pieces[i].y && this.pieces[i].y <= ty :
                                ty <= this.pieces[i].y && this.pieces[i].y <= sy
                        }
                    }
                }
            }
        }
        return found;
    }
    removeEPCaptures(whitesMove) {
        for (var i = 0; i < this.pieces.length; i ++) {
            if (this.pieces[i] instanceof Pawn && (whitesMove ? this.pieces[i].white : !this.pieces[i].white) && this.pieces[i].captureableEP) {
                
                this.pieces[i].captureableEP = false;
            }
        }
    }
    move(tx, ty, sx, sy) {
        var legal = movingPiece.legalMove(tx, ty, sx, sy);
        var occupant = this.pieceAt(tx, ty);
        var kingToCheck = whitesMove ? this.K : this.k;
        if (legal) {
            if (occupant) { occupant.taken = true; }
            movingPiece.x = tx;
            movingPiece.y = ty;
            if (kingToCheck.inCheck()) {
                movingPiece.x = sx;
                movingPiece.y = sy;
                if (occupant){ occupant.taken = false; }
            } else {
                movingPiece.specialRules(tx, ty, sx, sy);
                whitesMove = !whitesMove;
                this.removeEPCaptures(whitesMove);
            }
        } else {
            movingPiece.x = sx;
            movingPiece.y = sy;
        }
        movingPiece.movingThisPiece = false;
    }
}