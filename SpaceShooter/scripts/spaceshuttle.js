import { canvas, ctx } from "./main.js";

export class SpaceShip {
    constructor() {
        this.image = new Image();
        this.image.src = "./images/shuttle.png";
        this.size = {x: 40, y: 40};
        this.pos = {
            x: 50,
            y: 50,
        }
        this.speed = 1;
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
        if (this.pos.y < (canvas.height - this.size.y - 1)) {
            this.pos.y += (this.speed * deltaTime);
        }
    }
}