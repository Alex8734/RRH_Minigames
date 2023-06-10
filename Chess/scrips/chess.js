import {ChessClient} from "../../server/server-client.js";
import {context} from "./main.js";

export class Game {
    constructor(size)
    {
        this.client = new ChessClient();
        this.size = size;
        this.fieldSize = size / 8;
    }

    init() {
        this.initBoard();
        this.initPieces();
    }
    initBoard() {
        let row = 0;
        let col = 0;
        let isWhite = false;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (isWhite)
                {
                    context.fillStyle = "#ffce99";
                }
                else
                {
                    context.fillStyle = "#994f00";
                }

                context.fillRect(row * this.fieldSize, col * this.fieldSize, this.fieldSize, this.fieldSize);
                isWhite = !isWhite;
            }
            isWhite = !isWhite;
        }
    }
    initPieces() {
        const blackRook = new Image();
        blackRook.src = "images/black_rook.png";
        blackRook.onload = () => {
            context.drawImage(blackRook, 0, 0, this.fieldSize, this.fieldSize)
            context.drawImage(blackRook, this.fieldSize * 7, 0, this.fieldSize, this.fieldSize)
        }

        const blackKnight = new Image();
        blackKnight.src = "images/black_knight.png";
        blackKnight.onload = () => {
            context.drawImage(blackKnight, this.fieldSize, 0, this.fieldSize, this.fieldSize)
            context.drawImage(blackKnight, this.fieldSize * 6, 0, this.fieldSize, this.fieldSize)
        }

        const blackBishop = new Image();
        blackBishop.src = "images/black_bishop.png";
        blackBishop.onload = () => {
            context.drawImage(blackBishop, this.fieldSize * 2, 0, this.fieldSize, this.fieldSize)
            context.drawImage(blackBishop, this.fieldSize * 5, 0, this.fieldSize, this.fieldSize)
        }

        const blackQueen = new Image();
        blackQueen.src = "images/black_queen.png";
        blackQueen.onload = () => {
            context.drawImage(blackQueen, this.fieldSize * 3, 0, this.fieldSize, this.fieldSize)
        }

        const blackKing = new Image();
        blackKing.src = "images/black_king.png";
        blackKing.onload = () => {
            context.drawImage(blackKing, this.fieldSize * 4, 0, this.fieldSize, this.fieldSize)
        }

        const blackPawn = new Image();
        blackPawn.src = "images/black_pawn.png";
        blackPawn.onload = () => {
            context.drawImage(blackPawn, 0, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 2, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 3, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 4, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 5, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 6, this.fieldSize, this.fieldSize, this.fieldSize)
            context.drawImage(blackPawn, this.fieldSize * 7, this.fieldSize, this.fieldSize, this.fieldSize)
        }
    }
}