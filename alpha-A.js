"use strict";


export default function Alpha_A(tlCenter = { x: 1, y: 2 }, size = { width: 10, height: 10 }) {

    this.x1 = tlCenter.x;
    this.x2 = this.x1 + size.width;
    this.y1 = tlCenter.y;
    this.y2 = this.y1 + size.height;


    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;

    this.edges = [];

    // left side edge // 0
    this.edges.push({ 1: { x: (this.x1 + Math.round(dx / 4)), y: this.y1 }, 2: { x: this.x1, y: this.y2 }, condition: "r" });

    // right side edge // 1
    this.edges.push({ 1: { x: (this.x1 + 3 * Math.round(dx / 4)), y: this.y1 }, 2: { x: this.x2, y: this.y2 }, condition: "l" });

    // left inner edge // 2
    this.edges.push({ 1: { x: (this.x1 + Math.round(dx / 2)), y: this.y1 }, 2: { x: (this.x1 + Math.round(dx / 4)), y: this.y2 }, condition: "l" });

    // right inner edge // 3
    this.edges.push({ 1: { x: (this.x1 + Math.round(dx / 2)), y: this.y1 }, 2: { x: (this.x1 + 3 * Math.round(dx / 4)), y: this.y2 }, condition: "r" });

    this.bridge = { top: this.y1 + 2 * (Math.round(dy / 5)), btm: this.y1 + 3 * (Math.round(dy / 5)) }

}

Alpha_A.prototype.isInside = function (p = { x: 1, y: 1 }, r = 10) {


    if (p.x - r < this.x1 || p.x + r > this.x2 || p.y - r < this.y1 || p.y + r > this.y2)
        return false;

    if (isPointOnCorrectSide(this.edges[0][1], this.edges[0][2], p, this.edges[0].condition) &&
        isPointOnCorrectSide(this.edges[2][1], this.edges[2][2], p, this.edges[2].condition))
        return true;

    if (isPointOnCorrectSide(this.edges[1][1], this.edges[1][2], p, this.edges[1].condition) &&
        isPointOnCorrectSide(this.edges[3][1], this.edges[3][2], p, this.edges[3].condition))
        return true;

    if (isPointOnCorrectSide(this.edges[2][1], this.edges[2][2], p, "r") &&
        isPointOnCorrectSide(this.edges[3][1], this.edges[3][2], p, "l") &&
        p.y - r > this.bridge.top && p.y + r < this.bridge.btm)
        return true;

}


function isPointOnCorrectSide(A, B, P, condition = "r") {
    const val = (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);
    let side = ""
    if (val > 0) side = "l";
    else if (val < 0) side = "r";
    else side = "o";

    return side === condition;
}