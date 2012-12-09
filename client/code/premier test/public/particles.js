var particleEmitters = {
	emitters: [],
	update: function () {
		for (var i = 0; i < this.emitters.length; i++) {
			if (!this.emitters[i].update())//if emitter is dead
			{
				this.emitters.splice(i);
				i--;
			}
		}
	},
	draw: function () {
		context.restore();
		context.fillText("particules en cours...", 20, 40);
		for (var i = 0; i < this.emitters[i].length; i++) {
			this.emitters[i].draw();
		}
	},
	isAlive: function () {
		return this.emitters.length > 0;
	}
};

function ParticlesEmitter(type, x, y) {
	this.type = type;
	this.x = x;
	this.y = y;
	//this.progress = 0;//pour l'animation
	this.amount = 10;
	this.amountMax = 0;
	this.lifetime = 100;
	this.growth = 5;//nombre de particule a ajouter par frame
	this.particles = [];
}

ParticlesEmitter.prototype = {
	update: function () {
		if (this.amount < this.amountMax) {
			var newParticleCount = Math.min(this.amountMax - this.amount, this.growth);
			for (var i = 0; i < newParticleCount; i++) {
				var particle = new Particle(0, 0, 0, -3, this.lifetime);
				this.particles.push(particle);
				this.amount++;
			}
		}
		if (this.particles.length == 0 && this.amount == this.amountMax) {
			return false;
		}
		for (i = 0; i < this.amountMax; i++) {
			if (!this.particles[i].update())//if particle is dead
			{
				//todo
			}
		}
		return true;
	},
	draw: function () {
		context.translate(this.x, this.y);
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].draw(this.type);
		}
		context.translate(-this.x, -this.y);
	}
};

function Particle(x, y, speedX, speedY, lifetime) {
	this.x = x;
	this.y = y;
	this.speedX = speedX;
	this.speedY = speedY;
	this.lifetime = lifetime;
	this.alpha = 1;
}

Particle.prototype = {
	update: function () {
		this.lifetime--;
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.lifetime < 10) {
			this.alpha = this.lifetime / 10;
		}
		if (this.lifetime <= 0) {
			return false;
		}
		return true;
	},
	draw: function (type) {
		context.globalAlpha = this.particles[i].alpha;
		context.drawImage(texParticles[type], this.x, this.y);
	}
};