CrymeEngine.sound = {
	enabled: true,
	context: null,
	unsupportedBrowser: false,
	sounds: {
		wololo: "wololo.wav"
	},
	init: function () {
		if (typeof AudioContext !== "undefined") {
			this.context = new AudioContext();
		} else if (typeof webkitAudioContext !== "undefined") {
			this.context = new webkitAudioContext();
		} else {
			this.unsupportedBrowser = true;
			this.enabled = false;
			console.log('SoundEngine - AudioContext not supported, disabling');
		}
	},
	load: function () {
		if(this.unsupportedBrowser)
			return;
		var buffersList = Object.keys(this.sounds);
		totalLoadingCount += buffersList.length;
		buffersList.forEach((function (bufferName) {
			this.sounds[bufferName] = new Sound(bufferName, this.sounds[bufferName]);
			var request = new XMLHttpRequest();
			request.open('GET', 'src/sounds/' + this.sounds[bufferName].src, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = (function() {
				this.context.decodeAudioData(request.response, function(buffer) {
					CrymeEngine.sound.sounds[bufferName].data = buffer;
					currentLoadingCount++;
				}, function () {
					console.log("SoundEngine - Error while loading " + bufferName);
				});
			}).bind(this);
			request.send();
		}).bind(this));
	}
}