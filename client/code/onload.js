window.onload = function () {
	if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
		isIOS = true;
		CE.Sound.isAudioUnlocked = false;
	}
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


	var bfOutfaderValue = 1;
	bfOutfader = function() {
		bfOutfaderValue -= 0.01;
		document.querySelector("#bf-audio").volume = Math.max(0, bfOutfaderValue);
		if(bfOutfaderValue > 0) {
			setTimeout(bfOutfader, 50);
		} else {
			document.querySelector("#bf-audio").pause();
		}
	}

	var bfMenuOutfaderValue = 1;
	bfMenuOutfader = function() {
		bfMenuOutfaderValue -= 0.1;
		document.querySelector("#login_menu_bg").style.opacity = Math.max(0, bfMenuOutfaderValue);
		if(bfMenuOutfaderValue > 0) {
			setTimeout(bfMenuOutfader, 50);
		} else {
			document.querySelector("#login").removeChild(document.querySelector("#login_menu_bg"));
		}
	}
};