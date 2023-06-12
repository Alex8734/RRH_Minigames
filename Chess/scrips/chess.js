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
                        console.log(piece, "was taken rn (funnymoment)");
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

    checkForMate() {
        let kings = this.pieces.filter(piece => piece.name === "king");

        for (let king of kings) {
            let mvs = king.calcMovesKing();
            if (mvs === []) {
                return king.clr;
            }
        }

        return "none";
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
        this.y = row;

        let lastRow = this.clr === "white" ? 0 : 7;

        if (this.name === "pawn" && this.y === lastRow) {
            this.name = "queen";
        }
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
        let moves = [];
        let direction = this.clr === "white" ? -1 : 1;
        let startRow = this.clr === "white" ? 6 : 1;

        // Check forward moves
        for (let i = 1; i <= 2; i++) {
            let newRow = this.y + direction * i;
            if (newRow < 0 || newRow > 7) continue;
            if (i === 2 && this.y !== startRow) continue;

            if (!game.pieces.some(piece => piece.x === this.x && piece.y === newRow)) {
                if (!this.calcMoveBlocked(this.x, this.x, this.y, newRow)) {
                    let move = new Move(this.x, this.y, this.x, newRow);
                    moves.push(move);
                }
            }
        }

        // Check diagonal captures
        for (let i of [-1, 1]) {
            let newRow = this.y + direction;
            let newCol = this.x + i;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;

            if (game.pieces.some(piece => piece.clr !== this.clr && piece.x === newCol && piece.y === newRow)) {
                let move = new Move(this.x, this.y, newCol, newRow);
                moves.push(move);
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
                    let k;
                    for (let piece of game.pieces) {
                        if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                            k = true;
                        }

                    }
                    if (k) { k = false; continue; }
                    console.log(i, j, "fine ig");
                    if (!this.calcMoveBlocked(this.x, i, this.y, j)) {
                        moves.push(new Move(this.x, this.y, i, j));
                    }
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
                    let k;
                    for (let piece of game.pieces) {
                        if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                            k = true;
                        }

                    }
                    if (k) { k = false; continue; }
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
                        let k;
                        for (let piece of game.pieces) {
                            if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                                k = true;
                            }

                        }
                        if (k) { k = false; continue; }
                        if (!this.calcMoveBlockedDiagonal(this.x, i, this.y, j)) {
                            moves.push(new Move(this.x, this.y, i, j));
                        }
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
                    let k;
                    for (let piece of game.pieces) {
                        if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                            k = true;
                        }

                    }
                    if (k) { k = false; continue; }
                    if (!this.calcMoveBlocked(this.x, i, this.y, j)) {
                        moves.push(new Move(this.x, this.y, i, j));
                    }
                }
                if (Math.abs(this.x - i) === Math.abs(this.y - j)) {
                    if (!(this.x === i && this.y === j)) {
                        let k;
                        for (let piece of game.pieces) {
                            if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                                k = true;
                            }

                        }
                        if (k) { k = false; continue; }
                        if (!this.calcMoveBlockedDiagonal(this.x, i, this.y, j)) {
                            moves.push(new Move(this.x, this.y, i, j));
                        }
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
                    let k;
                    for (let piece of game.pieces) {
                        if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                            k = true;
                        }

                    }
                    if (k) { k = false; continue; }
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
                let k;
                for (let piece of game.pieces) {
                    if (piece.clr === this.clr && piece.x === i && piece.y === j) {
                        k = true;
                    }

                }
                if (k) { k = false; continue; }
                moves.push(new Move(this.x, this.y, i, j));
            }
        }

        return moves;
    }

    calcMoveBlocked(fromX, toX, fromY, toY) {
        if (fromX === toX) {
            return this.calcBlockedY(fromY, toY, fromX);
        }
        return this.calcBlockedX(fromX, toX, fromY);
    }

    calcMoveBlockedDiagonal(fromX, toX, fromY, toY) {
        let xDiff = Math.abs(fromX - toX);
        let yDiff = Math.abs(fromY - toY);

        if (xDiff !== yDiff) {
            return false;
        }

        let xIncrement = fromX < toX ? 1 : -1;
        let yIncrement = fromY < toY ? 1 : -1;

        let currentX = fromX + xIncrement;
        let currentY = fromY + yIncrement;

        while (currentX !== toX) {
            if (game.pieces.some(piece => piece.x === currentX && piece.y === currentY)) {
                return true;
            }
            currentX += xIncrement;
            currentY += yIncrement;
        }

        return false;
    }
    calcBlockedX(from, to, y) {
        for (let i = Math.min(from, to) + 1; i < Math.max(from, to); i++) {
            for (let piece of game.pieces) {
                if (piece.x === i && piece.y === y) {
                    return true;
                }
            }
        }
        return false;
    }

    calcBlockedY(from, to, x) {
        for (let i = Math.min(from, to) + 1; i < Math.max(from, to); i++) {
            for (let piece of game.pieces) {
                if (piece.y === i && piece.x === x) {
                    return true;
                }
            }
        }
        return false;
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
        this.endY = toY;
    }
}