import {
  BOARD_FOREGRUND_COLOR,
  GAME_OVER_TEXT_COLOR,
  GAME_OVER_TITLE_FONT,
} from "../../utils/constants.js";
import { GameModule } from "./GameModule.js";

export const PausedModule = new (class PausedModule {
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

  #cleanup = [];
  begin() {
    const onKeyPress = () => this.game.changeModule(GameModule);
    document.addEventListener("keydown", onKeyPress, false);
    this.#cleanup.push(() =>
      document.removeEventListener("keydown", onKeyPress, false)
    );
  }
  end() {
    this.#cleanup.forEach((fn) => fn());
  }

  tick() {
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

    this.engine.ctx.font = GAME_OVER_TITLE_FONT;
    this.engine.ctx.fillText(
      "PRESS ANY KEY TO RESUME",
      this.engine.width / 2,
      this.engine.height / 2 - 40
    );
  }
})();
