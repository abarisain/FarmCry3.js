function ParticlesEmitter(sprite, x, y, growth, amountMax, lifetime, extinctionDuration) {
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
	this.speedDelta = 0;
	this.scaleSpeed = 0;
	this.scale = 1;//taille de reference des elements
	this.scaleDelta = 0;//delta de taille pour chaque element
	this.gravity = 0;
	this.rotation = 1 * Math.PI / 180;
	this.visible = true;
	this.extinctionDuration = extinctionDuration || 10;//to manage alpha extinction
}

ParticlesEmitter.prototype = {
	constructor: ParticlesEmitter,
	/**
	 @param {float} speed
	 @param {float] angle rad
	 	@param {float} angleDelta
	 */
	start: function (speed, speedDelta, angle, angleDelta, scale, scaleDelta, scaleSpeed) {
		this.init(speed, speedDelta, angle, angleDelta, scale, scaleDelta, scaleSpeed);
		this.started = true;
		if (this.amountMax == -2) {
			this.amountMax = -1;
		}//for unlimited particles only
	},
	stop: function () {
		this.amountMax = -2;//for unlimited particles only
	},
	init: function (speed, speedDelta, angle, angleDelta, scale, scaleDelta, scaleSpeed) {
		this.speed = speed;
		this.speedDelta = speedDelta || 0;
		this.angle = angle || 0;
		this.angleDelta = angleDelta || 0;
		this.scale = scale || 1;
		this.scaleDelta = scaleDelta || 0;
		this.scaleSpeed = scaleSpeed || 0;
		this.particles = [];
		this.amount = 0;
		this.lifetime = this.lifetimeMax;
	},
	/*
	 Add another round of particles
	 * */
	additionnalStart: function (amount) {
		this.started = true;
		this.amountMax += amount;
	},
	endEvent: function () {
	},
	update: function () {
		if (this.started) {
			if (this.amount < this.amountMax || this.amountMax == -1) {
				var newParticleCount = 0;
				if (this.amountMax == -1) {
					newParticleCount = this.growth;
				} else {
					newParticleCount = Math.min(this.amountMax - this.amount, this.growth);
				}
				if (this.growth >= 1) {
					for (var i = 0; i < newParticleCount; i++) {
						var particle = new Particle(this.scatteringX, this.scatteringY, this.speed, this.speedDelta,
							this.scale, this.scaleDelta, this.scaleSpeed, this.rotation, this.angle, this.angleDelta, this.lifetime, this.extinctionDuration);
						this.particles.push(particle);
						this.amount++;
					}
				} else {
					if (Math.floor(this.amount + this.growth) > Math.floor(this.amount)) {
						var particle = new Particle(this.scatteringX, this.scatteringY, this.speed, this.speedDelta,
							this.scale, this.scaleDelta, this.scaleSpeed, this.rotation, this.angle, this.angleDelta, this.lifetime, this.extinctionDuration);
						this.particles.push(particle);
					}
					this.amount += this.growth;

				}
			}
			if (this.particles.length == 0 && this.amount >= this.amountMax && this.amountMax != -1) {
				this.started = false;
				this.endEvent();
				return false;
			}
			if (this.visible) {
				for (i = 0; i < this.particles.length; i++) {
					if (!this.particles[i].update(this.gravity))//if particle is dead
					{
						if (this.amountMax == -1) {//for infinite emittor only
							this.amount--;
						}
						this.particles.removeItemAtIndex(i);//enfin on supprime les particules haha
					}
				}
			}
			return true;
		} else {
			return true;
		}
	},
	draw: function (maxAlpha) {
		if (this.visible) {
			CE.canvas.animation.context.translate(this.x, this.y);
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].draw(this.sprite, maxAlpha);
			}
			CE.canvas.animation.context.translate(-this.x, -this.y);
		}
	}
};

function Particle(scatteringX, scatteringY, speed, speedDelta, scale, scaleDelta, scaleSpeed, rotation, angle, angleDelta, lifetime, extinctionDuration) {
	this.x = Math.random() * scatteringX - scatteringX / 2;
	this.y = Math.random() * scatteringY - scatteringY / 2;
	this.scale = scale + Math.random() * scaleDelta - scaleDelta / 2;
	this.angle = angle + Math.random() * angleDelta - angleDelta / 2;
	this.scaleSpeed = scaleSpeed;
	speed = speed + Math.random() * speedDelta - speedDelta / 2;
	this.speedX = Math.cos(this.angle) * speed;
	this.speedY = Math.sin(this.angle) * speed;
	this.lifetime = lifetime;
	this.alpha = 1;
	this.apparitionAlpha = 0;
	this.extinctionDuration = extinctionDuration;
	/*this.rotation = Math.random() * Math.PI / 180;
	 this.rotationSpeed = rotation;*/
}

Particle.prototype = {
	update: function (gravity) {
		this.lifetime--;
		this.speedY -= gravity;
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.apparitionAlpha < 1) {
			this.apparitionAlpha += 0.05;
			this.alpha = this.apparitionAlpha;
		} else if (this.lifetime < this.extinctionDuration) {
			this.alpha = this.lifetime / this.extinctionDuration;
		} else {
			this.alpha = 1;
		}
		if (this.lifetime <= 0) {
			return false;
		}
		this.rotation += this.rotationSpeed;
		this.scale += this.scaleSpeed;
		return true;
	},
	draw: function (sprite, maxAlpha) {
		if (maxAlpha != undefined) {
			CE.canvas.animation.context.globalAlpha = Math.min(this.alpha, maxAlpha);
		} else {
			CE.canvas.animation.context.globalAlpha = this.alpha;
		}
		CE.canvas.animation.context.drawImage(sprite.image, this.x - sprite.centerX * this.scale, this.y - sprite.centerY * this.scale, sprite.width * this.scale, sprite.height * this.scale);
	}
};