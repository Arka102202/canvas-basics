"use strict";


export default function Line(width = 1, strokeClr = "#123456", alpha = 1, radius = 100, center = { x: 1, y: 1 }, theta = 0, velocity = 1) {

    this.width = width;
    this.strokeClr = strokeClr;
    this.startPos = {x:1, y:1};
    this.alpha = alpha;
    this.radius = radius;
    this.theta = theta;
    this.velocity = velocity;
    this.center = center;
}


Line.prototype.draw = function (ctx) {
    ctx.beginPath();

    ctx.moveTo(this.startPos.x, this.startPos.y);
    this.updateCircularly();
    ctx.lineTo(this.startPos.x, this.startPos.y);
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.strokeClr;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // ctx.filter = 'blur(1px)'; // or 'blur(2px)' for stronger glow

    ctx.stroke();

    ctx.restore();
}

Line.prototype.updateCircularly = function () {
    this.theta += this.velocity;
    const rad = this.theta * (Math.PI / 180);
    this.startPos.x = this.center.x + this.radius * Math.cos(rad);
    this.startPos.y = this.center.y + this.radius * Math.sin(rad);
}