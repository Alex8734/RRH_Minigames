import {canvas, ctx} from "./main.js";

export class Car {
    constructor(x, y) {
        this.image = new Image();
        this.image.src = "./images/car.png";
        this.speed = canvas.width / 2500;
        this.size = {x: canvas.width / 12.5, y: canvas.width / 12.5}
        this.pos = {
            x: x,
            y: y,
        }
        this.velocity = canvas.width / 2500;

    }

    drive(deltatime, speedMultiplier)
    {
        let x = this.speed;

        if (this.pos.y >= canvas.height / 1.99625)
        {
            console.log(((x * deltatime) - (speedMultiplier  * 30)));
            let speed = ((x * deltatime) - (speedMultiplier  * 30));
            this.pos.x += speed;
        }
        else
        {
            this.pos.x -= ((x * deltatime) * speedMultiplier);
        }
    }

    draw()
    {
        ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}