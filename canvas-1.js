"use strict";

import Circle from "./circle.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    let canvas = setNStoreCanvasSize(canvasEl);

    window.addEventListener("resize", () => {
        canvas = setNStoreCanvasSize(canvasEl);
    });
    const ctx = canvasEl.getContext("2d");

    let circles = [];

    const genCircle = (e, ctx) => {
        console.log({ x: e.offsetX, y: e.offsetY })
        const circle = new Circle({ x: e.offsetX, y: e.offsetY }, 2, { x: 0, y: 0 }, "#123456", "#12345600", true);

        circles.push(circle);

    }

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
        // const steps = Math.ceil(distance / 2); // 2px spacing between circles

        // for (let i = 0; i < steps; i++) {
        //     const t = i / steps;
        //     const x = lastPos.x + dx * t;
        //     const y = lastPos.y + dy * t;

        //     const circle = new Circle({ x, y }, 5, { x: 0, y: 0 });
        //     circles.push(circle);
        //     circles.forEach(circle => circle.draw(ctx));
        // }

        const circle = new Circle({ ...currentPos }, getRandomInt(20,25), { x: (-dx/Math.abs(dx))*getRandomInt(1,4), y:  (-dy/Math.abs(dy))*getRandomInt(1,4) });
        circles.push(circle);
        circles.forEach(circle => circle.draw(ctx));

        lastPos = currentPos;
    });


    // circles.forEach(circle => circle.draw(ctx));

    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            circle.radius -= .5;
            if (circle.radius >= 2) circle.update(ctx, canvas);
        });


        circles = circles.filter(circle => circle.radius >= 2);
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


function getRandomInt(min, max) {
  min = Math.ceil(min);   // Round up to ensure we include the min properly
  max = Math.floor(max);  // Round down to ensure we include the max properly
  return Math.floor(Math.random() * (max - min + 1)) + min;
}