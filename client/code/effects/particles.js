function ParticlesEmitter(sprite, x, y, growth, amountMax, lifetime) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.scatteringX = 0;//dispersion des particles sur l'axe x
	this.scatteringY = 0;//dispersion des particles sur l'axe y
	//this.progress = 0;//pour l'animation
	this.amount = 0;
	this.amountMax = amountMax;
	this.lifetime = lifetime;
	this.lifetimeMax = lifetime;
	this.growth = growth;//nombre de particule a ajouter par frame
	this.particles = [];
	this.started = false;
	this.angle = 0;//l'angle dans lequel il faut balancer les particules en radian (au centre du delta d'angle)
	this.angleDelta = 0;//le total d'angle dans lequel on peut balancer des particules en radian
	this.speed = 0;
}

ParticlesEmitter.prototype = {
	constructor: ParticlesEmitter,
	start: function (speed, angle, angleDelta) {
		this.speed = speed;
		this.angle = angle;
		this.particles = [];
		this.angleDelta = angleDelta;
		this.amount = 0;
		this.started = true;
		this.lifetime = this.lifetimeMax;
	},
	update: function () {
		if (this.started) {
			if (this.amount < this.amountMax) {
				var newParticleCount = Math.min(this.amountMax - this.amount, this.growth);
				if (this.growth >= 1) {
					for (var i = 0; i < newParticleCount; i++) {
						var particle = new Particle(this.scatteringX, this.scatteringY, this.speed, this.angle, this.angleDelta, this.lifetime);
						this.particles.push(particle);
						this.amount++;
					}
				} else {
					if (Math.floor(this.amount + this.growth) > Math.floor(this.amount)) {
						var particle = new Particle(this.scatteringX, this.scatteringY, this.speed, this.angle, this.angleDelta, this.lifetime);
						this.particles.push(particle);
					}
					this.amount += this.growth;

				}
			}
			if (this.particles.length == 0 && this.amount == this.amountMax) {
				this.started = false;
				return false;
			}
			for (i = 0; i < this.particles.length; i++) {
				if (!this.particles[i].update())//if particle is dead
				{
					//todo
				}
			}
			return true;
		} else {
			return true;
		}
	},
	draw: function () {
		CE.canvas.animation.context.translate(this.x, this.y);
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].draw(this.sprite);
		}
		CE.canvas.animation.context.translate(-this.x, -this.y);
	}
};

function Particle(scatteringX, scatteringY, speed, angle, angleDelta, lifetime) {
	this.x = Math.random() * scatteringX;
	this.y = Math.random() * scatteringY;
	this.angle = angle + Math.random() * angleDelta - angleDelta / 2;
	this.speedX = Math.cos(this.angle) * speed;
	this.speedY = Math.sin(this.angle) * speed;
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
	draw: function (sprite) {
		CE.canvas.animation.context.drawImage(sprite.image, this.x - sprite.centerX, this.y - sprite.centerY);
	}
};