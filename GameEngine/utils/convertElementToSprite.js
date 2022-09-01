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

export const convertElementToSprite = (element) => {
	console.dir(element)
	if(element.tagName === 'svg') return convertSVGElementToImage(element)
	else throw Error('Unimplemented DOM element to Sprite conversion')
}

