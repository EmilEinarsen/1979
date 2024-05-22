import { levelEvent } from "../events/levelEvent.js";
import { ShotsPool } from "../Player/Shot/ShotPool.js";
import { ASTROID_COLORS } from "../utils/constants.js";
import { Vec } from "../utils/Vec.js";
import { detectLineCircle } from "../utils/collision-detection.js";
import { Meteor } from "./Meteor.js";
import { random } from "../utils/misc.js";

export const MeteorPool = new (class {
  init(
    /**
     * @type {import('../GameEngine.js').GameEngine}
     */
    engine
  ) {
    this.engine = engine;
    /**
     * @type {Meteor[]}
     */
    this.meteors = [];
  }

  getNextSprite() {
    if (!this.engine.configuration?.assets?.astroids) return;

    const index = (() => {
      let indices = Array.from({ length: 10 }, () => 0);
      for (const meteor of this.meteors)
        meteor.sprite && indices[meteor.sprite.index]++;
      return indices.reduce(
        (p, c, i) => (p[0] < c ? p : [c, i]),
        [Infinity, Infinity]
      )[1];
    })();

    const color = (() => {
      const colors = [
        ...Object.values(ASTROID_COLORS),
        ...this.meteors.map((m) => m.sprite?.color).filter(Boolean),
      ];
      const colorCount = {};
      for (const color of colors)
        colorCount[color] === undefined
          ? (colorCount[color] = 0)
          : colorCount[color]++;
      const minCount = Math.min(...Object.values(colorCount));
      const availableColors = Object.entries(colorCount).filter(
        (v) => v[1] === minCount
      );
      return availableColors[
        Math.round((availableColors.length - 1) * Math.random())
      ][0];
    })();

    return {
      index,
      color,
      image: this.engine.configuration.assets.astroids[index],
    };
  }

  create({ pos, vel, rotVel, type }) {
    let available = this.meteors.find((s) => !s.active);
    if (!available)
      available = this.meteors[this.meteors.push(new Meteor()) - 1];
    available.init({ pos, vel, rotVel, type, sprite: this.getNextSprite() });
  }

  update() {
    const collision = [];
    for (const shot of ShotsPool.shots) {
      for (const meteor of this.meteors) {
        if (
          detectLineCircle(
            {
              pos1: { x: shot.head.x, y: shot.head.y },
              pos2: { x: shot.tail.x, y: shot.tail.y },
            },
            {
              pos: meteor.pos,
              radius: meteor.radius,
            }
          ).type === "INTERSECTING"
        )
          collision.push({ shot, meteor });
      }
    }

    collision.forEach(({ shot, meteor }) => {
      shot.hit();
      const shotVel = shot.vel.clone();
      const debris = meteor.hit();
      this.engine.ParticlePool.create(() => ({
        pos: debris.pos,
        color: meteor.sprite.color,
        size: random(debris.particle.size[0], debris.particle.size[1]),
        vel: Vec.random(-debris.particle.vel, debris.particle.vel),
      }));

      if (!debris) return;
      for (let i = debris.numberOfChildren; 0 < i; i--)
        this.create({
          pos: debris.pos,
          vel: new Vec(Math.random() * 2 - 1, Math.random() * 2 - 1),
          rotVel: (Math.PI * 4 * Math.random() - Math.PI * 2) / 700,
          type: debris.type,
        });
    });

    let allDead = true;
    this.meteors.forEach((m) => {
      m.update();
      if (m.active) allDead = false;
    });

    if (allDead) levelEvent.dispatch({ type: "progress" });
  }

  draw() {
    this.meteors.forEach((m) => m.draw(this.engine.ctx));
  }

  reset() {
    this.meteors.forEach((m) => m.reset());
  }
})();
