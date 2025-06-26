"use strict";

import Circle from "./circle.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    let canvas = setNStoreCanvasSize(canvasEl);

    const ctx = canvasEl.getContext("2d");

    let circles = [];

    const generateCircle = () => {
        const radius = getRandomInt(10, 30);
        const randX = getRandomInt(radius, canvas.width - radius);
        const randY = getRandomInt(radius, canvas.height - radius);

        const randVelX = getRandomInt(-5, 5);
        const randVelY = getRandomInt(-5, 5);

        return new Circle({ x: randX, y: randY }, radius, { x: randVelX, y: randVelY }, "#12345600", "#123456", false, canvas);
    }

    const init = (circles) => {
        for (let i = 0; i < 100; i++) {
            const circle = generateCircle();
            if (Object.keys(circle).length !== 0) {
                circles.push(circle);
                circle.draw(ctx)
                console.log(circle)
            }
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
        // const steps = Math.ceil(distance / 2); // 2px spacing between circles

        // for (let i = 0; i < steps; i++) {
        //     const t = i / steps;
        //     const x = lastPos.x + dx * t;
        //     const y = lastPos.y + dy * t;

        //     const circle = new Circle({ x, y }, 5, { x: 0, y: 0 });
        //     circles.push(circle);
        //     circles.forEach(circle => circle.draw(ctx));
        // }

        const circle = new Circle({ ...currentPos }, getRandomInt(20, 25), { x: Math.abs(dx) ? (-dx / Math.abs(dx)) * getRandomInt(1, 4) : 0, y: Math.abs(dy) ? (-dy / Math.abs(dy)) * getRandomInt(1, 4) : 0 }, "#12345600", "#123456", false, canvas);
        if (Object.keys(circle).length !== 0) {
            circles.push(circle);

            console.log(circle)
            circle.draw(ctx);

        }
        // circles.forEach(circle => circle.draw(ctx));


        lastPos = currentPos;
    });


    // circles.forEach(circle => circle.draw(ctx));

    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            // circle.radius -= .5;
            // if (circle.radius >= 2) circle.update(ctx, canvas);

            circle.update(ctx, canvas);
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