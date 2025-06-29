"use strict";

import { getRandomInt } from "./utils.js";

export default function CircleInsideText(start = { x: 0, y: 0 }, end = { x: 0, y: 0 }, radius = 0, velocity = { x: 1, y: 1 }, pathType = "straight", clr = "#123456", strokeClr = "#123456") {


    this.start = { ...start };
    this.end = { ...end };
    this.origin = { ...end };
    this.radius = radius;
    this.initialRadius = radius;
    this.velocity = velocity;
    this.acceleration = { x: 0, y: 0 };
    this.active = false;
    this.maxDistance = 0;
    this.returning = false;
    this.clr = clr;
    this.initialClr = clr;
    this.strokeClr = strokeClr;
    this.print = print;
    this.mass = radius;
    this.pathType = pathType;
    this.current = { ...start };

    if (pathType === "bezier") {
        const verticalOffset = getRandomInt(-150, -50); // or any range
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        this.cp = {
            x: midX + getRandomInt(-50, 50), // vary horizontally
            y: midY + verticalOffset         // vary vertically
        };
    }
}

CircleInsideText.prototype.draw = function (ctx) {
    ctx.save();
    ctx.beginPath();

    ctx.arc(this.current.x, this.current.y, this.radius, 0, Math.PI * 2);

    // ctx.globalAlpha = 1; // 50% transparent
    ctx.fillStyle = this.clr;
    ctx.fill();

    ctx.restore();

    if (this.strokeClr) {
        ctx.strokeStyle = this.strokeClr;
        ctx.stroke();
    }


};

CircleInsideText.prototype.applyForce = function (force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
    this.maxDistance = getRandomInt(300, 400); // control how far it goes
}

CircleInsideText.prototype.applyForceBurst = function (mouseX, mouseY, speed, moveDir) {
    const dx = this.origin.x - mouseX;
    const dy = this.origin.y - mouseY;
    const distance = Math.hypot(dx, dy);
    const burstRadius = 50;

    if (distance < burstRadius && !this.active && getRandomInt(1, 3) === 1) {
        this.active = true;
        this.returning = false;

        // Normalize mouse direction
        const mag = Math.hypot(moveDir.x, moveDir.y) || 1;
        let dirX = moveDir.x / mag;
        let dirY = moveDir.y / mag;

        // Add slight random angular variation (±10 degrees)
        const spread = (Math.random() - 0.5) * (Math.PI / 9); // ±10°
        const cos = Math.cos(spread);
        const sin = Math.sin(spread);
        const spreadX = dirX * cos - dirY * sin;
        const spreadY = dirX * sin + dirY * cos;

        // Strength based on speed, distance to cursor, and randomness
        const baseStrength = Math.min(speed * 0.3, 10);
        const falloff = 1 - distance / burstRadius;
        const randomness = Math.random() * 0.5;
        const strength = baseStrength * falloff + randomness;

        // Apply velocity in mouse direction with angular spread
        this.velocity.x = spreadX * strength;
        this.velocity.y = spreadY * strength;

        this.maxDistance = strength * 30 + getRandomInt(100, 200);
    }
};



