/**
 * FLOCK - a collection of moving boids
 */

import Boid from 'Boid.js';
import Vector from 'Vector.js';
import SAT from '../node_modules/sat/SAT.js';


export default class Flock {
	constructor(canvasID, totalBoids, boidRadius, boidSpeed, minDistance) {
		this.cvs = document.getElementById(canvasID);
		this.ctx = document.getElementById(canvasID).getContext('2d');
		this.totalBoids = totalBoids;
		this.radius = boidRadius;
		this.canvas_width = this.cvs.width;
		this.canvas_height = this.cvs.height;
		this.speed = boidSpeed;
		this.minDistance = minDistance;
		this.flock = this.createFlock(); // array of Boid objects
		this.center_point = new SAT.Vector(0, 0);
		window.setInterval(function() {
			this.update();
		}.bind(this), 10); // have to bind 'this' to Flock in interval scope
	}
	createFlock(flock) {
		let boids = [];
		for (let i = 0; i < this.totalBoids; i++) {
			let randomX = Math.floor((Math.random() * this.canvas_width) + 1);
			let randomY = Math.floor((Math.random() * this.canvas_height) + 1);
			let b = new Boid(this.ctx, randomX, randomY, this.radius, this.speed);
			boids.push(b);
		}
		return boids;
	}
	update() {
		this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
		this.center_point = this.calculateCenter();
		this.drawCenter(this.center_point.x, this.center_point.y);
		for (let i = 0; i < this.totalBoids; i++) {
			this.flock[i].update();
		}
		this.moveBoids(); // move after 1st draw
	}
	calculateCenter() {
		let averageX = 0;
		let averageY = 0;
		for (let i = 0; i < this.totalBoids; i++) {
			averageX += this.flock[i].circle.pos.x;
			averageY += this.flock[i].circle.pos.y;
		}
		averageX /= this.totalBoids;
		averageY /= this.totalBoids;
		return new SAT.Vector(averageX, averageY);
	}
	drawCenter(x, y) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, 20, 0, Math.PI * 2);
		this.ctx.fillStyle = '#ffff00';
		this.ctx.fill();
		this.ctx.closePath();
	}
	moveBoids() {
		for (let i = 0; i < this.totalBoids; i++) {

			let centerOfMass = this.calculateCenter();
			let currentPos = new SAT.Vector(this.flock[i].circle.pos.x, this.flock[i].circle.pos.y); // starting pos

			// move toward center of mass
			let v1 = this.rule1(currentPos, centerOfMass);

			// keep minimum distance between selves
			let v2 = this.rule2(i);

			// combine both movedirs
			let vd = v1.add(v2);

			// constrain to within bounds of canvas
			if (vd.len() > 0) {
				vd = this.boundsCheck(vd, currentPos);
			}

			// update boid w/ new velocity
            this.flock[i].setVelocity(vd.x, vd.y);
		}
	}
	rule1(currentPos, center) {
		// @return new pos vector
		// move toward center of mass of all boids
		// if doing so won't cause a collision
		let moveDir = center.sub(currentPos);
        moveDir = moveDir.normalize();
		moveDir = moveDir.scale(this.speed);

		return moveDir;
	}
	rule2(boidIndex) {
		// @return new position vector
		// avoid getting too close to other boids
		let boid = this.flock[boidIndex];
		let moveDir = new SAT.Vector(0, 0);

		// get distance between this and all neighbor boids
		for (let i = 0; i < this.totalBoids; i++) {
			let neighbor = this.flock[i];
			if (neighbor !== boid) { // don't collide with self
				let currentPos = new SAT.Vector(boid.circle.pos.x, boid.circle.pos.y); // may change, have to update each time
				let neighborPos = new SAT.Vector(neighbor.circle.pos.x, neighbor.circle.pos.y);

				// get vector from between 2 points
				let dir = currentPos.sub(neighborPos);
				let distance = dir.len();
				// console.log(`i: ${i}\tDist:${distance}`);
				if (distance <= this.minDistance) {
					// push back against the overlapping direction
					moveDir = dir.normalize();
					moveDir = moveDir.scale(this.speed); // slightly faster than normal
					// console.log(`Pushing back: (${moveDir.x}, ${moveDir.y})`);
				}
			}
		}
		return moveDir;
	}

	boundsCheck(moveDir, currentPos) {
		// @return new moveDir vector that's constrained to within canvas bounds
		let maxX = this.canvas_width + this.radius * 2;
		let maxY = this.canvas_height + this.radius * 2;
		let newPos = currentPos.clone();
		newPos = newPos.add(moveDir);
		newPos.x = newPos.x < maxX ? newPos.x : maxX;
		newPos.x = newPos.x > 0 ? newPos.x : 0;
		newPos.y = newPos.y < maxY ? newPos.y : maxY;
		newPos.y = newPos.y > 0 ? newPos.y : 0;
		let newDir = newPos.sub(currentPos);
		return newDir;
	}

}
