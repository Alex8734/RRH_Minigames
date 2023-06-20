import {HttpClient} from "../../Script/ServerClient.js";
import {game, ctx, canvas} from "./main.js";

export class Game {
    constructor(size, whiteName, blackName, me, id) {
        this.client = new HttpClient();
        this.size = 560;
        this.fieldSize = 70;
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
        this.activeField = new Field(null, null);
        this.dots = [];
        this.currentPlayer = "white";
        this.myclr = me;
        this.myName = this.myclr === "white" ? `${whiteName}` : `${blackName}`;
        this.opponentName = this.myclr === "white" ? `${blackName}` : `${whiteName}`;
        this.check = false;
        this.gid = id;
        this.moveDone = "";
        this.lastMoveDone = "";
        this.gameOver = "";
        this.body = document.getElementById("bdy");
    }

    init() {
        //let players = this.client.getPlayers();

        this.redraw();

        let myName = document.getElementById("thisName");
        let oppName = document.getElementById("enemyName");

        myName.innerHTML = this.myName;
        oppName.innerHTML = this.opponentName;
    }

    async gameLoop() {
        while (true) {
            // wait for a move from the server
            let move = (await this.client.getLastMove(this.gid)).value;
            if (move !== "" && this.lastMoveDone !== move) {
                console.log("got a move", move);
                move = Move.stringToMove(move);
                let piece = this.pieces.find(p => p.x === move.startX && p.y === move.startY);
                piece.move(move.endX, move.endY, false);
                this.redraw();
            }
            console.log(move)
            if (this.gameOver !== "") {
                break;
            }
            
            while (this.moveDone === "" && this.currentPlayer === this.myclr && this.gameOver === "") {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (this.moveDone !== ""){
                console.log("lol move done", this.moveDone);
                // post the user's move to the server
                await this.client.postLastMove(this.gid, this.moveDone);


                if (this.gameOver !== "")
                {
                    break;
                }

                // reset moveDone
                this.moveDone = "";
            }
            
        }

        if ((this.myclr  === "black" && this.gameOver === "black") || (this.myclr === "white" && this.gameOver === "white")) {
            //win
            await this.client.EndGame(this.gid, this.myName, (e) => alert(e.value))
            this.body.style.backgroundColor = "green";
            alert("you won!");
            return;

        }

        else if ((this.myclr  === "black" && this.gameOver === "white") || (this.myclr === "white" && this.gameOver === "black")) {
            //lose
            await this.client.EndGame(this.gid, this.opponentName, (e) => alert(e.value))
            this.body.style.backgroundColor = "red";
            alert("you lost!");
            return;
        }
    }

    redraw() {
        this.drawBoard(this.myclr);
        this.drawPieces(this.myclr);
        this.drawDots(this.myclr);
    }

    drawBoard(clr) {
        if (clr === "white") {
            let isWhite = true;

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (isWhite) {
                        ctx.fillStyle = "#ffce99";
                    } else {
                        ctx.fillStyle = "#994f00";
                    }

                    if (row === this.activeField.x && col === this.activeField.y) {
                        ctx.fillStyle = "#bea9df";
                    }
                    ctx.fillRect(row * this.fieldSize, col * this.fieldSize, this.fieldSize, this.fieldSize);
                    isWhite = !isWhite;
                }
                isWhite = !isWhite;
            }
        }
        else {
            let isWhite = true;

            for (let row = 7; row >= 0; row--) {
                for (let col = 7; col >= 0; col--) {
                    if (isWhite) {
                        ctx.fillStyle = "#ffce99";
                    } else {
                        ctx.fillStyle = "#994f00";
                    }

                    if (7-row === this.activeField.x && 7-col === this.activeField.y) {
                        ctx.fillStyle = "#bea9df";
                    }

                    ctx.fillRect(row * this.fieldSize, col * this.fieldSize, this.fieldSize, this.fieldSize);
                    isWhite = !isWhite;
                }
                isWhite = !isWhite;
            }
        }

    }

    drawPieces(clr) {
        if (clr === "white") {
            for (let piece of this.pieces) {
                let img = new Image();
                img.src = `./images/${piece.clr}_${piece.name}.png`;
                img.onload = function() {
                    ctx.drawImage(img, piece.x * 70, piece.y * 70, 70, 70);
                };
                img.onerror = function() {
                    console.log("Failed to load image.");
                };
            }
        }
        else {
            for (let piece of this.pieces) {
                let img = new Image();
                img.src = `./images/${piece.clr}_${piece.name}.png`;
                img.onload = function() {
                    ctx.drawImage(img, 490 - piece.x * 70, 490 - piece.y * 70, 70, 70);
                };
                img.onerror = function() {
                    console.log("Failed to load image.");
                };
            }
        }
    }

    drawDots(clr) {
        for (let dot of this.dots) {
            let img = new Image();
            img.src = "./images/dot.png";
            if (this.myclr === "white") {
                img.onload = function() {
                    ctx.drawImage(img, dot.x * 70, dot.y * 70, 70, 70);
                };
            }
            else {
                img.onload = function() {
                    ctx.drawImage(img, 490 - dot.x * 70, 490 - dot.y * 70, 70, 70);
                };
            }
            img.onerror = function() {
                console.log("Failed to load dot.");
            }
        }
    }

    clickOn(col, row) {
        this.activeField = new Field(col, row);
        for (let dot of this.dots) {
            if (dot.x === col && dot.y === row) {
                this.activePiece.move(col, row,true);
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
                if (piece.clr === this.myclr) {
                    for (let i = 0; i < moves.length; i++) {
                        this.dots.push(new Dot(moves[i].endX, moves[i].endY));
                    }
                }

                this.redraw();
                return;
            }
        }

        this.dots = [];
        this.redraw();
    }

    makeMove(move) {
        let piece = this.pieces.find(piece => piece.x === move.startX && piece.y === move.startY);

        // Only allow the current player to make a move
        if (piece.clr !== this.currentPlayer) {
            return;
        }

        // Move the piece
        piece.move(move.startX, move.startY);

        // Switch the current player
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    }

    copy() {
        let newGame = new Game(560);
        newGame.size = this.size;
        newGame.fieldSize = this.fieldSize;
        newGame.pieces = this.pieces
        newGame.activePiece = this.activePiece;
        newGame.activeField = this.activeField;
        newGame.dots = this.dots;
        newGame.currentPlayer = this.currentPlayer;
        newGame.white = this.white;
        newGame.black = this.black;
        newGame.moves = this.moves;
        newGame.check = this.check;

        return newGame;
    }

    isCheckmate() {
        let currentPlayer = game.currentPlayer;
        let opponentPlayer = currentPlayer === "white" ? "black" : "white";
        let currentPlayerKing = game.pieces.find(piece => piece.name === "king" && piece.clr === currentPlayer);

        // Check if the king is in check
        let isInCheck = game.pieces.some(piece => piece.clr === opponentPlayer
            && piece.calcMoves().some(move => move.endX === currentPlayerKing.x && move.endY === currentPlayerKing.y));

        if (!isInCheck) {
            return false;
        }

        // Generate all possible moves for the current player
        let allMoves = [];
        for (let piece of game.pieces) {
            if (piece.clr === currentPlayer) {
                allMoves.push(...piece.calcMoves());
            }
        }

        // Check if any move gets the king out of check
        for (let move of allMoves) {
            let tempGame = game.copy();
            tempGame.makeMove(move);
            let tempCurrentPlayerKing = tempGame.pieces.find(piece => piece.name === "king" && piece.clr === currentPlayer);
            let tempIsInCheck = tempGame.pieces.some(piece => piece.clr === opponentPlayer
                && piece.calcMoves().some(move => move.endX === tempCurrentPlayerKing.x && move.endY === tempCurrentPlayerKing.y));

            if (!tempIsInCheck) {
                return false;
            }
        }

        return true;
    }
}

