"use strict";

export function getRandomInt(min, max) {
    min = Math.ceil(min);   // Round up to ensure we include the min properly
    max = Math.floor(max);  // Round down to ensure we include the max properly
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntExcludingRange(minTotal, maxTotal, excludeMin, excludeMax) {
    const validRanges = [];
  
    // Add first valid segment if it exists
    if (excludeMin > minTotal) {
      validRanges.push({ start: minTotal, end: excludeMin - 1 });
    }
  
    // Add second valid segment if it exists
    if (excludeMax < maxTotal) {
      validRanges.push({ start: excludeMax + 1, end: maxTotal });
    }
  
    // Calculate total number of valid numbers
    const totalValidCount = validRanges.reduce((sum, r) => sum + (r.end - r.start + 1), 0);
    if (totalValidCount <= 0) {
      throw new Error("No valid numbers outside excluded range.");
    }
  
    // Pick a random index in the valid space
    let index = Math.floor(Math.random() * totalValidCount);
  
    // Map that index back to actual number
    for (let range of validRanges) {
      const rangeSize = range.end - range.start + 1;
      if (index < rangeSize) {
        return range.start + index;
      }
      index -= rangeSize;
    }
  }
  