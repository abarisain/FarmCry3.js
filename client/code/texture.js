function Texture(index, name, imageSrc) {
	this.index = index;
	this.name = name;
	this.image = new Image();
	this.image.src = imageSrc;
}