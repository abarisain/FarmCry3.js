function setProgressbarValue(progressSpan, progress) {
	progressSpan.style.width = progress * 100 + "%";
}

var initRegister = function () {
	var registerButton = document.querySelector("#register_connect_button");
	var startRegister = function () {
		window.onkeyup = null;

		var loginPanel = document.querySelector("#register_panel");
		var loadingPanel = document.querySelector("#loading_panel");
		loginPanel.style.display = "none";
		loadingPanel.style.visibility = "visible";

		var registerData = {
			nickname: document.querySelector("#register_nickname").value,
			email: document.querySelector("#register_email").value,
			password: document.querySelector("#register_password").value,
			difficulty: document.querySelector("#register_difficulty").value
		}

		var socket = io.connect((new String(document.location)).replace("register.html", ""));

		socket.on('connect', function () {
			socket.emit("auth.register", registerData, function (data) {
				if (typeof data.result != 'undefined') {
					if (data.result == "ok") {
						alert("You have been registered ! Welcome :)");
						socket.disconnect();
						document.location = (new String(document.location)).replace("register.html", "");
					} else if (data.result == "fail") {
						alert("Error while registering. The page will reload (because of a bug that could not be solved for 1.0)."
						 + "Sorry for the inconvenience of entering your information again.\n" + data.message);
						socket.disconnect();
						document.location.reload();
					}
				}
			});
		});
		return true;
	};

	window.onkeyup = function (event) {
		if (event.keyCode == 13) { //Enter
			startRegister();
		}
	};

	registerButton.setAttribute("class", registerButton.getAttribute("class").replace("disabled", ""));

	registerButton.onclick = startRegister;
};

window.onload = function () {
	initRegister();
};