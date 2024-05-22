import { healthEvent } from "../../events/healthEvent.js";
import { levelEvent } from "../../events/levelEvent.js";
import { GameOverModule } from "./GameOverModule.js";
import { LoadingLevelModule } from "./LoadingLevelModule.js";
import { PausedModule } from "./PausedModule.js";

export const GameModule = new (class GameModule {
  level = levelEvent().level;

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
    this.level = levelEvent().level;
  }

  #cleanup = [];
  begin() {
    const onKeyPress = (/** @type {KeyboardEvent} */ e) => {
      if (e.key === "Escape") this.game.changeModule(PausedModule);
    };
    const onInactive = () => {
      if (document.visibilityState === "hidden")
        this.game.changeModule(PausedModule);
    };
    document.addEventListener("visibilitychange", onInactive, false);
    document.addEventListener("keydown", onKeyPress, false);
    this.#cleanup.push(() =>
      document.removeEventListener("keydown", onKeyPress, false)
    );
    this.engine.Player.toggleAbility("shooting", true);
  }
  end() {
    this.#cleanup.forEach((fn) => fn());
    this.engine.Player.toggleAbility("shooting", false);
  }

  tick() {
    this.engine.Player.update();
    this.engine.MeteorPool.update();
    this.engine.ParticlePool.update();

    this.engine.Board.draw();
    this.engine.Player.draw();
    this.engine.MeteorPool.draw();
    this.engine.ParticlePool.draw();
  }

  nextLevel() {
    if (this.level === levelEvent().level) return;
    this.game.changeModule(LoadingLevelModule);
  }

  gameOver() {
    console.log(healthEvent());
    if (!healthEvent().isDead) return;
    this.game.changeModule(GameOverModule);
  }
})();

levelEvent.subscribe(() => GameModule.nextLevel());
healthEvent.subscribe(() => GameModule.gameOver());
