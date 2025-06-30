"use strict";

// mdx = (x2-x1) / 20;
// mdy = (y2-y1) / 20;
// mdx5 = (x2-x1) / 4;
// mdy5 = (y2-y1) / 4;

export default function Alpha_J(tlCenter = { x: 1, y: 2 }, size = { width: 10, height: 10 }) {

    this.x1 = tlCenter.x;
    this.x2 = this.x1 + size.width;
    this.y1 = tlCenter.y;
    this.y2 = this.y1 + size.height;

    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const mdx = dx / 20, mdy = dy / 20;
    const mdx5 = dx / 4, mdy5 = dy / 4;

    this.r1 = mdy * 3;
    this.r2 = this.r1 + mdy * 3;
    this.firstBerrier = this.y1 + 3 * mdy;
    this.xRange1 = [this.x1 + mdx5, this.x1 + 3 * mdx5 + mdy * 3];
    this.secondBerrier = (this.y1 + 12 * mdy);
    this.xRange2 = [this.x1 + 3 * mdx5, this.x1 + 3 * mdx5 + mdy * 3];
    this.center = { x: this.x1 + 2 * mdx5 , y: this.y1 + 12 * mdy };

}

//  if y <= (y1 + 3 * mdy) then
//     x >= (x1 + mdx5) and x <= (x2 - (mdx * 2))

//  if y > (y1 + 3 * mdy) and y <= (y1 + 12 * mdy) then
//     x >= (x1 + 3 * mdx5) and x <= (x2 - (mdx * 2))

//  else
//      distance (x1 + 2 * mdx5), (y1 + 12 * mdy) and (x,y)
//      >= r1 and <= r2

Alpha_J.prototype.isInside = function (p = { x: 1, y: 1 }, r = 10) {


    if (p.x - r < this.x1 || p.x + r > this.x2 || p.y - r < this.y1 || p.y + r > this.y2)
        return false;

    if (p.y <= this.firstBerrier && p.x >= this.xRange1[0] && p.x <= this.xRange1[1])
        return true;
    else if (p.y > this.firstBerrier && p.y <= this.secondBerrier && p.x >= this.xRange2[0] && p.x <= this.xRange2[1])
        return true;
    else if (p.y > this.secondBerrier) {
        const distance = Math.hypot((p.x - this.center.x), (p.y - this.center.y));

        if (distance >= this.r1 && distance <= this.r2) return true;
        else return false;
    } else return false;

}
