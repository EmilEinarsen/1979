import { getFontString } from "./utils.js";

export const WINDOWS_EMOJI_FALLBACK_FONT = "Segoe UI Emoji";
export const DEFAULT_FONT_FAMILY = "Poppins, sans-serif";
export const DEFAULT_FONT_SIZE = "1rem";

export const GAME_OVER_TEXT_COLOR = "#4cffd7";
export const GAME_OVER_TITLE_FONT = getFontString({
  fontWeight: "bold",
  fontSize: "2rem",
});
export const GAME_OVER_SUBTITLE_FONT = getFontString({
  fontWeight: "medium",
  fontSize: "1.25rem",
});

/**
 * Size of the Canvas
 */
export const CANVAS_SIZE = 800;

export const DEFAULT_VPT = {
  zoom: {
    value: 1,
    translation: { x: 0, y: 0 },
  },
  scrollX: 0,
  scrollY: 0,
  rotation: 0,
};

/* BOARD */
/**
 * Background color
 */
export let BOARD_BACKGROUND_COLOR = "";
export let BOARD_FOREGRUND_COLOR = "";
/**
 * Color of the dotted circle
 */
export let BOARD_DOT_COLOR = "";

/* PLAYER */

/**
 * Player initial position
 * Offset from the center of the canvas
 */
export const PLAYER_INITIAL_POSITION = { x: 0, y: 48 };

/**
 * Movement speed
 */
export const PLAYER_MOVEMENT_SPEED = 1;
/**
 * Duration the player is considered "hurt" in ms
 */
export const PLAYER_HURT_DURATION = 3e3;
/**
 * Number of times the player should blink during the duration specified by `PLAYER_HURT_DURATION`
 */
export const PLAYER_HURT_BLINK_COUNT = 8;
/**
 * Duration of a blink
 */
export const PLAYER_HURT_BLINK_DURATION =
  PLAYER_HURT_DURATION / (PLAYER_HURT_BLINK_COUNT * 2);
/**
 * Opacity applied while player is hurt
 */
export const PLAYER_HURT_OPACITY = 0.6;

/* SHOTS */
/**
 * Shots pool size
 */
export const SHOTS_POOL_SIZE = 3;

/* SHOT */
/**
 * Shot velocity
 */
export const SHOT_VELOCITY = 4;
/**
 * Shot length
 */
export const SHOT_LENGTH = 50;

/* ASTROID */
/**
 * Scale applied to asset to better fill hit area.
 * Might be a useful configuration if assets are perceptually smaller then the hit area.
 */
export const ASTROID_SPRITE_SCALE = 1.2;

/**
 * Astroid colors
 */
export const ASTROID_COLORS = {
  "candy-apple-red": "#f05237",
  "vital-orange": "#ff9350",
  sunnyside: "#ffce2d",
  "lucky-green": "#79c47a",
  "sea-glass": "#3aa8b8",
  moonstone: "#91a0e2",
  "iris-infusion": "#c39acb",
  "power-pink": "#fa6d9c",
  guava: "#ff8d90",
  "papaya-fizz": "#ffaa8f",
  citron: "#eddb4c",
  limeade: "#b7d664",
  "aqua-splash": "#66d7de",
  "blue-paradise": "#56c4e8",
  "orchid-frost": "#dacedb",
  "tropical-pink": "#faa5dd",
  "pebble-gray": "#bdb5af",
  "canary-yellow": "#faf19d",
  "acid-lime": "#dfe561",
  "fresh-mint": "#b9e7dd",
  "washed-denim": "#99c6ee",
  "positively-pink": "#ffb9c8",
  "pink-salt": "#f2ddde",
  "first-snow": "#f1f3f4",
};
Object.entries(ASTROID_COLORS).forEach(([k, c]) =>
  document.documentElement.style.setProperty(`--${k}`, c)
);

/* PARTICLES */
/**
 * Particle pool size
 */
export const PARTICLE_POOL_SIZE = 40;
/**
 * Particle size
 */
export const PARTICLE_SIZE = 10;

document.addEventListener("DOMContentLoaded", () => {
  let isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const getVar = (n) =>
    getComputedStyle(document.documentElement).getPropertyValue(n);

  const observeCSSVariables = () => {
    BOARD_BACKGROUND_COLOR =
      getVar("--surface-1") || (isDarkMode ? "MidnightBlue" : "GhostWhite");
    BOARD_FOREGRUND_COLOR = isDarkMode ? "GhostWhite" : "MidnightBlue";
    BOARD_DOT_COLOR = isDarkMode
      ? getVar("--gray-7") || "DarkSlateGray"
      : getVar("--gray-5") || "LightGray";
  };
  observeCSSVariables();

  setInterval(observeCSSVariables, 1000);
  window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
    isDarkMode = e.matches;
    observeCSSVariables();
  });
});
