import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, WINDOWS_EMOJI_FALLBACK_FONT } from "./constants.js"

export const getFontString = ({
	fontWeight = '',
	fontSize = DEFAULT_FONT_SIZE,
	fontFamily = DEFAULT_FONT_FAMILY
} = {}) => `${fontWeight} ${fontSize} ${fontFamily}, ${WINDOWS_EMOJI_FALLBACK_FONT}`.trim()

export const createColorizedSprite = (sprite, color) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = sprite.width;
	canvas.height = sprite.height;

	// draw rectangle with the wanted color
	// its going to be cropped to fit the actual asset
	ctx.fillStyle = color
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// crop the rectangle to the asset
	ctx.globalCompositeOperation = "destination-atop";
	ctx.drawImage(sprite,0,0);

	// multiply the assets color value upon the cropped rectangle
	ctx.globalCompositeOperation = "multiply";
	ctx.drawImage(sprite,0,0);

	return canvas
}

export const createCutoutSprite = (sprite, color) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = sprite.width;
	canvas.height = sprite.height;

	// draw rectangle with the wanted color
	// its going to be cropped to fit the actual asset
	ctx.fillStyle = color
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// crop the rectangle to the asset
	ctx.globalCompositeOperation = "destination-atop";
	ctx.drawImage(sprite,0,0);

	return canvas
}

export const getNormalizedCanvasSize = canvas => ({
  width: canvas.width / window.devicePixelRatio,
  height: canvas.height / window.devicePixelRatio
});

export const convertViewportCoordsToSceneCoords = ({
  x,
  y,
  vpt
}) => {
  const invScale = 1 / vpt.zoom.value;
  return {
    x: (x - vpt.zoom.translation.x) * invScale - vpt.scrollX,
    y: (y - vpt.zoom.translation.y) * invScale - vpt.scrollY
  };
};

export const getNewZoom = (
  zoomValue,
  previousZoom,
  zoomOnViewportPoint = { x: 0, y: 0 }
) => {

  return {
    value: zoomValue,
    translation: {
      x:
        zoomOnViewportPoint.x -
        (zoomOnViewportPoint.x - previousZoom.translation.x) *
          (zoomValue / previousZoom.value),
      y:
        zoomOnViewportPoint.y -
        (zoomOnViewportPoint.y - previousZoom.translation.y) *
          (zoomValue / previousZoom.value)
    }
  };
};

/**
 * Rotates `target` relative to `origin` by `angle`
 * @param target Point to rotate
 * @param origin Point to rotate `target` relative to
 * @param angle Number in radians to rotate `target` by
 * @returns Return the rotated target
 */
 export const rotate = (a, c, o) =>
  // https://math.stackexchange.com/questions/2204520/how-do-i-rotate-a-line-segment-in-a-specific-point-on-the-line
  ({
    // 𝑎′𝑥=(𝑎𝑥−𝑐𝑥)cos𝜃−(𝑎𝑦−𝑐𝑦)sin𝜃+𝑐𝑥
    x: (a.x - c.x) * Math.cos(o) - (a.y - c.y) * Math.sin(o) + c.x,
    // 𝑎′𝑦=(𝑎𝑥−𝑐𝑥)sin𝜃+(𝑎𝑦−𝑐𝑦)cos𝜃+𝑐𝑦.
    y: (a.x - c.x) * Math.sin(o) + (a.y - c.y) * Math.cos(o) + c.y
  });
