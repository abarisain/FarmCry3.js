/**
 * Created with IntelliJ IDEA.
 * User: Guigui
 * Date: 08/12/12
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */

var tileList = ['grass_1', 'grass_2', 'leave', 'mountain', 'rock', 'soil', 'water'];//je précise qu'ici il faudra que je fasse commencer grass à 0
var tiles = [];

var borderList = ['border_0', 'border_1', 'barrier_0', 'barrier_1', 'barrier_2', 'barrier_3'];
var borders = [];

var totalLoadingCount = 0, currentLoadingCount = 0;
var loadingComplete = false;

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
	var mousePosition = {
		x: 0,
		y: 0
	};

	/*initialisation du canvas
	* indispensable sinon le canvas fait 150px de large*/
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	context.font = "bold 16pt Calibri,Geneva,Arial";

	/*chargement des ressources*/
	InitLoading();
	LoadTiles();
	LoadBorders();
	DrawLoading();


	function DrawLoading() {
		context.save();
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		if(currentLoadingCount != totalLoadingCount) {
			context.fillStyle = "#fff";
			context.fillText("Loading...", canvasWidth / 2 - 30, 260);

			//affichage de la barre de progression
			context.fillRect(canvasWidth / 2 - 202, 300, 404, 20);

			context.fillStyle = "rgba(210, 210, 210, 1)";
			context.fillRect(canvasWidth / 2 - 200, 302, 200 * (currentLoadingCount / totalLoadingCount), 16);
			context.restore();
			window.requestAnimFrame(function() { DrawLoading() });
		}
		else
		{
			loadingComplete = true;
			window.requestAnimFrame(function() { Draw() });
		}

	}



	function Draw() {
		if(loadingComplete)
		{
			context.save();
			context.clearRect(0, 0, canvasWidth, canvasHeight);
			context.fillStyle = "#fff";
			for (var line = 0; line < lineSize; line++) {


				for (var col = 0; col < colSize; col++){
					context.drawImage(tiles[Math.round((line+col)/3)%tiles.length], cameraPosition.x + col*tileWidth - (tileWidth) * line, cameraPosition.y + (line - lineSize) * tileHeight + (tileHeight) * col);
					//affichage de la bordure
					if (col == colSize -1)
					{
						context.drawImage(borders[1], cameraPosition.x + (col)*tileWidth - (tileWidth) * line, cameraPosition.y + (line - lineSize + 1) * tileHeight + (tileHeight) * col + 1);
					}
					if (line == 0) {
						context.fillText('col : ' + col, cameraPosition.x + col*tileWidth - (tileWidth) * (line-1), cameraPosition.y + (line - lineSize + 1) * tileHeight + (tileHeight) * col);
					}
					else if (line == lineSize - 1)
					{
						context.drawImage(borders[0], cameraPosition.x + col*tileWidth - (tileWidth) * (line), cameraPosition.y + (line - lineSize + 1) * tileHeight + (tileHeight) * (col) + 1);
					}
				}
				context.fillText('line : ' + line, cameraPosition.x - (tileWidth) * (line - 0.5), cameraPosition.y + (line - lineSize + 1) * tileHeight + 1);
			}
		context.fillStyle = "#fff";
		context.fillText("x : " + cameraPosition.x + ", y : " + cameraPosition.y, 20, 20);
		context.restore()
		;}
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

function InitLoading() {
	totalLoadingCount += tileList.length;
	totalLoadingCount += borderList.length;
}

function LoadTiles() {
	for (var i = 0; i < tileList.length; i++)
	{
		var tile = new Image();
		tile.src = 'src/tiles/' + tileList[i] + '.png';
		tile.onload = function () {
			tiles.push(this);
			currentLoadingCount++;
		};
	}
}

function LoadBorders() {
	for (var i = 0; i < borderList.length; i++)
	{
		var tile = new Image();
		tile.src = 'src/borders/' + borderList[i] + '.png';
		tile.onload = function () {
			borders.push(this);
			currentLoadingCount++;
		};
	}
}