export class Piece {
    constructor(name, x, y, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.clr = color;
    }

    move(col, row, fromMe) {

        // Only allow the current player to make a move
        if (this.clr !== game.currentPlayer) {
            return;
        }

        for (let piece of game.pieces) {
            if (piece.x === col && piece.y === row) {
                if (piece.clr === "white" && piece.name === "king") {
                    game.gameOver = "black";
                }
                if (piece.clr === "black" && piece.name === "king") {
                    game.gameOver = "white";
                }
                console.log(piece, "was taken rn (funnymoment)");
                const index = game.pieces.indexOf(piece);
                if (index > -1) {
                    game.pieces.splice(index, 1);
                }
                game.redraw();
            }
        }
        if (fromMe)
        {
            game.moveDone = new Move(this.x, this.y, col, row).toString();
            game.lastMoveDone = new Move(this.x, this.y, col, row).toString();
        }
        this.x = col;
        this.y = row;

        game.moves++;

        let lastRow = this.clr === "white" ? 0 : 7;

        if (this.name === "pawn" && this.y === lastRow) {
            this.name = "queen";
        }

        // Switch the current player
        game.currentPlayer = game.currentPlayer === "white" ? "black" : "white";

        
    }

    clickMe() {
        return this.calcMoves();
    }

    calcMoves(check4check = true) {
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
                return this.calcMovesKing(check4check);
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
            if (newRow < 0 || newRow > 7) { continue; }
            if (i === 2 && this.y !== startRow) { continue; }

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
                    if (!this.calcMoveBlocked(this.x, i, this.y, j)) {
                        let move = new Move(this.x, this.y, i, j);
                        moves.push(move);
                    }
                }
            }
        }

        return moves;
    }

    calcMovesKnight() {
        console.log("met")
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
                    let move = new Move(this.x, this.y, i, j);
                    moves.push(move);
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
                            let move = new Move(this.x, this.y, i, j);
                            moves.push(move);
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
                        let move = new Move(this.x, this.y, i, j);
                        moves.push(move);
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
                            let move = new Move(this.x, this.y, i, j);
                            moves.push(move);
                        }
                    }
                }
            }
        }

        return moves;
    }

    calcMovesKing(check4check = true) {
        let moves = [];
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

                    if (check4check) {
                        // Check if the move would put the king in check
                        let move = new Move(this.x, this.y, i, j);
                        let inCheck = false;
                        for (let piece of game.pieces) {
                            if (piece.clr !== this.clr) {
                                let enemyMoves = [];
                                if(piece.name !== "king") {
                                    enemyMoves = piece.calcMoves(false);
                                }
                                for (let enemyMove of enemyMoves) {
                                    if (enemyMove.endX === i && enemyMove.endY === j) {
                                        inCheck = true;
                                        console.log(enemyMove);
                                        break;
                                    }
                                }
                                if (inCheck) break;
                            }
                        }
                        if (!inCheck) {
                            moves.push(move);
                        }
                    }
                    else {
                        moves.push(new Move(this.x, this.y, i, j))
                    }
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
                let move = new Move(this.x, this.y, i, j);
                moves.push(move);
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

    toString() {
        return `${this.startX}${this.startY}-${this.endX}${this.endY}`;
    }

    static stringToMove(string) {
        let move = new Move()
        move.startX = parseInt(string[0]);
        move.startY = parseInt(string[1]);
        move.endX = parseInt(string[3]);
        move.endY = parseInt(string[4]);

        return move;
    }
}

export class Field {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}