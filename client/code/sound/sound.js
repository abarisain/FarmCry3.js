function Sound(name, src, unique, loop, loopOffset) {
	this.name = name;
	this.src = src;
	this.volume = 1;
	this.mute = false;
	this.buffer = null;
	this.loop = loop || false;
	this.loopOffset = loopOffset || 0;
	this.unique = unique || false; // Can this sound be played many times or must it stop the other instance ?
	this.nodes = {
		buffer: null,
		volume: null
	}
}

Sound.prototype.initWithBuffer = function (buffer) {
	if(!CE.Sound.enabled)
		return;
	if(this.buffer != null) {
		console.log("SoundEngine - Error : Cannot initWithBuffer : Object already has a buffer.");
	}
	this.buffer = buffer;
	this.nodes.volume = CE.Sound.context.createGainNode();
	this.nodes.volume.connect(CE.Sound.mainOutput);
	this.setVolume();
}

Sound.prototype.setupBufferNode = function () {
	this.nodes.buffer = CE.Sound.context.createBufferSource();
	this.nodes.buffer.loop = this.loop;
	this.nodes.buffer.loopStart = this.loopOffset;
	// 1st buffer is the "buffer node", then it's the internal buffer, then it's the buffer we loaded
	this.nodes.buffer.buffer = this.buffer;
	if(!this.nodes.buffer.stop)
		this.nodes.buffer.stop = this.nodes.buffer.noteOff;
	if(!this.nodes.buffer.start)
		this.nodes.buffer.start = this.nodes.buffer.noteOn;
	this.connect();
}

Sound.prototype.setVolume = function (volume) {
	if(!CE.Sound.enabled)
		return;
	if(volume != undefined && volume != null) {
		this.volume = Math.max(0, Math.min(1, volume));
	}
	if(this.nodes.volume != null)
		this.nodes.volume.gain.value = this.mute ? 0 : this.volume;
}

/**
 * @param {boolean} loop
 */
Sound.prototype.setLoop = function (loop) {
	if(!CE.Sound.enabled)
		return;
	this.loop = loop;
	if(this.nodes.buffer != null)
		this.nodes.buffer.loop = this.loop;
}

Sound.prototype.mute = function () {
	if(!CE.Sound.enabled)
		return;
	this.mute = true;
	this.setVolume();
}

Sound.prototype.unmute = function () {
	if(!CE.Sound.enabled)
		return;
	this.mute = false;
	this.setVolume();
}

Sound.prototype.connect = function () {
	if(!CE.Sound.enabled)
		return;
	this.nodes.buffer.connect(this.nodes.volume);
}

Sound.prototype.disconnect = function () {
	if(!CE.Sound.enabled)
		return;
	this.nodes.buffer.disconnect();
}

Sound.prototype.play = function (delay) {
	var ldelay = 0;
	if(delay != undefined && delay != null) {
		ldelay = delay;
	}
	if(CE.Sound.enabled) {
		if(this.nodes.buffer != null && (this.unique || this.loop))
			this.nodes.buffer.stop(0);
		this.setupBufferNode();
		this.nodes.buffer.start(ldelay);
	}
}

Sound.prototype.stop = function (delay) {
	if(!CE.Sound.enabled)
		return;
	var ldelay = 0;
	if(delay != undefined && delay != null) {
		ldelay = delay;
	}
	if(this.nodes.buffer != null) {
		this.nodes.buffer.stop(ldelay);
	}
}