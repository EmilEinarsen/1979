import { Board } from "../Board.js"
import { scoreEvent } from "../events/scoreEvent.js"
import { Vec } from "../utils/Vec.js"

const ATTRIBUTES = {
	large: { health: 3, debris: { type: 'medium', count: 3 }, radius: 45, award: 2 },
	medium: { health: 2, debris: { type: 'small', count: 3 }, radius: 30, award: 5 },
	small: { health: 1, radius: 15, award: 10 },
}

export class Meteor {
	id = self.crypto.randomUUID()
	pos = new Vec(Infinity)
	vel = new Vec(0)
	radius = 0
	health = 0
	type = undefined

	get active() {
		return !!this.type
	}

	constructor() {
		this.reset()
	}

	init({ pos, vel, type, sprite }) {
		this.reset()
		this.pos.set(pos.x, pos.y)
		this.vel.set(vel.x, vel.y)

		const attribute = ATTRIBUTES[type]
		if(!attribute) throw Error(`Invalid Meteor type ${type}; has no corresponding attributes`)

		this.type = type
		this.health = attribute.health
		this.radius = attribute.radius
		this.sprite = sprite
	}

	draw(ctx) {
		if(!this.type) return
		ctx.save()

		if(this.sprite) {
			ctx.drawImage(this.sprite.image, this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2)
		} else {
			ctx.fillStyle = 'blue'
			ctx.beginPath()
			ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
			ctx.closePath()
			ctx.fill()
		}

		
		ctx.restore()
	}

	update() {
		if(!this.type) return
		
		this.wallCollisions()
		this.pos.add(this.vel)
	}
	
	wallCollisions() {
		if(this.pos.y + this.radius < Board.walls.top.y) this.pos.set(this.pos.x, Board.walls.bottom.y + this.radius)
		if(this.pos.x - this.radius > Board.walls.right.x) this.pos.set(Board.walls.left.x - this.radius, this.pos.y)
		if(this.pos.y - this.radius  > Board.walls.bottom.y) this.pos.set(this.pos.x, Board.walls.top.y - this.radius)
		if(this.pos.x + this.radius < Board.walls.left.x) this.pos.set(Board.walls.right.x + this.radius, this.pos.y)
	}

	hit() {
		this.health--
		const attribute = ATTRIBUTES[this.type]
		if(1 <= this.health || !attribute) return
		const debris = attribute.debris ? { type: attribute.debris.type, numberOfChildren: attribute.debris.count, pos: this.pos.clone() } : undefined
		scoreEvent.dispatch({ source: 'meteor', award: attribute.award })
		this.reset()
		return debris
	}

	reset() {
		this.pos.set(Infinity)
		this.vel.set(0)
		this.health = 0
		this.type = undefined
	}
}