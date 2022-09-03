import { BOARD_BACKGROUND_COLOR } from "./utils/constants.js"

export const Board = new class {
	init(engine) {
		this.engine = engine
		this.walls = {
			top: { x: 0, y: 0, width: this.engine.width, height: 0 },
			right: { x: this.engine.width, y: 0, width: 0, height: this.engine.height },
			bottom: { x: 0, y: this.engine.height, width: this.engine.width, height: 0 },
			left: { x: 0, y: 0, width: 0, height: this.engine.height },
		}
	}

	draw() {
		this.engine.ctx.fillStyle = BOARD_BACKGROUND_COLOR
		this.engine.ctx.fillRect(0, 0, this.engine.width, this.engine.height)

		/* const base = 16
		let exp = 3
		let multi = 4

		let radius = (multi * base) / 2
		for(let i = 0; radius < this.engine.width; i++) {
			

			for() {
				var x = radius * Math.cos(angle);
				var y = radius * Math.sin(angle);
			}
		} */
	}
}()
