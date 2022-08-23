import { createEvent } from "./createEvent.js"

let holdInterval = null

const DEFINITION_OF_CLICK = ['pointerdown', 'interval']

export const controllerEvent = createEvent('controller', {
	source: undefined,
	isClick: false,
}, {
	onDispatch(n) {
		if(n.source === 'pointerdown')
			holdInterval = setInterval(() => {
				controllerEvent.dispatch({
					source: 'interval'
				})
			}, 1e3/3)
		if(n.source === 'pointerup') clearInterval(holdInterval)

		n.isClick = DEFINITION_OF_CLICK.includes(n.source)

		n.x = n.x|0
		n.y = n.y|0
		
		return true
	}
})

const dispatch = e => controllerEvent.dispatch({ source: e.type })

document.addEventListener('pointerdown', dispatch, false)
document.addEventListener('pointerup', dispatch, false)
