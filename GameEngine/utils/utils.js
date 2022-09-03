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
