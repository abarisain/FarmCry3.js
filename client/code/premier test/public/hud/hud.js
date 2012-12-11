var texHudList = ['life', 'time', 'popup', 'inventory'];
var texHud = [];

var hud = {
	drawHud: function () {
		for (var i = 0; i < hudElements.length; i++) {
			hudElements[i].drawItem(texHud);
		}
	}
};

function LoadHud() {
	totalLoadingCount += texHudList.length;
	LoadTexHud();
}

function LoadTexHud() {
	for (var i = 0; i < texHudList.length; i++) {
		var texture = new Texture(i, texHudList[i].image, 'src/hud/' + texHudList[i] + '.png');
		texture.image.onload = function () {
			texHud.push(this);
			currentLoadingCount++;
		};
	}
}