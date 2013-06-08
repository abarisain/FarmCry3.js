CrymeEngine.Sound = {
	enabled: true,
	context: null,
	mainOutput: null,
	unsupportedBrowser: false,
	muted: false,
	isAudioUnlocked: true,
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
	},
	/**
	 * For iOS
	 */
	unlockAudio: function () {
		// Thanks http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
		if(this.context != null && !this.isAudioUnlocked) {
			console.log("Unlocking iOS audio");
			var buffer = this.context.createBuffer(1, 1, 22050);
			var source = this.context.createBufferSource();
			if(!source.start)
				source.start = source.noteOn;
			source.buffer = buffer;

			// Connect to output (your speakers)
			source.connect(this.context.destination);

			// Play the file
			source.start(0);

			CE.Sound.isAudioUnlocked = true; // Assume unlocked
			// By checking the play state after some time, we know if we're really unlocked
			setTimeout(function() {
				if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
					CE.Sound.isAudioUnlocked = true;
				} else {
					CE.Sound.isAudioUnlocked = false;
				}
				source.disconnect();
			}, 0);
		}
	}
}