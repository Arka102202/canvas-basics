"use strict";

import Circle from "./circle.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    let canvas = setNStoreCanvasSize(canvasEl);

    window.addEventListener("resize", () => {
        canvas = setNStoreCanvasSize(canvasEl);
    });
    const ctx = canvasEl.getContext("2d", { willReadFrequently: true });

    const circles = [];

    const genCircle = (e, ctx) => {
        console.log({ x: e.offsetX, y: e.offsetY })
        const circle = new Circle({ x: e.offsetX, y: e.offsetY }, 2, { x: 0, y: 0 }, "#123456", "#12345600", true);

        circles.push(circle);

    }

    let isDrawing = false;
    let lastPos = null;

    // Utility function to check if a color is close to white
    function isWhite(r, g, b, threshold = 0) {
        return r >= threshold && g >= threshold && b >= threshold;
    }

    canvasEl.addEventListener("mousedown", (e) => {
        isDrawing = true;
        lastPos = { x: e.offsetX, y: e.offsetY };

        // Optional: draw an initial dot if needed
        const centerX = lastPos.x;
        const centerY = lastPos.y;
        const radius = 4;

        const startX = centerX - radius;
        const startY = centerY - radius;
        const diameter = radius * 2;

        const imageData = ctx.getImageData(startX, startY, diameter, diameter);
        const data = imageData.data;

        for (let j = 0; j < diameter; j++) {
            for (let i = 0; i < diameter; i++) {
                const dx = i - radius;
                const dy = j - radius;

                if (dx * dx + dy * dy <= radius * radius) {
                    const index = (j * diameter + i) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    if (isWhite(r, g, b)) {
                        data[index] = 18;
                        data[index + 1] = 52;
                        data[index + 2] = 86;
                        data[index + 3] = 128; // fully opaque
                    }
                }
            }
        }


        ctx.putImageData(imageData, startX, startY);
    });

    canvasEl.addEventListener("mouseup", () => {
        isDrawing = false;
        lastPos = null;
    });

    canvasEl.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const currentPos = { x: e.offsetX, y: e.offsetY };

        const dx = currentPos.x - lastPos.x;
        const dy = currentPos.y - lastPos.y;
        const distance = Math.hypot(dx, dy);
        const steps = Math.ceil(distance / 1); // 1px spacing between updates

        for (let s = 0; s < steps; s++) {
            const t = s / steps;
            const x = lastPos.x + dx * t;
            const y = lastPos.y + dy * t;

            const centerX = x;
            const centerY = y;
            const radius = 4;

            const startX = centerX - radius;
            const startY = centerY - radius;
            const diameter = radius * 2;

            const imageData = ctx.getImageData(startX, startY, diameter, diameter);
            const data = imageData.data;

            for (let j = 0; j < diameter; j++) {
                for (let i = 0; i < diameter; i++) {
                    const dx = i - radius;
                    const dy = j - radius;

                    if (dx * dx + dy * dy <= radius * radius) {
                        const index = (j * diameter + i) * 4;
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];

                        if (isWhite(r, g, b)) {
                            data[index] = 18;
                            data[index + 1] = 52;
                            data[index + 2] = 86;
                            data[index + 3] = 128; // fully opaque
                        }
                    }
                }
            }

            ctx.putImageData(imageData, startX, startY);
        }

        lastPos = currentPos;
    });


    // circles.forEach(circle => circle.draw(ctx));

    // const animate = () => {
    //     requestAnimationFrame(animate);
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     circles.forEach(circle => circle.update(ctx, canvas));
    // }

    // animate();

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
