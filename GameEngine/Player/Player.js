import { Vec } from "../utils/Vec.js"
import { controllerEvent } from "../events/controllerEvent.js"
import { BOARD_SIZE, PLAYER_MOVEMENT_SPEED } from "../utils/constants.js"
import { ShotsPool } from "./Shot/ShotPool.js"
import { MeteorPool } from "../Meteor/MeteorPool.js"
import { healthEvent } from "../events/healthEvent.js"
import { Board } from "../Board.js"

export const Player = new class {
	pos = new Vec(BOARD_SIZE / 2)
	size = 30
	cursor = new Vec(
		BOARD_SIZE / 2,
		0
	)
	direction = new Vec(0, 0)

	_rect
	getBoundingClientRect() {
		return this._rect ||= this.engine.canvas.getBoundingClientRect()
	}

	constructor() {
		this.reset()
		controllerEvent.subscribe(({ isClick, move }) => {
			isClick && this.shoot()
			this.direction = {
				x: move.right ? PLAYER_MOVEMENT_SPEED : move.left ? -PLAYER_MOVEMENT_SPEED : 0,
				y: move.up ? -PLAYER_MOVEMENT_SPEED : move.down ? PLAYER_MOVEMENT_SPEED : 0,
			}
		})
		document.addEventListener('pointermove', e => {
			this.cursor = new Vec(e.clientX, e.clientY).sub(this.getBoundingClientRect())
		})
	}

	init(engine) {
		this.engine = engine
		ShotsPool.init(this.engine)
	}

	shoot() {
		ShotsPool.create({
			pos: this.pos.clone(),
			vel: {
				x: Math.cos(this.rotation),
				y: Math.sin(this.rotation)
			}
		})
	}

	reset() {
		this.rotation = 0
		this.pos .set(BOARD_SIZE / 2, BOARD_SIZE / 2)
		ShotsPool.reset()
	}

	draw() {
		ShotsPool.draw()

		this.engine.ctx.save()

		this.engine.ctx.translate(this.pos.x, this.pos.y)

		const rotation = this.rotation + Math.PI/2
		this.engine.ctx.rotate(rotation)

		if(this.engine.configuration.assets.player?.sprite instanceof HTMLCanvasElement) {
			const { sprite, width, height } = this.engine.configuration.assets.player
			this.engine.ctx.drawImage(sprite, -((width / 2 + .5) | 0), -((height / 2 + .5) | 0))
		} else {
			const height = this.size * Math.cos(Math.PI / 6);
			this.engine.ctx.moveTo(-this.size / 2, height / 2);
			this.engine.ctx.lineTo(this.size / 2, height / 2);
			this.engine.ctx.lineTo(0, -height / 2);

			this.engine.ctx.fillStyle = 'red'
			this.engine.ctx.fill()
		} 

		this.engine.ctx.restore()
	}

	meteorCollision() {
		MeteorPool.meteors.forEach(meteor => {
			if((meteor.radius + this.size / 2) < Math.sqrt((meteor.pos.y - this.pos.y)**2 + (meteor.pos.x - this.pos.x)**2)) return
			healthEvent.dispatch()
			meteor.reset()
		})
	}

	wallCollisions() {
		if(this.pos.y - this.size / 2 < Board.walls.top.y) this.pos.set(this.pos.x, Board.walls.top.y + this.size / 2)
		if(this.pos.x + this.size / 2 > Board.walls.right.x) this.pos.set(Board.walls.right.x - this.size / 2, this.pos.y)
		if(this.pos.y + this.size / 2  > Board.walls.bottom.y) this.pos.set(this.pos.x, Board.walls.bottom.y - this.size / 2)
		if(this.pos.x - this.size / 2 < Board.walls.left.x) this.pos.set(Board.walls.left.x + this.size / 2, this.pos.y)
	}

	update() {
		this.pos.add(this.direction)
		this.wallCollisions()
		this.rotation = Math.atan2(
			this.cursor.y - this.pos.y, 
			this.cursor.x - this.pos.x
		)
		ShotsPool.update()
		this.meteorCollision()
	}
}()