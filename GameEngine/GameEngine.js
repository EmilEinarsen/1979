import { controllerEvent } from "./events/controllerEvent.js";
import { healthEvent } from "./events/healthEvent.js";
import { scoreEvent } from "./events/scoreEvent.js";
import { levelEvent } from "./events/levelEvent.js";
import { Player } from "./Player/Player.js";
import { Game } from "./Game/Game.js";
import { Board } from "./Board.js";
import { MeteorPool } from "./Meteor/MeteorPool.js";
import { Vec } from "./utils/Vec.js";
import { convertToSprite } from "./utils/convertToSprite.js";
import { ParticlePool } from "./Particle/ParticlePool.js";

export const GameEngine = new (class GameEngine {
  /**
   * @type {'static' | 'loading'}
   */
  state = "loading";

  /**
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * @type {CanvasRenderingContext2D}
   */
  #_ctx;
  get ctx() {
    return (this.#_ctx ||= (() => {
      const ctx = this.canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      return ctx;
    })());
  }

  setSize(size) {
    this.canvas.width = size.width * window.devicePixelRatio;
    this.canvas.height = size.height * window.devicePixelRatio;
    this.width = size.width;
    this.height = size.height;
    this.canvas.style = `width: ${size.width}px; height: ${size.height}px;`;
  }

  convertCursor(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: x - rect.x, y: y - rect.y };
  }

  isGameOver;
  requestID;

  configuration = {
    canvas: undefined,
    isPorted: false,
    settings: {
      isFullscreen: false,
      size: undefined,
      rotation: 0,
    },
    assets: {
      player: undefined,
      astroids: undefined,
      laser: undefined,
    },
  };
  async setConfiguration(conf) {
    try {
      if (typeof conf !== "object" || Array.isArray(conf))
        throw "Mst be an plain object";

      if ("port" in conf) {
        if (!(conf.port instanceof CanvasRenderingContext2D))
          throw "Property port expected instanceof CanvasRenderingContext2D";

        this.configuration.canvas = conf.port.canvas;
        this.#_ctx = conf.port;
        this.configuration.isPorted = true;
      } else if ("canvas" in conf) {
        if (!(conf.canvas instanceof HTMLCanvasElement))
          throw "Property canvas expected instanceof HTMLCanvasElement";

        this.configuration.canvas = conf.canvas;
      } else
        throw "Incomplete configuration. Method `init()` requires a object containing property `canvas` or `port`.";

      this.canvas = this.configuration.canvas;

      if (conf.settings) {
        if (
          "size" in conf.settings &&
          typeof conf.settings.size === "object" &&
          typeof conf.settings.size.width === "number" &&
          typeof conf.settings.size.height === "number"
        ) {
          this.setSize((this.configuration.settings.size = conf.settings.size));
        }

        if (
          "rotation" in conf.settings &&
          typeof conf.settings.rotation === "number"
        ) {
          this.rotation = this.configuration.settings.rotation =
            conf.settings.rotation;
        }

        if (
          !conf.port &&
          "fullscreen" in conf.settings &&
          conf.settings.fullscreen
        ) {
          this.configuration.settings.isFullscreen = true;
          this.setSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }

      this.state = "loading";
      if (conf.assets) {
        if ("player" in conf.assets)
          this.configuration.assets.player = await convertToSprite(
            conf.assets.player
          );
        if ("astroids" in conf.assets)
          this.configuration.assets.astroids = await Promise.all(
            conf.assets.astroids.map((src) => convertToSprite(src))
          );
        if ("laser" in conf.assets)
          this.configuration.assets.laser = await convertToSprite(
            conf.assets.laser
          );
      }

      return this.reset();
    } catch (error) {
      throw error;
    }
  }

  async init(...params) {
    await this.setConfiguration(...params).then(() => {
      healthEvent.subscribe((v) => {
        this.isGameOver = v.isDead;
      });
    });
  }

  gameLoop() {
    const tick = () => {
      if (!this.configuration.isPorted) {
        this.requestID = requestAnimationFrame(tick);

        // Reset identity matrix in case someone forgot to reset
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // this.ctx.imageSmoothingEnabled = false

        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.clip();
      this.ctx.closePath();

      Game.tick();
    };

    return this.configuration.isPorted ? tick : tick();
  }

  loadNextLevel() {
    const { level } = levelEvent();
    const enemyTypes = resolveLevelOpposition(level);
    for (const type of enemyTypes)
      MeteorPool.create({
        pos: new Vec(this.width * Math.random(), this.height * Math.random()),
        vel: new Vec(Math.random() * 2 - 1, Math.random() * 2 - 1),
        rotVel: (Math.PI * 2 * Math.random() - Math.PI) / 1000,
        type,
      });
  }

  reset = () => {
    cancelAnimationFrame(this.requestID);

    this.state = "static";
    this.isGameOver = false;
    scoreEvent.dispatch({ reset: true });
    healthEvent.dispatch({ reset: true });
    levelEvent.dispatch({ type: "reset" });
    Board.init(this);
    Player.init(this);
    Game.init(this);
    MeteorPool.init(this);
    ParticlePool.init(this);

    return this.gameLoop();
  };

  Board = Board;
  Player = Player;
  Game = Game;
  MeteorPool = MeteorPool;
  ParticlePool = ParticlePool;

  controller = controllerEvent;
  score = scoreEvent;
  health = healthEvent;
})();

/**
 * @type {(lvl: number) => (keyof typeof import('./Meteor/Meteor.js').METEOR_TYPE)[]}
 */
function resolveLevelOpposition(level) {
  const enemies = [];

  function spawnEnemies(type, count) {
    for (let i = 0; i < count; i++) {
      enemies.push(type);
    }
  }

  function recursiveSpawn(currentLevel) {
    const numLarge = Math.floor(currentLevel / 3);
    const numMedium = Math.floor((currentLevel % 3) / 2);
    const numSmall = (currentLevel % 3) % 2;

    if (numLarge > 0) spawnEnemies("large", numLarge);
    if (numMedium > 0) spawnEnemies("medium", numMedium);
    if (numSmall > 0) spawnEnemies("small", numSmall);

    if (currentLevel > 1) {
      recursiveSpawn(currentLevel - 1);
    }
  }

  recursiveSpawn(level);
  return enemies;
}
