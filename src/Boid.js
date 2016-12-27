/**
 * BOID - a thing that moves like a bird
 *
 * @constructor
 * @param {float} x - x position
 * @param {float} y - y position
 * @param {float} radius - boid circle radius
 * @param {float} moveSpeed - speed at which boid should move
 */

import SAT from '../node_modules/sat/SAT.js';

export default class Boid {
	constructor(context, x, y, radius, moveSpeed) {
		this.context = context;
		this.x = x;
		this.y = y;
		this.velocity = new SAT.Vector(0, 0);
		this.radius = radius;
		this.moveSpeed = moveSpeed;
	}
	update() {
		this.move();
		this.draw();
	}
	draw() {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.context.fillStyle = '#0095DD';
		this.context.fill();
		this.context.closePath();
	}
	move() {
		// update to new position
		let currentPos = new SAT.Vector(this.x, this.y);
		let newPos = currentPos.add(this.velocity);
		this.x = newPos.x;
		this.y = newPos.y;
	}
	setVelocity(newX, newY) {
		this.velocity = new SAT.Vector(newX, newY);
	}
}
