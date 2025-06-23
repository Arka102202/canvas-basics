"use strict";

export default function Circle(position = { x: 0, y: 0 }, radius = 0, velocity = { x: 1, y: 1 }, clr = "#123456", strokeClr = "#12345600") {
    this.position = position;
    this.radius = radius;
    this.initialRadius = radius;
    this.velocity = velocity;
    this.clr = clr;
    this.initialClr = clr;
    this.strokeClr = strokeClr;
}

Circle.prototype.draw = function (ctx) {

    ctx.save();

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.clr;
    ctx.fill();

    ctx.strokeStyle = this.strokeClr;
    ctx.stroke();

    ctx.closePath();

    ctx.restore();

}

Circle.prototype.update = function (ctx, canvas) {


    // clearing the canvas
    ctx.clearRect(canvas.x, canvas.y, canvas.width, canvas.height);

    // check for any changes

    this.updateX(canvas);
    this.updateY(canvas);


    this.draw(ctx);
}

Circle.prototype.updateX = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.x + this.velocity.x;

    if (nextPosition + this.radius >= canvas.right || nextPosition - this.radius <= canvas.left) {
        this.velocity.x = -this.velocity.x;

        return;
    }

    this.position.x = nextPosition;
}


Circle.prototype.updateY = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.y + this.velocity.y;

    if (nextPosition + this.radius >= canvas.bottom || nextPosition - this.radius <= canvas.top) {
        this.velocity.y = -this.velocity.y;

        return;
    }

    this.position.y = nextPosition;
}

