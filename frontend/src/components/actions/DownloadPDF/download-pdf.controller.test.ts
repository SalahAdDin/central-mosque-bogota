import { describe, expect, it } from "vitest";

import { computeLetterPortraitPlacement } from "./download-pdf.controller";

describe("computeLetterPortraitPlacement", () => {
  it("should scale down and keep the image within the printable area when the image is wider than the page", () => {
    const marginMm = 10;
    const pageWidthMm = 215.9;
    const pageHeightMm = 279.4;

    const placement = computeLetterPortraitPlacement({
      imageWidthPx: 2000,
      imageHeightPx: 1000,
      marginMm,
      pageWidthMm,
      pageHeightMm,
    });

    const innerWidthMm = pageWidthMm - marginMm * 2;
    const innerHeightMm = pageHeightMm - marginMm * 2;

    expect(placement.widthMm).toBeLessThanOrEqual(innerWidthMm + 1e-6);
    expect(placement.heightMm).toBeLessThanOrEqual(innerHeightMm + 1e-6);
    expect(placement.xMm).toBeGreaterThanOrEqual(marginMm - 1e-6);
    expect(placement.yMm).toBeGreaterThanOrEqual(marginMm - 1e-6);
    expect(placement.xMm + placement.widthMm).toBeLessThanOrEqual(pageWidthMm - marginMm + 1e-6);
    expect(placement.yMm + placement.heightMm).toBeLessThanOrEqual(pageHeightMm - marginMm + 1e-6);

    expect(placement.widthMm).toBeCloseTo(innerWidthMm, 4);
  });

  it("should center the image when there is extra vertical space inside the page", () => {
    const placement = computeLetterPortraitPlacement({
      imageWidthPx: 2000,
      imageHeightPx: 1000,
      marginMm: 10,
    });

    expect(placement.xMm).toBeCloseTo(10, 6);
    expect(placement.yMm).toBeGreaterThan(10);
  });
});
