/*classe de dessin pour permettre de dessiner absolument tout et n'importe quel objet du moment qu'il est sur la map*/
function TileItem(image, x, y, centerX, centerY, reflected) {
	this.image = image;
	this.reflected = reflected && reflectActivated ;
	this.x = x;
	this.y = y;
	this.centerX = centerX;
	this.centerY = centerY;
}