const convertSVGElementToImage = (svgElement) => {
	if(svgElement.tagName !== 'svg') throw Error('invalid DOM element; Expected tagName "svg"')

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
 	};
	image.src = (window.URL || window.webkitURL || window).createObjectURL(blob);

	return { width, height, sprite }
}

const getImageFromUrl = src => {
	if(typeof src !== 'string') throw Error('invalid src; Expected to be a string')

	const image = new Image()
	image.src = src

	return image
}

export const convertToSprite = (asset) => {
	if(asset?.tagName === 'svg') return convertSVGElementToImage(asset)
	else if(typeof asset === 'string') return getImageFromUrl(asset)
	else throw Error('Unimplemented DOM element to Sprite conversion')
}

