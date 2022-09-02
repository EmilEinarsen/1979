import { ShotsPool } from "../Player/Shot/ShotPool.js"
import { ASTROID_COLORS } from "../utils/constants.js"
import { Vec } from "../utils/Vec.js"
import { Meteor } from "./Meteor.js"

export const MeteorPool = new class {
	init(engine) {
		this.engine = engine
		this.meteors = []
	}

	getNextSprite() {
		if(!this.engine.configuration?.assets?.astroids) return

		const index = (() => {
			let indices = Array.from({ length: 10 }, () => 0)
			for(const meteor of this.meteors) meteor.sprite && indices[meteor.sprite.index]++
			return indices.reduce((p, c, i) => p[0] < c ? p : [c, i], [Infinity, Infinity])[1]
		})()

		const color = (() => {
			Object.values(ASTROID_COLORS)
			const colors = Object.values(ASTROID_COLORS)
			return colors[Math.round((colors.length-1) * Math.random())]
		} )()

		return { 
			index, 
			color,
			image: this.engine.configuration.assets.astroids[index],
		}
	}

	create({ pos, vel, rotVel, type }) {
		let available = this.meteors.find(s => !s.active)
		if(!available) available = this.meteors[this.meteors.push(new Meteor())-1]
		available.init({ pos, vel, rotVel, type, sprite: this.getNextSprite() })
	}

	update() {
		const collision = []
		for(const shot of ShotsPool.shots)
			for(const meteor of this.meteors)
				if(Math.sqrt((shot.head.y - meteor.pos.y)**2 + (shot.head.x - meteor.pos.x)**2) <= meteor.radius)
					collision.push({ shot, meteor })

		collision.forEach(({ shot, meteor }) => {
			shot.hit()
			const debris = meteor.hit()

			if(!debris) return
			for(let i = debris.numberOfChildren; 0 < i; i--)
				this.create({
					pos: debris.pos,
					vel: new Vec(Math.random() * 2 - 1, Math.random() * 2 - 1),
					rotVel: (Math.PI * 4 * Math.random() - Math.PI * 2) / 700,
					type: debris.type
				})
		})
		
		this.meteors.forEach(m => m.update())
	}

	draw() {
		this.meteors.forEach(m => m.draw(this.engine.ctx))
	}

	reset() {
		this.meteors.forEach(m => m.reset())
	}
}()