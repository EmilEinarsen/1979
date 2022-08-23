import { Board } from "../../Board.js"
import { SHOT_LENGTH, SHOT_VELOCITY } from "../../utils/constants.js"
import { Vec } from "../../utils/Vec.js"

export class Shot {
	id = self.crypto.randomUUID()
	vel = new Vec(0)
	origin = new Vec(Infinity)
	head = new Vec(Infinity)
	tail = new Vec(Infinity)
	active = false

	constructor() {
		this.reset()
	}

	init({ pos, vel }) {
		if(this.active) return
		this.reset()
		this.vel.set(vel.x, vel.y)
		this.origin.set(pos.x, pos.y)
		this.head = this.origin.clone()
		this.tail = this.origin.clone()
		this.active = true
	}

	draw(ctx) {
		if(!this.active) return
		ctx.save()
		
		ctx.strokeStyle = 'red'
		ctx.lineWidth = 4
		ctx.beginPath()
		ctx.moveTo(this.tail.x, this.tail.y)
		ctx.lineTo(this.head.x, this.head.y)
		ctx.closePath()
		ctx.stroke()
		
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