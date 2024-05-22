import { StartModule } from "./modules/StartModule.js";

export const Game = new (class {
  /**
   * @type {
   *  import('./modules/StartModule.js').StartModule |
   *  import('./modules/LoadingLevelModule.js').LoadinglevelModule |
   *  import('./modules/PausedModule.js').PausedModule |
   *  import('./modules/GameModule.js').GameModule |
   *  import('./modules/GameOverModule.js').GameOverModule
   * }
   */
  #module = StartModule;

  init(
    /**
     * @type {import('../GameEngine.js').GameEngine}
     */
    engine
  ) {
    this.engine = engine;
    this.#module = StartModule;
    this.#module.init(this.engine, this);
    this.#module.begin();
  }

  changeModule(module) {
    this.#module.end();
    this.#module = module;
    this.#module.init(this.engine, this);
    this.#module.begin();
  }

  tick() {
    this.#module.tick();
  }
})();
