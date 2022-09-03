import { BOARD_BACKGROUND_COLOR, BOARD_DOT_COLOR } from "./utils/constants.js"

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
		this.engine.ctx.save()

		// clear background
		this.engine.ctx.fillStyle = BOARD_BACKGROUND_COLOR
		this.engine.ctx.fillRect(0, 0, this.engine.width, this.engine.height)

		// draw dotted radiuses
		this.engine.ctx.translate(this.engine.width/2, this.engine.height/2)
		const dotSize = 2
		const distanceBetweenDots = 4;
		
		const edge = Math.max(this.engine.width, this.engine.height) / 2 + 100
		const base = 16
		let exp = 3
		let multi = 4

		let radius = 0
		while(radius < edge) {
			radius = (multi * base) / 2
			const n = Math.ceil((radius / distanceBetweenDots) * 100) / 100;
			const alpha = (Math.PI * 2) / n;

			for(let i = 0; i < n; i++) {
				const theta = alpha * i;
				const point = {
					x: Math.cos(theta) * radius,
					y: Math.sin(theta) * radius
				};

				this.engine.ctx.fillStyle = BOARD_DOT_COLOR
				this.engine.ctx.fillRect(point.x, point.y, dotSize, dotSize);
			}

			exp++;
			multi += exp;
		}

		this.engine.ctx.restore()
	}
}()
