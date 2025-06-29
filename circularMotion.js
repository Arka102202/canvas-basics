"use strict";

import Circle from "./circle.js";
import Line from "./Line.js";
import { getRandomInt } from "./utils.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    const ctx = canvasEl.getContext("2d");
    let canvas = setNStoreCanvasSize(canvasEl, ctx);

    let center = { x: canvas.width / 2, y: canvas.height / 2 };
    let targetCenter = { ...center };

    let particles = [];

    let isDrawing = false;

    const init = (particles) => {
        let numOfParticles = 10;
        const resolution = 100;
        let alpha = 0;
        for (let j = 0; j < numOfParticles; j++) {
            const particle = [];
            particles.push(particle);
            const radius = getRandomInt(100, 300);
            let theta = getRandomInt(0, 360);
            const velocity = 1.5;
            const width = getRandomInt(1, 5);
            // const width = 10;
            const clr = getRandomHexColor();
            for (let i = 0; i < resolution; i++) {
                theta += .5;
                const eachPart = new Line(width, clr, (alpha + i) / resolution, radius, center, theta, velocity);
                eachPart.draw(ctx);
                particle.push(eachPart);
            }
        }
    }

    init(particles);

    window.addEventListener("resize", () => {
        canvas = setNStoreCanvasSize(canvasEl);

        particles = [];

        init(particles);
    });

    const animate = () => {
        requestAnimationFrame(animate);
        const lerp = 0.05;
        center.x += (targetCenter.x - center.x) * lerp;
        center.y += (targetCenter.y - center.y) * lerp;

        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Adjust alpha for trail length
ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.forEach(el => {
                if (isDrawing) el.center = { ...center };
                el.draw(ctx);
            });
        });


    }

    animate();




    canvasEl.addEventListener("mousedown", (e) => {
        isDrawing = true;
    });

    canvasEl.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    canvasEl.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        targetCenter = { x: e.offsetX, y: e.offsetY };

    });

})

const setNStoreCanvasSize = (canvasEl, ctx) => {
    const canvasStyle = window.getComputedStyle(canvasEl);

    const marginLeft = parseInt(canvasStyle.marginLeft, 10);
    const marginRight = parseInt(canvasStyle.marginRight, 10);
    const marginTop = parseInt(canvasStyle.marginTop, 10);
    const marginBottom = parseInt(canvasStyle.marginBottom, 10);
    const borderLeft = parseInt(canvasStyle.borderLeftWidth, 10);
    const borderRight = parseInt(canvasStyle.borderRightWidth, 10);
    const borderTop = parseInt(canvasStyle.borderTopWidth, 10);
    const borderBottom = parseInt(canvasStyle.borderBottomWidth, 10);

    // Logical width & height (CSS pixels)
    const cssWidth = window.innerWidth - marginLeft - marginRight - borderLeft - borderRight;
    const cssHeight = window.innerHeight - marginTop - marginBottom - borderTop - borderBottom;

    // Set the CSS display size
    canvasEl.style.width = `${cssWidth}px`;
    canvasEl.style.height = `${cssHeight}px`;

    // Set the actual canvas resolution using devicePixelRatio
    const scale = window.devicePixelRatio || 1;
    canvasEl.width = cssWidth * scale;
    canvasEl.height = cssHeight * scale;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

    // Scale the context to account for the higher resolution
    ctx.scale(scale, scale);

    return {
        width: cssWidth,
        height: cssHeight,
        scale
    };
};

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
