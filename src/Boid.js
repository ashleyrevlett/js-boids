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
		this.velocity = new SAT.Vector(0, 0);
		this.moveSpeed = moveSpeed;
		this.circle = new SAT.Circle(new SAT.Vector(x, y), radius);
	}
	update() {
		this.move();
		this.draw();
	}
	draw() {
		let x = this.circle.pos.x;
		let y = this.circle.pos.y;
		let r = this.circle.r;
		this.context.beginPath();
		this.context.arc(x, y, r, 0, Math.PI * 2);
		this.context.fillStyle = '#0095DD';
		this.context.fill();
		this.context.closePath();
	}
	move() {
		// update to new position
		let currentPos = new SAT.Vector(this.circle.pos.x, this.circle.pos.y);
		let newPos = currentPos.add(this.velocity);
		this.circle.pos = newPos.clone();
	}
	setVelocity(newX, newY) {
		this.velocity = new SAT.Vector(newX, newY);
	}
}
