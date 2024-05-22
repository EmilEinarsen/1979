import { Board } from "../Board.js";
import { scoreEvent } from "../events/scoreEvent.js";
import { ASTROID_SPRITE_SCALE } from "../utils/constants.js";
import { createColorizedSprite } from "../utils/utils.js";
import { Vec } from "../utils/Vec.js";

export const METEOR_TYPE = {
  large: "large",
  medium: "medium",
  small: "small",
};

const ATTRIBUTES = {
  [METEOR_TYPE.large]: {
    health: 3,
    debris: {
      type: "medium",
      count: 3,
      particle: { size: [10, 20], vel: 1.5 },
    },
    radius: 45,
    award: 2,
  },
  [METEOR_TYPE.medium]: {
    health: 2,
    debris: { type: "small", count: 3, particle: { size: [5, 15], vel: 1.25 } },
    radius: 30,
    award: 5,
  },
  [METEOR_TYPE.small]: {
    health: 1,
    radius: 15,
    award: 10,
    debris: { particle: { size: [5, 10], vel: 1 } },
  },
};

export class Meteor {
  id = self.crypto.randomUUID();
  pos = new Vec(Infinity);
  vel = new Vec(0);
  rot = 0;
  rotVel = 0;
  radius = 0;
  health = 0;
  /**
   * @type {keyof typeof METEOR_TYPE | undefined}
   */
  type = undefined;

  get active() {
    return !!this.type;
  }

  init({ pos, vel, rotVel, type, sprite }) {
    this.reset();
    this.pos.set(pos.x, pos.y);
    this.vel.set(vel.x, vel.y);
    this.rotVel = rotVel;

    const attribute = ATTRIBUTES[type];
    if (!attribute)
      throw Error(
        `Invalid Meteor type ${type}; has no corresponding attributes`
      );

    this.type = type;
    this.health = attribute.health;
    this.radius = attribute.radius;
    this.sprite = sprite;
    if (!sprite) return;
    this.sprite.image = createColorizedSprite(
      this.sprite.image,
      this.sprite.color
    );
  }

  draw(ctx) {
    if (!this.type) return;
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rot);

    if (this.sprite) {
      ctx.drawImage(
        this.sprite.image,
        -this.radius,
        -this.radius,
        this.radius * 2 * ASTROID_SPRITE_SCALE,
        this.radius * 2 * ASTROID_SPRITE_SCALE
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  update() {
    if (!this.type) return;

    this.wallCollisions();
    this.pos.add(this.vel);
    this.rot += this.rotVel;
  }

  wallCollisions() {
    if (this.pos.y + this.radius < Board.walls.top.y)
      this.pos.set(this.pos.x, Board.walls.bottom.y + this.radius);
    if (this.pos.x - this.radius > Board.walls.right.x)
      this.pos.set(Board.walls.left.x - this.radius, this.pos.y);
    if (this.pos.y - this.radius > Board.walls.bottom.y)
      this.pos.set(this.pos.x, Board.walls.top.y - this.radius);
    if (this.pos.x + this.radius < Board.walls.left.x)
      this.pos.set(Board.walls.right.x + this.radius, this.pos.y);
  }

  hit() {
    this.health--;
    const attribute = ATTRIBUTES[this.type];
    if (1 <= this.health || !attribute) return;
    const debris = {
      type: attribute.debris.type,
      numberOfChildren: attribute.debris.count,
      particle: attribute.debris.particle,
      pos: this.pos.clone(),
    };
    scoreEvent.dispatch({ source: "meteor", award: attribute.award });

    this.reset();
    return debris;
  }

  reset() {
    this.pos.set(Infinity);
    this.vel.set(0);
    this.rot = 0;
    this.rotVel = 0;
    this.health = 0;
    this.type = undefined;
  }
}
