import { PARTICLE_POOL_SIZE, PARTICLE_SIZE } from "../utils/constants.js";
import { Particle } from "./Particle.js";

export const ParticlePool = new (class {
  init(
    /**
     * @type {import('../../GameEngine.js').GameEngine}
     */
    engine
  ) {
    this.engine = engine;
    this.particles = Array.from({ length: PARTICLE_POOL_SIZE }).map(
      () => new Particle()
    );
  }

  create(particleArgsOrResolver, options = {}) {
    const { quantity = 10 } = options;

    let available = this.particles.filter((s) => !s.active).slice(0, quantity);
    available.forEach((p) =>
      p.init({
        size: PARTICLE_SIZE,
        ...(typeof particleArgsOrResolver === "function"
          ? particleArgsOrResolver()
          : particleArgsOrResolver),
      })
    );
  }

  update() {
    this.particles.forEach((p) => p.update());
  }

  draw() {
    this.particles.forEach((p) => p.draw(this.engine.ctx));
  }

  reset() {
    this.particles.forEach((p) => p.reset());
  }
})();
