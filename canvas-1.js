"use strict";

import Circle from "./circle.js";
import { getRandomInt } from "./utils.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    let canvas = setNStoreCanvasSize(canvasEl);

    const ctx = canvasEl.getContext("2d");

    let circles = [];

    const init = (circles) => {
        let numOfCircles = 50;
        for (let i = 0; i < numOfCircles; i++) {
            const circle = Circle.generateCircle(canvas, circles);
            if (Object.keys(circle).length !== 0) {
                circles.push(circle);
                circle.draw(ctx)
            } else numOfCircles += 1;

            console.log(numOfCircles);
        }
    }

    init(circles);

    window.addEventListener("resize", () => {
        canvas = setNStoreCanvasSize(canvasEl);

        circles = [];

        init(circles);
    });

    let isDrawing = false;
    let lastPos = null;

    canvasEl.addEventListener("mousedown", (e) => {
        isDrawing = true;
        lastPos = { x: e.offsetX, y: e.offsetY };
    });

    canvasEl.addEventListener("mouseup", () => {
        isDrawing = false;
        lastPos = null;
    });

    canvasEl.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const currentPos = { x: e.offsetX, y: e.offsetY };

        // // Distance between last and current
        const dx = currentPos.x - lastPos.x;
        const dy = currentPos.y - lastPos.y;
        const distance = Math.hypot(dx, dy);

        if (dy !== 0 || dx !== 0) {
            const circle = new Circle({ ...currentPos }, getRandomInt(20, 25), { x: Math.abs(dx) ? (-dx / Math.abs(dx)) * getRandomInt(1, 4) : 0, y: Math.abs(dy) ? (-dy / Math.abs(dy)) * getRandomInt(1, 4) : 0 }, "#12345600", "#123456", false, canvas);
            if (Object.keys(circle).length !== 0) {
                circles.push(circle);
                circle.draw(ctx);
            }
        }

        lastPos = currentPos;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                const c1 = circles[i];
                const c2 = circles[j];
                const { distance, dx, dy } = Circle.getDistance(c1.position, c2.position);
                if (distance <= c1.radius + c2.radius) {

                    Circle.getVelocitiesAfterCollision(c1, c2);
                    Circle.correctOverlap(c1, c2, distance, dx, dy, canvas);
                    if (c1.radius === c2.radius || c1.radius > c2.radius) {
                        if (c1.position.x + c1.radius < canvas.width - 1 &&
                            c1.position.x - c1.radius > 1 &&
                            c1.position.y + c1.radius < canvas.height - 1 &&
                            c1.position.y - c1.radius > 1 &&
                            c1.radius <= Math.min(canvas.width, canvas.height) / 2)
                            c1.mass = c1.radius += 1;
                        c2.mass = c2.radius -= 1;
                    } else {
                        if (c2.position.x + c2.radius < canvas.width - 1 &&
                            c2.position.x - c2.radius > 1 &&
                            c2.position.y + c2.radius < canvas.height - 1 &&
                            c2.position.y - c2.radius > 1 &&
                            c2.radius <= Math.min(canvas.width, canvas.height) / 2)
                            c2.mass = c2.radius += 1;
                        c1.mass = c1.radius -= 1;
                    }
                }
            }
        }

        circles = circles.filter(circle => circle.radius > 0);
        // Update all circles separately after resolving all collisions
        circles.forEach(circle => {
            circle.update(ctx, canvas);
        });


    }

    animate();

})


const setNStoreCanvasSize = (canvasEl) => {
    const canvasStyle = window.getComputedStyle(canvasEl);
    const marginLeft = parseInt(canvasStyle.marginLeft, 10);
    const marginRight = parseInt(canvasStyle.marginRight, 10);
    const marginTop = parseInt(canvasStyle.marginTop, 10);
    const marginBottom = parseInt(canvasStyle.marginBottom, 10);
    const borderLeft = parseInt(canvasStyle.borderLeftWidth, 10);
    const borderRight = parseInt(canvasStyle.borderRightWidth, 10);
    const borderTop = parseInt(canvasStyle.borderTopWidth, 10);
    const borderBottom = parseInt(canvasStyle.borderBottomWidth, 10);

    canvasEl.width = window.innerWidth - marginLeft - marginRight - borderLeft - borderRight;
    canvasEl.height = window.innerHeight - marginTop - marginBottom - borderTop - borderBottom;

    return {
        width: canvasEl.width,
        height: canvasEl.height
    };
}
