import {canvas, ctx} from "./main.js";

export class Meteor{
    constructor(x, y) {
        this.image = new Image();
        this.image.src = "./images/asteroids/meteor.png";
        this.speed = 0.2;
        this.size = {x: 40, y: 40}
        this.pos = {
            x: x,
            y: y,
        }
        this.velocity = 0.2;

    }

    fall(deltatime, timeMultiplier)
    {
        let x = this.speed;
        let y = this.velocity;

        this.pos.x -= ((x * deltatime) * timeMultiplier);
        this.pos.y += ((y * deltatime) * timeMultiplier);
    }

    draw()
    {
        ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}