import {
  BOARD_FOREGRUND_COLOR,
  GAME_OVER_SUBTITLE_FONT,
  GAME_OVER_TEXT_COLOR,
  GAME_OVER_TITLE_FONT,
} from "../../utils/constants.js";
import { levelEvent } from "../../events/levelEvent.js";
import { GameModule } from "./GameModule.js";

const LEVEL_TIMEOUT = 3000;

export const LoadingLevelModule = new (class LoadingLevelModule {
  init(
    /**
     * @type {import('../../GameEngine.js').GameEngine}
     */
    engine,
    /**
     * @type {import('../Game.js').Game}
     */
    game
  ) {
    this.engine = engine;
    this.game = game;
  }

  #startTimestamp;
  #cleanup = [];
  begin() {
    this.#startTimestamp = window.performance.now();
    this.engine.loadNextLevel();
    const timeout = setTimeout(
      () => this.game.changeModule(GameModule),
      LEVEL_TIMEOUT
    );
    this.#cleanup.push(() => clearTimeout(timeout));
    this.engine.Player.toggleAbility("immune", true);
    this.#cleanup.push(() => this.engine.Player.toggleAbility("immune", false));
  }
  end() {
    this.#cleanup.forEach((fn) => fn());
  }

  countDown() {
    if (this.#startTimestamp === undefined) return;

    const elapsed = window.performance.now() - this.#startTimestamp;
    const remaining = Math.max(LEVEL_TIMEOUT - elapsed, 0);
    return Math.ceil(remaining / 1000);
  }

  tick() {
    this.engine.Player.update();
    this.engine.ParticlePool.update();

    this.engine.Board.draw();
    this.engine.Player.draw();
    this.engine.MeteorPool.draw();
    this.engine.ParticlePool.draw();
    this.drawOverlay();
  }

  drawOverlay() {
    this.engine.ctx.fillStyle = BOARD_FOREGRUND_COLOR;
    this.engine.ctx.textAlign = "center";
    this.engine.ctx.textBaseline = "bottom";

    const { level } = levelEvent();
    this.engine.ctx.font = GAME_OVER_TITLE_FONT;
    this.engine.ctx.fillText(
      `LVL ${level}`,
      this.engine.width / 2,
      this.engine.height / 2 - 32
    );

    const seconds = this.countDown();
    this.engine.ctx.font = GAME_OVER_SUBTITLE_FONT;
    this.engine.ctx.fillText(
      `${Array.from({ length: seconds }, () => "■").join(" ")}`,
      this.engine.width / 2,
      this.engine.height / 2 + 12
    );
  }
})();
