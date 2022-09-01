import { controllerEvent } from "./events/controllerEvent.js"
import { healthEvent } from "./events/healthEvent.js"
import { scoreEvent } from "./events/scoreEvent.js"
import { BOARD_BACKGROUND_COLOR, BOARD_BLINK_DURATION, BOARD_BLINK_DURATION_GAME_OVER, BOARD_BLINK_ODDS, BOARD_BLINK_ODDS_GAME_OVER, BOARD_SIZE, CANVAS_SIZE, GAME_OVER_SUBTITLE_FONT, GAME_OVER_TEXT_COLOR, GAME_OVER_TITLE_FONT } from "./utils/constants.js"
import { Player } from "./Player/Player.js"
import { Board } from "./Board.js"
import { MeteorPool } from "./Meteor/MeteorPool.js"
import { Vec } from "./utils/Vec.js"
import { convertElementToSprite } from "./utils/convertElementToSprite.js"

export const GameEngine = new class {
	canvas = document.querySelector('canvas')

	width = BOARD_SIZE
	height = BOARD_SIZE
	offset = (CANVAS_SIZE - BOARD_SIZE) / 2
	ctx = (() => {
		const ctx = this.canvas.getContext('2d')
		this.canvas.width = this.canvas.style.width = CANVAS_SIZE * window.devicePixelRatio
		this.canvas.height = this.canvas.style.height = CANVAS_SIZE * window.devicePixelRatio
		ctx.imageSmoothingEnabled = false

		return ctx
	})()

	isGameOver
	requestID

	configuration = {
		assets: {
			player: undefined
		}
	}
	setConfiguration(conf) {
		if(typeof conf !== 'object' || Array.isArray(conf)) throw Error('invalid configuration')
		if(conf.assets) {
			if('player' in conf.assets) this.configuration.assets.player = convertElementToSprite(conf.assets.player)
		}
	}
	
	constructor() {
		Board.init(this)
		Player.init(this)
		MeteorPool.init(this)
		healthEvent.subscribe((v => {
			this.isGameOver = v.isDead
		}))
		this.canvas.addEventListener('pointerdown', e => {
			e.preventDefault();
		})
		this.reset()
	}

	resetContext() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0)
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		this.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
	}

	drawBackground() {
		this.ctx.beginPath()

		this.ctx.fillStyle = BOARD_BACKGROUND_COLOR
		this.ctx.fillRect(0, 0, this.width, this.height)
		
		this.ctx.closePath()
	}

	game(skipDraw = false) {
		// update
		Player.update()
		MeteorPool.update()

		if(skipDraw) return
		this.drawBackground()
		Player.draw()
		MeteorPool.draw()
	}
	
	gameOver(skipDraw = false) {
		if(skipDraw) return

		this.ctx.fillStyle = GAME_OVER_TEXT_COLOR
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'bottom'

		this.ctx.font = GAME_OVER_TITLE_FONT
		this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 40)

		const score = scoreEvent()
		this.ctx.font = GAME_OVER_SUBTITLE_FONT
		this.ctx.fillText(`SCORE	 ${score.current}`, this.width / 2, this.height / 2 + 60)
		this.ctx.fillText(`MAXSCORE	 ${score.highest}`, this.width / 2, this.height / 2 + 80)
	}

	get BLINK_ODDS() {
		return this.isGameOver ? BOARD_BLINK_ODDS_GAME_OVER : BOARD_BLINK_ODDS
	}
	get BLINK_DURATION() {
		return this.isGameOver ? BOARD_BLINK_DURATION_GAME_OVER : BOARD_BLINK_DURATION
	}
	gameLoop() {
		let prev
		const tick = now => {
			this.requestID = requestAnimationFrame(tick)
			this.resetContext()
			this.ctx.translate(this.offset, this.offset)

			if(!prev && (Math.random() < this.BLINK_ODDS)) {
				prev = performance.now()
			} else if(this.BLINK_DURATION < (now - prev)) prev = undefined
			
			if (!this.isGameOver) this.game(!!prev) 
			else this.gameOver(!!prev)
		}
		tick()
	}
	
	reset = () => {
		cancelAnimationFrame(this.requestID)

		this.isGameOver = false
		scoreEvent.dispatch({ reset: true })
		healthEvent.dispatch({ reset: true })

		Player.reset()
		MeteorPool.reset()
		
		for(let i = 0; i < 4; i++)
			MeteorPool.create({
				pos: new Vec(this.width * Math.random(), this.height * Math.random()),
				vel: new Vec(Math.random()*2 - 1, Math.random()*2 - 1),
				type: 'large'
			})

		this.gameLoop()
	}

	controller = controllerEvent
	score = scoreEvent
	health = healthEvent
}()