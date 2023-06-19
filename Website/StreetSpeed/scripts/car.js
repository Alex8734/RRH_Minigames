import {canvas, ctx} from "./main.js";

export class Car {
    constructor(x, y) {
        this.image = new Image();
        this.image.src = `./images/car${Math.floor((Math.random() * 4)) + 1}.png`;
        this.speed = canvas.width / 4000;
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
            let speed = ((x * deltatime) - (speedMultiplier  * 10));
            this.pos.x += speed;
        }
        else
        {
            this.pos.x -= ((x * deltatime) * speedMultiplier * 2);
        }
    }

    async draw() {
        if (this.pos.y < canvas.height / 1.99625) {
            ctx.save();
            ctx.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
            ctx.rotate(Math.PI);
            ctx.drawImage(this.image, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
            ctx.restore();
        } else {
            ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }
}