CrymeEngine.Sound = {
	enabled: true,
	context: null,
	mainOutput: null,
	unsupportedBrowser: false,
	muted: false,
	sounds: {
		wololo: new Sound("wololo", "wololo.wav")
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
			return;
		}
		this.mainOutput = this.context.createGainNode();
		this.mainOutput.gain.value = 1;
		this.mainOutput.connect(this.context.destination);
	},
	load: function () {
		if(this.unsupportedBrowser)
			return;
		var buffersList = Object.keys(this.sounds);
		totalLoadingCount += buffersList.length;
		buffersList.forEach((function (bufferName) {
			var request = new XMLHttpRequest();
			request.open('GET', 'src/sounds/' + this.sounds[bufferName].src, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = (function() {
				this.context.decodeAudioData(request.response, function(buffer) {
					CrymeEngine.Sound.sounds[bufferName].initWithBuffer(buffer);
					currentLoadingCount++;
				}, function () {
					console.log("SoundEngine - Error while loading " + bufferName);
				});
			}).bind(this);
			request.send();
		}).bind(this));
	},
	/**
	 * Toggles mute, except if you force the state
	 * @param {boolean} forceState
	 */
	mute: function (forceState) {
		if(typeof forceState != 'undefined') {
			this.muted = forceState ? true : false; // Sanitize the type
		} else {
			this.muted = !this.muted;
		}
		this.mainOutput.gain.value = this.muted ? 0 : 1;
	}
}