import { Board } from "../../Board.js"
import { ASTROID_COLORS, SHOT_LENGTH, SHOT_VELOCITY } from "../../utils/constants.js"
import { createColorizedSprite } from "../../utils/utils.js"
import { Vec } from "../../utils/Vec.js"

export class Shot {
	id = self.crypto.randomUUID()
	vel = new Vec(0)
	origin = new Vec(Infinity)
	head = new Vec(Infinity)
	tail = new Vec(Infinity)
	active = false

	init({ pos, vel, sprite }) {
		if(this.active) return
		this.reset()
		this.vel.set(vel.x, vel.y)
		this.origin.set(pos.x, pos.y)
		this.head = this.origin.clone()
		this.tail = this.origin.clone()
		if(sprite) this.sprite = createColorizedSprite(sprite, ASTROID_COLORS["power-pink"])
		this.active = true
	}

	draw(ctx) {
		if(!this.active) return

		ctx.save()
		
		if(this.sprite) {
			const scale = .9
			const shotLength = Math.sqrt((this.head.x - this.tail.x)**2 + (this.head.y - this.tail.y)**2)
			
			ctx.translate(this.tail.x, this.tail.y)
			ctx.rotate(Math.atan2(
				this.head.y - this.tail.y, 
				this.head.x - this.tail.x
			))
			
      const repeat =
				shotLength / (this.sprite.width / scale);
      const offsetToCenter = this.sprite.height / (scale * 2);
      const underlineAABB = {
        x: 0,
        y: -offsetToCenter,
        width: this.sprite.width / scale,
        height: this.sprite.height / scale
      };
			
			const spriteOffset = Math.sqrt(this.head.y**2 + this.head.x**2) % SHOT_LENGTH
      for (let i = 0; i < repeat; i++) {
        const factor = repeat - i < 1 ? repeat - i : 1;
        const crop = [
          0,
          0,
          this.sprite.width * factor,
          this.sprite.height
        ];
        const projection = [
          underlineAABB.x + underlineAABB.width * i,
          underlineAABB.y,
          underlineAABB.width * factor,
          underlineAABB.height
        ];
				ctx.drawImage(this.sprite, ...crop, ...projection);
        
      }
		} else {
			ctx.strokeStyle = 'red'
			ctx.lineWidth = 4
			ctx.beginPath()
			ctx.moveTo(this.tail.x, this.tail.y)
			ctx.lineTo(this.head.x, this.head.y)
			ctx.closePath()
			ctx.stroke()
		}

		ctx.restore()
	}

	update() {
		if(!this.active) return
		if(!this.validatePosition()) return this.reset()
		this.head.add(this.vel.clone().mult(SHOT_VELOCITY))
		const head = this.head.clone().sub(this.tail)

		if(Math.sqrt(head.y**2 + head.x**2) > SHOT_LENGTH)
			this.tail = this.head.clone().sub(this.vel.clone().mult(SHOT_LENGTH))
	}

	validatePosition() {
		return !(
			this.tail.y < Board.walls.top.y ||
			this.tail.x > Board.walls.right.x ||
			this.tail.y > Board.walls.bottom.y ||
			this.tail.x < Board.walls.left.x
		)
	}

	hit() { 
		this.reset()
	}

	reset() {
		this.vel = new Vec(0)
		this.origin = new Vec(Infinity)
		this.head = new Vec(Infinity)
		this.tail = new Vec(Infinity)
		this.active = false
	}
}