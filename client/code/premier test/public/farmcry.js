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
	var canvas  = document.querySelector('#canvas');
	var context = canvas.getContext('2d');

	canvas.width = document.width;
	canvas.height = document.height;

	context.font = "bold 22pt Calibri,Geneva,Arial";
	context.fillStyle = "#fff";


	var house = new Image();
	house.src = 'src/buildings/barn_reflect.png';

	house.onload = Draw(0);

	function Draw(debut) {
		context.save();
		context.clearRect(0, 0, document.width, document.height);



		context.fillText(Math.round(debut / 60) + ' sec', 20, 20);

		for (var i = 0; i < 200; i++){
			context.drawImage(house, i*3 + debut, i*2);
		}

		context.restore();

		window.requestAnimFrame(function() { Draw((debut+1)%600) });
	}
};