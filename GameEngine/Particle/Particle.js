import { PARTICLE_SIZE } from "../utils/constants.js";
import { Vec } from "../utils/Vec.js";

export class Particle {
  get active() {
    return this.size && 0 < this.size && this.pos;
  }

  init({ pos, color, size = PARTICLE_SIZE, vel }) {
    if (this.active) return;
    this.reset();
    this.pos = new Vec(pos.x, pos.y);
    this.color = color;
    this.size = size;
    if (vel) this.vel = vel;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    ctx.restore();
  }

  update() {
    if (!this.active) return;
    this.size -= 0.3;
    this.pos.add(this.vel);
  }

  reset() {
    this.pos = undefined;
    this.color = undefined;
    this.size = undefined;
    this.vel = Vec.random(-2, 2);
  }
}
