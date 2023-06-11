import {ChessClient} from "../../server/server-client.js";
import {context} from "./main.js";

export class Game {
    constructor(size) {
        this.client = new ChessClient();
        this.size = size;
        this.fieldSize = size / 8;
        this.pieces = [
            new Piece("black_rook", 0, 0),
            new Piece("black_knight", 0, 1),
            new Piece("black_bishop", 0, 2),
            new Piece("black_queen", 0, 3),
            new Piece("black_king", 0, 4),
            new Piece("black_bishop", 0, 5),
            new Piece("black_knight", 0, 6),
            new Piece("black_rook", 0, 7),
            new Piece("black_pawn", 1, 0),
            new Piece("black_pawn", 1, 1),
            new Piece("black_pawn", 1, 2),
            new Piece("black_pawn", 1, 3),
            new Piece("black_pawn", 1, 4),
            new Piece("black_pawn", 1, 5),
            new Piece("black_pawn", 1, 6),
            new Piece("black_pawn", 1, 7),
            new Piece("white_rook", 7, 0),
            new Piece("white_knight", 7, 1),
            new Piece("white_bishop", 7, 2),
            new Piece("white_queen", 7, 3),
            new Piece("white_king", 7, 4),
            new Piece("white_bishop", 7, 5),
            new Piece("white_knight", 7, 6),
            new Piece("white_rook", 7, 7),
            new Piece("white_pawn", 6, 0),
            new Piece("white_pawn", 6, 1),
            new Piece("white_pawn", 6, 2),
            new Piece("white_pawn", 6, 3),
            new Piece("white_pawn", 6, 4),
            new Piece("white_pawn", 6, 5),
            new Piece("white_pawn", 6, 6),
            new Piece("white_pawn", 6, 7),
        ];
    }

    init() {
        this.drawBoard();
        this.drawPieces();
    }

    drawBoard() {
        let row = 0;
        let col = 0;
        let isWhite = false;

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
        for (const piece of this.pieces) {
            let img = new Image();
            img.src = `${piece.name}.png`;
            context.drawImage(img, piece.x * this.fieldSize, piece.y * this.fieldSize);
        }
    }
}

export class Piece {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Field {
    constructor(size, x, y, piece) {
        this.piece = piece;
    }
}