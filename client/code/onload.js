window.onload = function () {
	initLogin();
	CrymeEngine.hud.chat.init();
	document.addEventListener("touchmove", function(event) {
		event.preventDefault();
	});
};