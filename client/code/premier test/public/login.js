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

var initLogin = function () {
	loginEmailField = document.querySelector("#login_email");
	loginPasswordField = document.querySelector("#login_password");
	loginRememberCheckbox = document.querySelector("#login_remember_me");
	loginPanel = document.querySelector("#login_panel");
	loadingPanel = document.querySelector("#loading_panel");
	loadingProgressSpan = document.querySelector("#loading_progress span");

	//Check if local storage is supported
	loginEmailField.focus();
	if (supports_html5_storage()) {
		//Load the email from local storage
		loginRememberCheckbox.checked = true;
		if (typeof localStorage['email'] != 'undefined') {
			loginEmailField.value = localStorage['email'];
			loginPasswordField.focus();
		}
	} else {
		loginRememberCheckbox.style.visibility = "hidden";
		document.querySelector("#login_remember_me_label").style.visibility = "hidden";
	}

	networkEngine.onLoginFailed = function (error) {
		loginPanel.style.visibility = "visible";
		loadingPanel.style.visibility = "hidden";
		loginEmailField.focus();
		alert(error);
		//Reload the page because of a "bug" : 2nd connection will not work
		window.location.reload();
	};

	networkEngine.onLoadingFinished = function () {
		document.querySelector("body").removeChild(document.querySelector("#login"));
		loadingPanel.style.display = "none";
	};

	document.querySelector("#login_connect_button").onclick = function () {
		if (supports_html5_storage()) {
			if (loginRememberCheckbox.checked) {
				localStorage['email'] = loginEmailField.value;
			} else {
				localStorage.removeItem('email');
			}
		}
		loginPanel.style.visibility = "hidden";
		loadingPanel.style.visibility = "visible";
		setTimeout(function () {
			networkEngine.init(document.querySelector("#login_server").value,
				loginEmailField.value, loginPasswordField.value);
		}, 1000);

		//document.querySelector("body").removeChild(document.querySelector("#login"));
		return true;
	};
};