CircleInsideText.prototype.updateOnSplash = function () {
    if (!this.active) return;

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.current.x += this.velocity.x;
    this.current.y += this.velocity.y;

    const dx = this.current.x - this.origin.x;
    const dy = this.current.y - this.origin.y;
    const dist = Math.hypot(dx, dy);


    // Check if max distance is reached
    if (!this.returning && dist >= this.maxDistance) {
        this.returning = true;
        this.velocity.x = -this.velocity.x;
        this.velocity.y = -this.velocity.y;
    }

    // Linear return to origin
    if (this.returning) {
        const step = Math.hypot(this.velocity.x, this.velocity.y);
        if (dist <= step || (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)) {
            this.current.x = this.origin.x;
            this.current.y = this.origin.y;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.active = false;
            this.returning = false;
        }
    }

    this.acceleration.x = 0;
    this.acceleration.y = 0;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function easeInOutExp(t) {
    return t < 0.5
        ? (Math.pow(2, 20 * t - 10)) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

// Path Functions
CircleInsideText.prototype.updatePositionStraight = function (t) {
    const easedT = easeInOutExp(t); // or use easeInQuad(t) for clarity

    this.current.x = lerp(this.start.x, this.end.x, easedT);
    this.current.y = lerp(this.start.y, this.end.y, easedT);
}

CircleInsideText.prototype.updatePositionArc = function (t) {
    // Compute once per particle — could also precompute and store
    const center = {
        x: (this.start.x + this.end.x) / 2,
        y: (this.start.y + this.end.y) / 2 + this.arcOffset * 100 // offset curve center vertically
    };

    const radius = Math.hypot(this.start.x - center.x, this.start.y - center.y);

    const angleStart = Math.atan2(this.start.y - center.y, this.start.x - center.x);
    const angleEnd = Math.atan2(this.end.y - center.y, this.end.x - center.x);

    // Interpolate based on direction
    let deltaAngle = angleEnd - angleStart;

    // Normalize delta angle to be shortest path
    if (this.arcDirection === -1 && deltaAngle > 0) {
        deltaAngle -= 2 * Math.PI;
    } else if (this.arcDirection === 1 && deltaAngle < 0) {
        deltaAngle += 2 * Math.PI;
    }

    const angle = angleStart + deltaAngle * t;

    this.current.x = center.x + radius * Math.cos(angle);
    this.current.y = center.y + radius * Math.sin(angle);
};


CircleInsideText.prototype.updatePositionBezier = function (t) {
    const cp = this.cp;

    const x =
        (1 - t) * (1 - t) * this.start.x +
        2 * (1 - t) * t * cp.x +
        t * t * this.end.x;

    const y =
        (1 - t) * (1 - t) * this.start.y +
        2 * (1 - t) * t * cp.y +
        t * t * this.end.y;

    this.current.x = x;
    this.current.y = y;
};

CircleInsideText.prototype.updatePositionSpiral = function (t) {
    const angle = t * 4 * Math.PI;
    const r = (1 - t) * 100;
    this.current.x = lerp(this.start.x, this.end.x, t) + r * Math.cos(angle);
    this.current.y = lerp(this.start.y, this.end.y, t) + r * Math.sin(angle);
}


CircleInsideText.prototype.update = function (ctx, canvas) {

    // check for any changes
    this.updateX(canvas);
    this.updateY(canvas);

    this.draw(ctx);
}

CircleInsideText.prototype.updateX = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.x + this.velocity.x;

    if (nextPosition + this.radius > canvas.width || nextPosition - this.radius < 0) {
        this.velocity.x = -this.velocity.x;

        return;
    }

    this.position.x = nextPosition;
}


CircleInsideText.prototype.updateY = function (canvas = { width: 1, height: 1 }) {

    const nextPosition = this.position.y + this.velocity.y;

    if (nextPosition + this.radius > canvas.height || nextPosition - this.radius < 0) {
        this.velocity.y = -this.velocity.y;

        return;
    }

    this.position.y = nextPosition;
}


CircleInsideText.getVelocitiesAfterCollision = (c1, c2) => {
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

CircleInsideText.correctOverlap = (c1, c2, distance, dx, dy, canvas = { width: 0, height: 0 }) => {
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

CircleInsideText.getDistance = (c1Pos, c2Pos) => {
    const dx = c1Pos.x - c2Pos.x;
    const dy = c1Pos.y - c2Pos.y;
    return { distance: Math.hypot(dx, dy), dx, dy };
}


CircleInsideText.generateCircle = (canvas = { width: 0, height: 0 }, circles = [], fillClr = "#12345600", strokeClr = "#123456") => {
    const radius = getRandomInt(20, 20);
    const randX = getRandomInt(radius, canvas.width - radius);
    const randY = getRandomInt(radius, canvas.height - radius);
    let isOverlapping = false;

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = CircleInsideText.getDistance(circle.position, { x: randX, y: randY })
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