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

window.onload = function () {
	loginEmailField = document.querySelector("#login_email");
	loginPasswordField = document.querySelector("#login_password");
	loginRememberCheckbox = document.querySelector("#login_remember_me");
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

	document.querySelector("#login_connect_button").onclick = function () {
		if (supports_html5_storage()) {
			if (loginRememberCheckbox.checked) {
				localStorage['email'] = loginEmailField.value;
			} else {
				localStorage.removeItem('email');
			}
		}
		networkEngine.init(document.querySelector("#login_server").value,
			loginEmailField.value, loginPasswordField.value);
		document.querySelector("body").removeChild(document.querySelector("#login"));
		return true;
	};
	//networkEngine.init('http://localhost:8080', "dreamteam69@gmail.com", "prout");
};