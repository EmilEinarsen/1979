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

/* PLAYER */
/**
 * Movement speed
 */
export const PLAYER_MOVEMENT_SPEED = 1

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


/* ASTROID */
/**
 * Scale applied to asset to better fill hit area.
 * Might be a useful configuration if assets are perceptually smaller then the hit area.
 */
export const ASTROID_SPRITE_SCALE = 1.2

/**
 * Astroid colors
 */
export const ASTROID_COLORS = {
	'candy-apple-red': '#f05237',
	'vital-orange': '#ff9350',
	'sunnyside': '#ffce2d',
	'lucky-green': '#79c47a',
	'sea-glass': '#3aa8b8',
	'moonstone': '#91a0e2',
	'iris-infusion': '#c39acb',
	'power-pink': '#fa6d9c',
	'guava': '#ff8d90',
	'papaya-fizz': '#ffaa8f',
	'citron': '#eddb4c',
	'limeade': '#b7d664',
	'aqua-splash': '#66d7de',
	'blue-paradise': '#56c4e8',
	'orchid-frost': '#dacedb',
	'tropical-pink': '#faa5dd',
	'pebble-gray': '#bdb5af',
	'canary-yellow': '#faf19d',
	'acid-lime': '#dfe561',
	'fresh-mint': '#b9e7dd',
	'washed-denim': '#99c6ee',
	'positively-pink': '#ffb9c8',
	'pink-salt': '#f2ddde',
	'first-snow': '#f1f3f4',
}
Object.entries(ASTROID_COLORS).forEach(([k, c]) => document.documentElement.style.setProperty(`--${k}`, c))


document.addEventListener('DOMContentLoaded', () => {
	const getVar = n => getComputedStyle(document.documentElement).getPropertyValue(n)

	const observeCSSVariables = () => {
		BOARD_BACKGROUND_COLOR = getVar('--surface-2')
	}
	observeCSSVariables()

	setInterval(observeCSSVariables, 1000)
	window.matchMedia("(prefers-color-scheme: dark)").addListener(observeCSSVariables);
	
})
