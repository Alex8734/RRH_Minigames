import {ChessClient} from "../../server/server-client.js";
import {context, game} from "./main.js";

export class Game {
    constructor(size) {
        this.client = new ChessClient();
        this.size = size;
        this.fieldSize = 75;
        this.pieces = [
            new Piece("rook", 0, 0, "black"),
            new Piece("knight", 1, 0, "black"),
            new Piece("bishop", 2, 0, "black"),
            new Piece("queen", 3, 0, "black"),
            new Piece("king", 4, 0, "black"),
            new Piece("bishop", 5, 0, "black"),
            new Piece("knight", 6, 0, "black"),
            new Piece("rook", 7, 0, "black"),
            new Piece("pawn", 0, 1, "black"),
            new Piece("pawn", 1, 1, "black"),
            new Piece("pawn", 2, 1, "black"),
            new Piece("pawn", 3, 1, "black"),
            new Piece("pawn", 4, 1, "black"),
            new Piece("pawn", 5, 1, "black"),
            new Piece("pawn", 6, 1, "black"),
            new Piece("pawn", 7, 1, "black"),
            new Piece("rook", 0, 7, "white"),
            new Piece("knight", 1, 7, "white"),
            new Piece("bishop", 2, 7, "white"),
            new Piece("queen", 3, 7, "white"),
            new Piece("king", 4, 7, "white"),
            new Piece("bishop", 5, 7, "white"),
            new Piece("knight", 6, 7, "white"),
            new Piece("rook", 7, 7, "white"),
            new Piece("pawn", 0, 6, "white"),
            new Piece("pawn", 1, 6, "white"),
            new Piece("pawn", 2, 6, "white"),
            new Piece("pawn", 3, 6, "white"),
            new Piece("pawn", 4, 6, "white"),
            new Piece("pawn", 5, 6, "white"),
            new Piece("pawn", 6, 6, "white"),
            new Piece("pawn", 7, 6, "white"),
        ]
        this.activePiece = null;
        this.activeField = null;
        this.dots = [];
    }

    init() {
        this.redraw();
    }

    redraw() {
        this.drawBoard();
        this.drawPieces();
        this.drawDots();
    }

    drawBoard() {
        let isWhite = true;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (isWhite) {
                    context.fillStyle = "#ffce99";
                } else {
                    context.fillStyle = "#994f00";
                }

                context.fillRect(row * this.fieldSize, col * this.fieldSize, this.fieldSize, this.fieldSize);
                isWhite = !isWhite;
            }
            isWhite = !isWhite;
        }
    }

    drawPieces() {
        for (let piece of this.pieces) {
            let img = new Image();
            img.src = `./images/${piece.clr}_${piece.name}.png`;
            img.onload = function() {
                context.drawImage(img, piece.x * 75, piece.y * 75, 75, 75);
            };
            img.onerror = function() {
                console.log("Failed to load image.");
            };
        }
    }

    drawDots() {
        for (let dot of this.dots) {
            let img = new Image();
            img.src = "./images/dot.png";
            img.onload = function() {
                context.drawImage(img, dot.x * 75, dot.y * 75, 75, 75);
            };
            img.onerror = function() {
                console.log("Failed to load dot.");
            }
        }
    }

    clickOn(col, row) {

        for (let dot of this.dots) {
            if (dot.x === col && dot.y === row) {
                for (let piece of this.pieces) {
                    if (piece.x === col && piece.y === row) {
                        console.log(piece);
                        const index = this.pieces.indexOf(piece);
                        if (index > -1) {
                            this.pieces.splice(index, 1);
                        }
                        this.redraw();
                    }
                }
                this.activePiece.move(col, row);
                this.dots = [];
                this.redraw();
                return;
            }
        }
        for (let piece of this.pieces) {
            if (piece.x === col && piece.y === row) {
                this.dots = [];
                this.activePiece = piece;
                let moves = [];
                moves = piece.clickMe();
                for (let i = 0; i < moves.length; i++) {
                    this.dots.push(new Dot(moves[i].endX, moves[i].endY));
                }
                this.redraw();
                return;
            }
        }

        this.dots = [];
        this.redraw();
    }
}

export class Piece {
    constructor(name, x, y, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.clr = color;
    }

    move(col, row) {
        this.x = col;
        this.y = row
    }

    clickMe() {
        return this.calcMoves();
    }

    calcMoves() {
        switch (this.name) {
            case "pawn":
                return this.calcMovesPawn();
            case "rook":
                return this.calcMovesRook();
            case "knight":
                return this.calcMovesKnight();
            case "bishop":
                return this.calcMovesBishop();
            case "queen":
                return this.calcMovesQueen();
            case "king":
                return this.calcMovesKing();
            default:
                return this.calcMovesDefault();
        }
    }

    calcMovesPawn() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((this.x === i)) {
                    if (this.clr === "white") {
                        if (j - this.y === -1 || (this.y === 6 && j - this.y === -2)) {
                            for (let piece of game.pieces) {
                                if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                                    var k = true;
                                }

                            }
                            if (k) { break; }
                            console.log(1)
                            moves.push(new Move(this.x, this.y, i, j));
                        }
                    }
                    else {
                        if (j - this.y === 1 || (this.y === 1 && j - this.y === 2)) {
                            for (let piece of game.pieces) {
                                if ((piece.x !== i || piece.y !== j) && piece.clr !== this.clr) {

                                }

                            }
                            moves.push(new Move(this.x, this.y, i, j));
                        }
                    }
                }
            }
        }

        return moves;
    }

    calcMovesRook() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((this.x === i) !== (this.y === j)) {
                    moves.push(new Move(this.x, this.y, i, j));
                }
            }
        }

        return moves;
    }

    calcMovesKnight() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((Math.abs(this.x - i) + Math.abs(this.y - j)) === 3 && (this.x !== i) && (this.y !== j)) {
                    moves.push(new Move(this.x, this.y, i, j));
                }
            }
        }

        return moves;
    }

    calcMovesBishop() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Math.abs(this.x - i) === Math.abs(this.y - j)) {
                    if (!(this.x === i && this.y === j)) {
                        moves.push(new Move(this.x, this.y, i, j));
                    }
                }
            }
        }

        return moves;
    }

    calcMovesQueen() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((this.x === i) !== (this.y === j)) {
                    moves.push(new Move(this.x, this.y, i, j));
                }
                if (Math.abs(this.x - i) === Math.abs(this.y - j)) {
                    if (!(this.x === i && this.y === j)) {
                        moves.push(new Move(this.x, this.y, i, j));
                    }
                }
            }
        }

        return moves;
    }

    calcMovesKing() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((Math.abs(this.x - i) === 1 || Math.abs(this.y - j) === 1) && Math.abs(this.x - i) + Math.abs(this.y - j) <= 2){
                    moves.push(new Move(this.x, this.y, i, j));
                }
            }
        }

        return moves;
    }

    calcMovesDefault() {
        let moves;
        moves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                moves.push(new Move(this.x, this.y, j, i));
            }
        }

        return moves;
    }
}

export class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Move {
    constructor(fromX, fromY, toX, toY) {
        this.startX = fromX;
        this.startY = fromY;
        this.endX = toX;
        this.endY = toY
    }
}