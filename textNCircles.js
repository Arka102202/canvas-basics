"use strict";

import Alpha_A from "./alpha-A.js";
import CircleInsideText from "./CircleInsideText.js";
import { getRandomInt, getRandomIntExcludingRange } from "./utils.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    const ctx = canvasEl.getContext("2d");
    let canvas = setNStoreCanvasSize(canvasEl, ctx);

    const alphaSize = { width: 200, height: 300 };

    const alphaA = new Alpha_A({ x: canvas.width / 2 - alphaSize.width / 2, y: canvas.height / 2 - alphaSize.height / 2 }, { width: 200, height: 300 });

    const particles = [];
    const pathTypes = ["arc"];
    let t = 0;

    const numOfParticles = 25000;

    for (let i = 0; i < numOfParticles; i++) {
        const x = getRandomInt(alphaA.x1, alphaA.x2);
        const y = getRandomInt(alphaA.y1, alphaA.y2);

        const sx = getRandomInt(0, canvas.width);
        const sy = getRandomInt(0, canvas.height);

        const radius = getRandomInt(1, 2);
        const pathType = pathTypes[getRandomInt(0, pathTypes.length)];

        if (alphaA.isInside({ x, y }, radius)) {
            const particle = new CircleInsideText({ x: sx, y: sy }, { x, y }, radius, { x: 0, y: 0 }, pathType, "#123456");
            particle.draw(ctx);
            particles.push(particle);
        }
    }


    window.addEventListener("resize", () => {
        canvas = setNStoreCanvasSize(canvasEl);
    });

    let frameCount = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Speed-up toward the end
        t += t * .01 || .001;

        if (t > 1) t = 1;

        // Update position based on path type
        particles.forEach((particle) => {
            if (
                particle.current.x + particle.radius < 0 ||
                particle.current.x - particle.radius > canvas.width ||
                particle.current.y + particle.radius < 0 ||
                particle.current.y - particle.radius > canvas.height
            ) return;


            if (particle.pathType === 'straight') particle.updatePositionStraight(t);
            else if (particle.pathType === 'arc') particle.updatePositionArc(t);
            else if (particle.pathType === 'bezier') particle.updatePositionBezier(t);
            else if (particle.pathType === 'spiral') particle.updatePositionSpiral(t);

            particle.draw(ctx);
        })

        if (t < 1) {
            frameCount++;
            if (frameCount % 2 === 0) requestAnimationFrame(animate); // Draw every 2nd frame (30fps)
            else setTimeout(animate, 0); // prevent idle time
        } else animateOnSplash();


        console.log("animate");
    }

    animate();


    // ==== Mouse Tracking ====
    let lastMouse = { x: 0, y: 0 };

    canvasEl.addEventListener("mousemove", (e) => {
        const moveDir = {
            x: e.offsetX - lastMouse.x,
            y: e.offsetY - lastMouse.y
        };
        const speed = Math.hypot(moveDir.x, moveDir.y);
        lastMouse.x = e.offsetX;
        lastMouse.y = e.offsetY;

        for (let i = 0; i < particles.length; i++) {
            particles[i].applyForceBurst(e.offsetX, e.offsetY, speed, moveDir);
        }
    });

    // ==== Animation Loop ====
    function animateOnSplash() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.updateOnSplash();
            p.draw(ctx);
        }
        requestAnimationFrame(animateOnSplash);
    }

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

