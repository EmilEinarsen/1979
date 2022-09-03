import { Vec } from "../utils/Vec.js"
import { controllerEvent } from "../events/controllerEvent.js"
import { BOARD_SIZE, PLAYER_HURT_BLINK_COUNT, PLAYER_HURT_BLINK_DURATION, PLAYER_HURT_DURATION, PLAYER_HURT_OPACITY, PLAYER_MOVEMENT_SPEED } from "../utils/constants.js"
import { ShotsPool } from "./Shot/ShotPool.js"
import { MeteorPool } from "../Meteor/MeteorPool.js"
import { healthEvent } from "../events/healthEvent.js"
import { Board } from "../Board.js"
import { createCutoutSprite } from "../utils/utils.js"

export const PLAYER_STATE = {
	normal: 'normal',
	hurt: 'hurt'
}

export const Player = new class {
	_stateTimestamp = window.performance.now()
	_state = PLAYER_STATE.normal
	get state() { return this._state }
	set state(state) {
		if(!PLAYER_STATE[state]) throw Error('Invalid player state')
		this._state = state
		this._stateTimestamp = window.performance.now()
	}

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
		this.reset()
		ShotsPool.init(this.engine)
	}

	shoot() {
		if(this.state === 'hurt') return
		ShotsPool.create({
			pos: this.pos.clone(),
			vel: {
				x: Math.cos(this.rotation),
				y: Math.sin(this.rotation)
			}
		})
	}
	draw() {
		ShotsPool.draw()

		this.engine.ctx.save()

		this.engine.ctx.translate(this.pos.x, this.pos.y)

		const rotation = this.rotation + Math.PI/2
		this.engine.ctx.rotate(rotation)

		const opacity = this.state === 'hurt' ? PLAYER_HURT_OPACITY : 1
		this.engine.ctx.globalAlpha = opacity

		const shouldBlink = this.state === 'hurt' && !(Math.trunc((window.performance.now() - this._stateTimestamp) / PLAYER_HURT_BLINK_DURATION) % 2)

		if(this.sprite) {
			const { normal, hurt, width, height } = this.sprite
			this.engine.ctx.drawImage(shouldBlink ? hurt : normal, -((width / 2 + .5) | 0), -((height / 2 + .5) | 0))
		} else {
			const height = this.size * Math.cos(Math.PI / 6);
			this.engine.ctx.moveTo(-this.size / 2, height / 2);
			this.engine.ctx.lineTo(this.size / 2, height / 2);
			this.engine.ctx.lineTo(0, -height / 2);

			this.engine.ctx.fillStyle = shouldBlink ? 'white' : 'red'
			this.engine.ctx.fill()
		} 

		this.engine.ctx.restore()
	}

	update() {
		ShotsPool.update()

		if(PLAYER_HURT_DURATION < window.performance.now() - this._stateTimestamp) this.state = PLAYER_STATE.normal

		this.pos.add(this.direction)

		this.rotation = Math.atan2(
			this.cursor.y - this.pos.y, 
			this.cursor.x - this.pos.x
		)

		this.wallCollisions()
		if(this.state !== 'hurt') this.meteorCollision()
	}

	meteorCollision() {
		MeteorPool.meteors.forEach(meteor => {
			if((meteor.radius + this.size / 2) < Math.sqrt((meteor.pos.y - this.pos.y)**2 + (meteor.pos.x - this.pos.x)**2)) return
			this.state = PLAYER_STATE.hurt
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

	reset() {
		this.state = PLAYER_STATE.normal
		this.rotation = 0
		this.pos.set(BOARD_SIZE / 2, BOARD_SIZE / 2)
		ShotsPool.reset()
		if(this.engine.configuration.assets.player) {
			const { sprite, ...size } = this.engine.configuration.assets.player
			this.sprite = { normal: sprite, hurt: createCutoutSprite(sprite, '#fff'), ...size }
		} else this.sprite = undefined
	}
}()