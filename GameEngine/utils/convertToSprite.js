const convertSVGElementToImage = (svgElement) =>
	new Promise((resolve, reject) => {
		if(svgElement.tagName !== 'svg') reject('invalid DOM element; Expected tagName "svg"')

		let {width, height} = svgElement.getBBox();
		width *= window.devicePixelRatio;
		height *= window.devicePixelRatio;
		const outerHTML = svgElement.cloneNode(true).outerHTML

		const blob =  new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'})
		const sprite = document.createElement('canvas');
		const image = new Image()

		image.onload = () => {
			sprite.width = width * 2
			sprite.height = height * 2
			let context = sprite.getContext('2d');
			
			context.drawImage(image, 0, 0, width, height);
			
			resolve({ width, height, sprite })
		};
		image.src = (window.URL || window.webkitURL || window).createObjectURL(blob);
	})

const getImageFromUrl = src => new Promise((resolve, reject) => {
	if(typeof src !== 'string') reject('invalid src; Expected to be a string')

	const image = new Image()
	image.onload = () => resolve(image)
	image.src = src
})

export const convertToSprite = (asset) => {
	if(asset?.tagName === 'svg') return convertSVGElementToImage(asset)
	else if(typeof asset === 'string') return getImageFromUrl(asset)
	else throw Error('Unimplemented DOM element to Sprite conversion')
}

