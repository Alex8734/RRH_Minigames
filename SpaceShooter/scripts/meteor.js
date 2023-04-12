import {canvas, ctx} from "./main.js";

export class Meteor{
    constructor(x, y) {
        this.image = new Image();
        this.image.src = "./images/asteroids/meteor.png";
        this.speed = 0.2;
        this.size = {x: 50, y: 50}
        this.pos = {
            x: x,
            y: y,
        }
        this.velocity = 0.2;

    }

    fall(deltatime)
    {
        let x = this.speed;
        let y = this.velocity;

        this.pos.x -= (x * deltatime);
        this.pos.y += (y * deltatime);
    }

    draw()
    {
        ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}