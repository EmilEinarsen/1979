import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, WINDOWS_EMOJI_FALLBACK_FONT } from "./constants.js"

export const getFontString = ({
	fontWeight = '',
	fontSize = DEFAULT_FONT_SIZE,
	fontFamily = DEFAULT_FONT_FAMILY
} = {}) => `${fontWeight} ${fontSize} ${fontFamily}, ${WINDOWS_EMOJI_FALLBACK_FONT}`.trim()
