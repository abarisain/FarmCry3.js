CrymeEngine.Sound = {
	enabled: true,
	context: null,
	mainOutput: null,
	unsupportedBrowser: false,
	muted: false,
	isAudioUnlocked: true,
	sounds: {
		wololo: new Sound("wololo", "wololo.wav"),
		ambiant: {
			rain: new Sound("ambiant/rain", "ambiant/rain.wav", true, true),
			thunder: new Sound("ambiant/thunder", "ambiant/thunder.wav", true, 0)
		},
		action: {
			buy_building: new Sound("action/buy_building", "action/buy_building.wav"),
			buy_crop: new Sound("action/buy_crop", "action/buy_crop.wav"),
			fertilize: new Sound("action/fertilize", "action/fertilize.wav"),
			sell: new Sound("action/sell", "action/sell.wav"),
			waters: new Sound("action/waters", "action/waters.wav")
		},
		music: {
			fight: new Sound("music/fight", "music/fight.mp3")
		}
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
		if (this.unsupportedBrowser)
			return;
		this.loadLiteral(this.sounds);
	},
	loadLiteral: function (literal) {
		var buffersList = Object.keys(literal);
		buffersList.forEach((function (bufferName) {
			var target = literal[bufferName];
			// Not a perfect check but good enough for us, we just need to know if it's not a Sound
			if (target != null && Object.getPrototypeOf(target) == Object.prototype) {
				// Recursive loading
				this.loadLiteral(target);
				return;
			}
			totalLoadingCount++;
			var request = new XMLHttpRequest();
			request.open('GET', 'src/sounds/' + target.src, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = (function () {
				this.context.decodeAudioData(request.response, function (buffer) {
					target.initWithBuffer(buffer);
					currentLoadingCount++;
				}, function (err) {
					console.log("SoundEngine - Error while loading " + bufferName);
					console.log(err);
					if (CE.Sound.enabled) {
						console.log("SoundEngine - Sound disabled");
						CE.Sound.unsupportedBrowser = true;
						CE.Sound.enabled = false;
					}
					currentLoadingCount++;
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
		if (typeof forceState != 'undefined') {
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
		if (this.context != null && !this.isAudioUnlocked) {
			console.log("Unlocking iOS audio");
			var buffer = this.context.createBuffer(1, 1, 22050);
			var source = this.context.createBufferSource();
			if (!source.start)
				source.start = source.noteOn;
			source.buffer = buffer;

			// Connect to output (your speakers)
			source.connect(this.context.destination);

			// Play the file
			source.start(0);

			CE.Sound.isAudioUnlocked = true; // Assume unlocked
			// By checking the play state after some time, we know if we're really unlocked
			setTimeout(function () {
				if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
					CE.Sound.isAudioUnlocked = true;
				} else {
					CE.Sound.isAudioUnlocked = false;
				}
				source.disconnect();
			}, 0);
		}
	}
}