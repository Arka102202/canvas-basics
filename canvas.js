"use strict";

import Circle from "./circle.js";

window.addEventListener("load", () => {

    const canvasEl = document.getElementById("my-canvas");

    canvasEl.width = window.innerWidth - (4 * window.innerWidth / 100) - 4;
    canvasEl.height = window.innerHeight - (4 * window.innerWidth / 100) - 4;

    let canvas = canvasEl.getBoundingClientRect();

    window.addEventListener("resize", () => {
        canvasEl.width = window.innerWidth - (4 * window.innerWidth / 100) - 4;
        canvasEl.height = window.innerHeight - (4 * window.innerWidth / 100) - 4;

        canvas = canvasEl.getBoundingClientRect();
    });
    const ctx = canvasEl.getContext("2d");

    const circle = new Circle({ x: 200, y: 200 }, 20, { x: 1, y: 2 });

    circle.draw(ctx);

    console.log(canvas);

    const animate = () => {
        requestAnimationFrame(animate);

        circle.update(ctx, canvas);
    }

    animate();

})
