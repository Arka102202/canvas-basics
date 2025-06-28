"use strict";

export function getRandomInt(min, max) {
    min = Math.ceil(min);   // Round up to ensure we include the min properly
    max = Math.floor(max);  // Round down to ensure we include the max properly
    return Math.floor(Math.random() * (max - min + 1)) + min;
}