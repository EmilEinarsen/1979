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
}()
