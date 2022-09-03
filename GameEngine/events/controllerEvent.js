import { createEvent } from "./createEvent.js"

let holdInterval = null

const DEFINITION_OF_CLICK = ['pointerdown', 'interval']

const DIRECTION = {
	up: ['ArrowUp', 'w'],
	right: ['ArrowRight', 'd'],
	down: ['ArrowDown', 's'],
	left: ['ArrowLeft', 'a'],
}
const DEFINITION_OF_MOVE = Object.values(DIRECTION).flat()

export const controllerEvent = createEvent('controller', {
	source: undefined,
	isClick: false,
}, {
	onDispatch(n, p) {
		n.move = p.move ?? {}
		if(n.source === 'pointerdown')
			holdInterval = setInterval(() => {
				controllerEvent.dispatch({
					source: 'interval'
				})
			}, 1e3/3)
		if(n.source === 'pointerup') clearInterval(holdInterval)

		n.isClick = DEFINITION_OF_CLICK.includes(n.source)

		if(n.source === 'keydown') {
			if(DEFINITION_OF_MOVE.includes(n.key)) {
				n.move[Object.entries(DIRECTION).find(v => v[1].includes(n.key))[0]] = true
			}
		}
		if(n.source === 'keyup') {
			if(DEFINITION_OF_MOVE.includes(n.key)) {
				n.move[Object.entries(DIRECTION).find(v => v[1].includes(n.key))[0]] = false
			}
		}

		n.x = n.x|0
		n.y = n.y|0
		
		return true
	}
})

const pointerDispatch = e => controllerEvent.dispatch({ source: e.type })
document.addEventListener('pointerdown', pointerDispatch, false)
document.addEventListener('pointerup', pointerDispatch, false)

const keyDispatch = e => controllerEvent.dispatch({ source: e.type, key: e.key })
document.addEventListener('keydown', keyDispatch, false)
document.addEventListener('keyup', keyDispatch, false)
