window.onload = function () {
	document.querySelector("#bf-audio").addEventListener("canplaythrough", function () {
		document.querySelector("body").removeChild(document.querySelector("#wait"));
	}, false);
	initLogin();
	CrymeEngine.hud.chat.init();
	document.addEventListener("touchmove", function(event) {
		event.preventDefault();
	});
};