import { SHOTS_POOL_SIZE } from "../../utils/constants.js"
import { Shot } from "./Shot.js"

export const ShotsPool = new class {
	init(engine) {
		this.engine = engine
		this.shots = Array.from({ length: SHOTS_POOL_SIZE }).map(() => new Shot())
	}

	create({ pos, vel }) {
		const available = this.shots.find(s => !s.active)
		if(!available) return
		available.init({
			pos: pos,
			vel: vel,
		})
	}

	update() {
		this.shots.forEach(p => p.update())
	}

	draw() {
		this.shots.forEach(p => p.draw(this.engine.ctx))
	}

	reset() {
		this.shots.forEach(p => p.reset())
	}
}()