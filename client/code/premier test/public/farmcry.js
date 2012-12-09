/**
 * Created with IntelliJ IDEA.
 * User: Guigui
 * Date: 08/12/12
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame       || // La forme standardisée
		window.webkitRequestAnimationFrame || // Pour Chrome et Safari
		window.mozRequestAnimationFrame    || // Pour Firefox
		window.oRequestAnimationFrame      || // Pour Opera
		window.msRequestAnimationFrame     || // Pour Internet Explorer
		function(callback){                   // Pour les élèves du dernier rang
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.onload = function() {
	/*initialisation* du moteur*/
	var canvas  = document.querySelector('#canvas');
	var context = canvas.getContext('2d');

	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;

	var tileWidth = 122;
	var tileHeight = 86;

	var lineSize = Math.round(canvasHeight / tileHeight + 1);
	var colSize = Math.round(canvasWidth / tileWidth + 1);

	var moveMap = false;
	var cameraPosition = {
		x: 0,
		y: 0
	};
	var mousePosition = { x: 0, y: 0 };

	/*initialisation du canvas
	* indispensable sinon le canvas fait 150px de large*/
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;


	context.font = "bold 22pt Calibri,Geneva,Arial";
	context.fillStyle = "#fff";

	/*chargement des ressources*/
	var tileList = ['grass_1', 'grass_2', 'leave', 'mountain', 'rock', 'soil', 'water'];

	var tileLoadCount = 0;
	var tiles = [];
	for (var i = 0; i < tileList.length; i++)
	{
		var tile = new Image();
		tile.src = 'src/tiles/' + tileList[i] + '.png';

		tile.onload = function () {
			tiles.push(this);
			tileLoadCount++;
			if (tileLoadCount == tileList.length)//pour être sur d'avoir tout chargé
			{
				Draw();
			}
		};

	}

	function Draw() {
		context.save();
		context.clearRect(0, 0, document.width, document.height);



		for (var line = 0; line < lineSize; line++) {
			for (var col = 0; col < colSize; col++){
				context.drawImage(tiles[(line+col)%tiles.length], cameraPosition.x + col*tileWidth - (tileWidth) * line, cameraPosition.y + (line - lineSize) * tileHeight + (tileHeight) * col);
			}
		}

		context.fillText("x : " + cameraPosition.x + ", y : " + cameraPosition.y, 78, 92);

		context.restore();

		//window.requestAnimFrame(function() { Draw((debut+1)%600) });
	}

	canvas.onmousedown = function (event) {
		//positionnement de la souris
		mousePosition.x = event.pageX - this.offsetLeft;
		mousePosition.y = event.pageY - this.offsetTop;
		//activation du deplacement de la map
		moveMap = true;
	};

	canvas.onmouseup = function () {
		moveMap = false;
	};

	canvas.onmousemove = function (event) {
		if (moveMap)
		{
			event = event || window.event;

			//deplacement de la caméra en fonction de la dernière position de la souris
			cameraPosition.x += (event.pageX - this.offsetLeft - mousePosition.x);
			cameraPosition.y += (event.pageY - this.offsetTop - mousePosition.y);

			//pour se souvenir de la dernière position de la souris
			mousePosition.x = event.pageX - this.offsetLeft;
			mousePosition.y = event.pageY - this.offsetTop;

			window.requestAnimFrame(function() { Draw() });
		}
	};
};

