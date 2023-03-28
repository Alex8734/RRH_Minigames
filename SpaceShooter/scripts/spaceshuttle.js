import { canvas, ctx } from "./main.js";

export class SpaceShip {
    constructor() {
        this.image = new Image();
        this.image.src = "./images/shuttle.png";
        this.size = {x: 25, y: 25};
        this.pos = {
            x: 50,
            y: 50,
        }
        this.speed = 1;
    }

    draw(){
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(Math.PI / 2.7); // or any other desired angle
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
        if (this.pos.y < 90) {
            this.pos.y += (this.speed * deltaTime);
        }
    }
}