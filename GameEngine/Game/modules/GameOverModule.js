import { scoreEvent } from "../../events/scoreEvent.js";
import {
  GAME_OVER_SUBTITLE_FONT,
  GAME_OVER_TEXT_COLOR,
  GAME_OVER_TITLE_FONT,
} from "../../utils/constants.js";

export const GameOverModule = new (class GameOverModule {
  init(
    /**
     * @type {import('../../GameEngine.js').GameEngine}
     */
    engine
  ) {
    this.engine = engine;
  }

  #cleanup = [];
  begin() {}
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
    this.engine.ctx.fillStyle = GAME_OVER_TEXT_COLOR;
    this.engine.ctx.textAlign = "center";
    this.engine.ctx.textBaseline = "bottom";

    this.engine.ctx.font = GAME_OVER_TITLE_FONT;
    this.engine.ctx.fillText(
      "GAME OVER",
      this.engine.width / 2,
      this.engine.height / 2 - 40
    );

    const score = scoreEvent();
    this.engine.ctx.font = GAME_OVER_SUBTITLE_FONT;
    this.engine.ctx.fillText(
      `SCORE	 ${score.current}`,
      this.engine.width / 2,
      this.engine.height / 2 + 60
    );
    this.engine.ctx.fillText(
      `MAXSCORE	 ${score.highest}`,
      this.engine.width / 2,
      this.engine.height / 2 + 80
    );
  }
})();
