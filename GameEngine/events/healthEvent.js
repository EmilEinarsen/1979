import { createEvent } from "./createEvent.js";

const getDefault = () => ({
	min: 0,
	current: 3,
	max: 3,
	isDead: false,
	isReset: false
})

export const healthEvent = createEvent('health', getDefault(), {
	onDispatch(n, p) {
		Object.assign(n, {
			min: p.min,
			max: p.max
		})
		n.current = n.reset ? n.max : p.current-1
		n.isDead = n.min === n.current
		return true
	}
})
