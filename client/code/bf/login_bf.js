/*
 * Oh oui youpi
 * Dansons la carioca
 * C'est bien, faisez tous comme moi
 * http://www.youtube.com/watch?gl=FR&hl=fr&v=MQqKNU1OHgI
 */

function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

//IE localStorage failure on file:// workaround
window.localStorageAlias = window.localStorage;
if (document.all && !window.localStorage) {
	window.localStorageAlias = {};
	window.localStorageAlias.removeItem = function () {
	};
}

function setProgressbarValue(progressSpan, progress) {
	progressSpan.style.width = progress * 100 + "%";
}

var initLogin = function () {
	loginEmailField = document.querySelector("#login_email");
	loginPasswordField = document.querySelector("#login_password");
	loginRememberCheckbox = document.querySelector("#login_remember_me");
	loginPanel = document.querySelector("#login_panel");
	loadingPanel = document.querySelector("#loading_panel");
	loadingProgressSpan = document.querySelector("#loading_progress span");
	var loginConnectButton = document.querySelector("#login_connect_button");
	var startLogin = function () {
		window.onkeyup = null;
		if (supports_html5_storage()) {
			if (loginRememberCheckbox.checked) {
				localStorageAlias['email'] = loginEmailField.value;
			} else {
				localStorageAlias.removeItem('email');
			}
		}
		loginPanel.style.display = "none";
		loadingPanel.style.visibility = "visible";
		document.querySelector("body").removeChild(document.querySelector("#bf-menu-audio"));
		document.querySelector("#bf-audio").play();
		document.querySelector("#login_game_title").style.display = "none";
		//Fake a small login delay, remove this later
		setTimeout(function () {
			setProgressbarValue(loadingProgressSpan, 1);
			bfMenuOutfader();
			setTimeout(function () {
				networkEngine.init(document.querySelector("#login_server").value,
					loginEmailField.value, loginPasswordField.value);
			}, 500);
		}, 2000);
		return true;
	};

	if(isIOS) {
		// Remove animated stripes on iOS (too slow)
		document.querySelector("#loading_progress").classList.remove("stripes-animated");
	}

    document.querySelector("#login_server").value = new String(document.location).replace("index_bf.html", "");
	//Check if local storage is supported
	loginEmailField.focus();
	if (supports_html5_storage()) {
		//Load the email from local storage
		loginRememberCheckbox.style.visibility = "visible";
		document.querySelector("#login_remember_me_label").style.visibility = "visible";
		loginRememberCheckbox.checked = true;
		if (typeof localStorageAlias['email'] != 'undefined') {
			loginEmailField.value = localStorageAlias['email'];
			loginPasswordField.focus();
		}
	} else {
		loginRememberCheckbox.style.visibility = "hidden";
		document.querySelector("#login_remember_me_label").style.visibility = "hidden";
	}

	window.onkeyup = function (event) {
		if (event.keyCode == 13) { //Enter
			startLogin();
		}
	};

	loginConnectButton.setAttribute("class", loginConnectButton.getAttribute("class").replace("disabled", ""));

	networkEngine.onLoginFailed = function (error) {
		loginPanel.style.display = "";
		loadingPanel.style.visibility = "hidden";
		loginEmailField.focus();
		alert(error);
		//Reload the page because of a "bug" : 2nd connection will not work
		window.location.reload();
	};

	networkEngine.onLoadingStarted = function () {
		setProgressbarValue(loadingProgressSpan, 0);
	};

	networkEngine.onLoadingProgress = function (current, total) {
		setProgressbarValue(loadingProgressSpan, 0.1*(current / total));
	};

	networkEngine.onLoadingFinished = function () {
		//loadingPanel.style.zIndex = -1;
		//document.querySelector("#login").style.zIndex = -2;
		//setProgressbarValue(loadingProgressSpan, 1);
	};

	var progressFake = 0;

	networkEngine.onLoadingAnimationFinished = function () {
		if(progressFake >= 1.1) {
			loadingPanel.style.display = "none";
			document.querySelector("body").removeChild(document.querySelector("#login"));
			if(isIOS) {
				document.querySelector("body").removeChild(document.querySelector("#bf-audio"));
			} else {
				bfOutfader();
			}
		} else {
			progressFake += 0.1;
			setProgressbarValue(loadingProgressSpan, 0.9 + Math.min(progressFake, 0.1));
			setTimeout(networkEngine.onLoadingAnimationFinished, 500);
		}
	};

	loginConnectButton.onclick = startLogin;

	document.querySelector("#disable_login_music_button").onclick = function () {
		document.querySelector("#bf-menu-audio").src = "";
		return true;
	};
};