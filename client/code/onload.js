window.onload = function () {
	if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
		isIOS = true;
		CE.Sound.isAudioUnlocked = false;
	}
	console.log("wat");
	initLogin();
	CrymeEngine.hud.chat.init();
	CrymeEngine.Sound.init();
	document.addEventListener("touchmove", function(event) {
		event.preventDefault();
	});

	window.addEventListener('touchstart', function() {

		// iOS Needs html audio unlocking this way
		if(isIOS && !CE.Sound.isAudioUnlocked) {
			CE.Sound.unlockAudio();
		}

	}, false);
};