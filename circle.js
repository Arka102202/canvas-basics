"use strict";

export default function Circle(position = { x: 0, y: 0 }, radius = 0, velocity = { x: 1, y: 1 }, clr = "#123456", strokeClr = "#123456", print = false, canvas = { width: 0, height: 0 }) {


    if (position.x + radius > canvas.width || position.x - radius < 0 || position.y + radius > canvas.height || position.y - radius < 0) return null;


    this.position = position;
    this.radius = radius;
    this.initialRadius = radius;
    this.velocity = velocity;
    this.clr = clr;
    this.initialClr = clr;
    this.strokeClr = strokeClr;
    this.print = print;
}

Circle.prototype.draw = function (ctx) {
    ctx.save();
    ctx.beginPath();

    if (this.print)
        console.log(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    ctx.shadowColor = this.clr;
    ctx.shadowBlur = this.radius / 2;

    // ctx.globalAlpha = 1; // 50% transparent
    // ctx.fillStyle = this.clr;
    // ctx.fill();

    ctx.restore();

    if (this.strokeClr) {
        ctx.strokeStyle = this.strokeClr;
        ctx.stroke();
    }


};


Circle.prototype.update = function (ctx, canvas) {

    // check for any changes
    this.updateX(canvas);
    this.updateY(canvas);

    this.draw(ctx);
}

Circle.prototype.updateX = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.x + this.velocity.x;

    if (nextPosition + this.radius > canvas.width || nextPosition - this.radius < 0) {
        this.velocity.x = -this.velocity.x;

        return;
    }

    this.position.x = nextPosition;
}


Circle.prototype.updateY = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.y + this.velocity.y;

    if (nextPosition + this.radius > canvas.height || nextPosition - this.radius < 0) {
        this.velocity.y = -this.velocity.y;

        return;
    }

    this.position.y = nextPosition;
}

