export const createEvent = (
	name, 
	defaultDetail,
	options
) => {
	const ref = {
		lastDetail: defaultDetail
	}

	const dispatch = value => {
		value = { ...defaultDetail??null, ...value??null }

		if(options?.onDispatch && !options.onDispatch(value, ref.lastDetail)) return
		
		ref.lastDetail = value
		const event = new CustomEvent(name, { 
			detail: ref.lastDetail,
			cancelable: false,
			bubbles: false 
		})
		return document.dispatchEvent(event)
	}

	const subscribe = fn => {
		const wrapper = e => fn(e.detail)
		document.addEventListener(name, wrapper)
		return () => {
			document.removeEventListener(name, wrapper)
		}
	}

	return Object.assign(() => ref.lastDetail, {
		dispatch,
		subscribe,
	})
}
