import { canvas, ctx } from "./main.js";

export class SpaceShip {
    constructor() {
        this.image = new Image();
        this.image.src = "./images/ship.png";
        this.size = {x: canvas.width / 12.5, y: canvas.width / 12.5};
        this.pos = {
            x: canvas.width / 10,
            y: canvas.width / 2 - this.size.x,
        }
        this.speed = canvas.width / 2000;
    }

    draw(){
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.drawImage(this.image, 0, 0, this.size.x, this.size.y);
        ctx.restore();
    }

    moveUp(deltaTime) {
        this.pos.y -= (this.speed * deltaTime);
        if (this.pos.y < 0){
            this.pos.y = 0;
        }
    }

    moveDown(deltaTime) {
        this.pos.y += (this.speed * deltaTime);
        if (this.pos.y > (canvas.height - (this.size.y))) {
            this.pos.y = (canvas.height - (this.size.y));
        }
    }
}