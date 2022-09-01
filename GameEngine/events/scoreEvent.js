import { createEvent } from "./createEvent.js";

const getDefault = () => ({
	current: 0,
	highest: +window.localStorage.getItem('highestScore') || 0,
	isHighScore: false,
	reset: false
})

export const scoreEvent = createEvent('score', getDefault(), {
	onDispatch(n, p) {
		n.current = p.current + (n.award??0)
		n.reset && (n.current = 0)
		n.highest = p.highest
		n.isHighScore = n.highest < n.current
		n.isHighScore && (n.highest = n.current)
		return true
	}
})

scoreEvent.subscribe(score => {
	score.isHighScore && window.localStorage.setItem('maxScore', score.max)
})
