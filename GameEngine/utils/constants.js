import { getFontString } from "./utils.js"

export const WINDOWS_EMOJI_FALLBACK_FONT = 'Segoe UI Emoji'
export const DEFAULT_FONT_FAMILY = 'Poppins, sans-serif'
export const DEFAULT_FONT_SIZE = '1rem'

export const GAME_OVER_TEXT_COLOR = '#4cffd7'
export const GAME_OVER_TITLE_FONT = getFontString({ fontWeight: 'bold', fontSize: '2rem' })
export const GAME_OVER_SUBTITLE_FONT = getFontString()

/**
 * Controls the application framerate. 
 * Should be coordinated with `SNAKE_MOVE_DELAY`
 */
export const FPS = 120

/**
 * Size of the Canvas
 */
export const CANVAS_SIZE = 800
/**
 * Size of the Game view
 */
export const BOARD_SIZE = 800
/**
 * Number of particles used/recycled withing the ParticlePool
 */
export const PARTICLE_POOL_SIZE = 30
/**
 * Odds of the game-play not to render, causing blinking 
 */
export const BOARD_BLINK_ODDS = .0025
/**
 * Duration of the game-play blinking in ms
 */
 export const BOARD_BLINK_DURATION = 10
/**
 * Odds of the game-play not to render, causing blinking 
 */
export const BOARD_BLINK_ODDS_GAME_OVER = .0025
/**
 * Duration of the game-play blinking in ms
 */
export const BOARD_BLINK_DURATION_GAME_OVER = 100
/**
 * Background color
 */
export let BOARD_BACKGROUND_COLOR = ''

/* SHOTS */
/**
 * Shots pool size
 */
export const SHOTS_POOL_SIZE = 5

/* SHOT */
/**
 * Shot velocity
 */
export const SHOT_VELOCITY = 5
/**
 * Shot length
 */
export const SHOT_LENGTH = 50




document.addEventListener('DOMContentLoaded', () => {
	const getVar = n => getComputedStyle(document.documentElement).getPropertyValue(n)

	const observeCSSVariables = () => {
		BOARD_BACKGROUND_COLOR = getVar('--surface-2')
	}
	observeCSSVariables()

	setInterval(observeCSSVariables, 1000)
	window.matchMedia("(prefers-color-scheme: dark)").addListener(observeCSSVariables);
	
})
