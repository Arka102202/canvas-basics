"use strict";

import { getRandomInt } from "./utils.js";

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
    this.mass = radius;
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


Circle.getVelocitiesAfterCollision = (c1, c2) => {
    const dx = c2.position.x - c1.position.x;
    const dy = c2.position.y - c1.position.y;
    const distance = Math.hypot(dx, dy);

    // Normal vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Tangent vector
    const tx = -ny;
    const ty = nx;

    // Dot product tangent
    const uTan1 = c1.velocity.x * tx + c1.velocity.y * ty;
    const uTan2 = c2.velocity.x * tx + c2.velocity.y * ty;

    // Dot product normal
    const uNorm1 = c1.velocity.x * nx + c1.velocity.y * ny;
    const uNorm2 = c2.velocity.x * nx + c2.velocity.y * ny;

    // Assuming equal mass and perfectly elastic collision (e = 1)
    const m1 = c1.mass, m2 = c2.mass;
    const e = 1;

    const vNorm1 = (uNorm1 * (m1 - e * m2) + (1 + e) * m2 * uNorm2) / (m1 + m2);
    const vNorm2 = (uNorm2 * (m2 - e * m1) + (1 + e) * m1 * uNorm1) / (m1 + m2);

    // Final velocities
    c1.velocity.x = tx * uTan1 + nx * vNorm1;
    c1.velocity.y = ty * uTan1 + ny * vNorm1;
    c2.velocity.x = tx * uTan2 + nx * vNorm2;
    c2.velocity.y = ty * uTan2 + ny * vNorm2;
};

Circle.correctOverlap = (c1, c2, distance, dx, dy, canvas = { width: 0, height: 0 }) => {
    const overlap = (c1.radius + c2.radius) - distance;

    // Push each circle away from the other by half the overlap
    const correctionX = (dx / distance) * (overlap / 2);
    const correctionY = (dy / distance) * (overlap / 2);
    const correctionXFull = (dx / distance) * (overlap);
    const correctionYFull = (dy / distance) * (overlap);

    c1.position.x += correctionX;
    c1.position.y += correctionY;
    c2.position.x -= correctionX;
    c2.position.y -= correctionY;


    if (c1.position.x + c1.radius > canvas.width || c1.position.x - c1.radius < 0 || c1.position.y + c1.radius > canvas.height || c1.position.y - c1.radius < 0) {
        if (c1.position.x + c1.radius > canvas.width) c1.position.x = canvas.width - c1.radius;
        if (c1.position.x - c1.radius < 0) c1.position.x = c1.radius;
        if (c1.position.y + c1.radius > canvas.height) c1.position.y = canvas.height - c1.radius;
        if (c1.position.y - c1.radius < 0) c1.position.y = c1.radius;
    }

    if (c2.position.x + c2.radius > canvas.width || c2.position.x - c2.radius < 0 || c2.position.y + c2.radius > canvas.height || c2.position.y - c2.radius < 0) {
        if (c2.position.x + c2.radius > canvas.width) c2.position.x = canvas.width - c2.radius;
        if (c2.position.x - c2.radius < 0) c2.position.x = c2.radius;
        if (c2.position.y + c2.radius > canvas.height) c2.position.y = canvas.height - c2.radius;
        if (c2.position.y - c2.radius < 0) c2.position.y = c2.radius;
    }

}

Circle.getDistance = (c1Pos, c2Pos) => {
    const dx = c1Pos.x - c2Pos.x;
    const dy = c1Pos.y - c2Pos.y;
    return { distance: Math.hypot(dx, dy), dx, dy };
}


Circle.generateCircle = (canvas = { width: 0, height: 0 }, circles = [], fillClr = "#12345600", strokeClr = "#123456") => {
    const radius = getRandomInt(20, 20);
    const randX = getRandomInt(radius, canvas.width - radius);
    const randY = getRandomInt(radius, canvas.height - radius);
    let isOverlapping = false;

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Circle.getDistance(circle.position, { x: randX, y: randY })
        if (distance < circle.radius + radius) {
            isOverlapping = true;
            break;
        }
    }

    if (isOverlapping) return {};

    const randVelX = getRandomInt(-5, 5);
    const randVelY = getRandomInt(-5, 5);

    return new Circle({ x: randX, y: randY }, radius, { x: randVelX, y: randVelY }, fillClr, strokeClr, false, canvas);
}