/**
 * FLOCK - a collection of moving boids
 */

import Boid from 'Boid.js';
import Vector from 'Vector.js';
import SAT from '../node_modules/sat/SAT.js';


export default class Flock {
	constructor(canvasID, totalBoids, boidRadius, boidSpeed, minDistance) {
		this.cohesion = parseFloat(document.getElementById('cohesion').value);
		this.avoidance = parseFloat(document.getElementById('avoidance').value);
		this.alignment = parseFloat(document.getElementById('alignment').value);
		this.cvs = document.getElementById(canvasID);
		this.ctx = document.getElementById(canvasID).getContext('2d');
		this.totalBoids = totalBoids;
		this.radius = boidRadius;
		this.canvasWidth = this.cvs.width;
		this.canvasHeight = this.cvs.height;
		this.speed = boidSpeed;
		this.minDistance = minDistance;
		this.flock = this.createFlock(); // array of Boid objects
		this.center_point = new SAT.Vector(0, 0);
		window.setInterval(function() {
			this.update();
		}.bind(this), 10); // have to bind 'this' to Flock in interval scope
		document.querySelectorAll('.boid-form-input').forEach(() => {
		  addEventListener("change", (e) => { this.formUpdate(e); });
		});
	}

	formUpdate(event) {
		// anytime an input parameter changes, update our stored copy
		this.cohesion = parseFloat(document.getElementById('cohesion').value);
		this.avoidance = parseFloat(document.getElementById('avoidance').value);
		this.alignment = parseFloat(document.getElementById('alignment').value);
	}

	createFlock(flock) {
		let boids = [];
		for (let i = 0; i < this.totalBoids; i++) {
			let randomX = Math.floor((Math.random() * this.canvasWidth) + 1);
			let randomY = Math.floor((Math.random() * this.canvasHeight) + 1);
			let b = new Boid(this.ctx, randomX, randomY, this.radius, this.speed);
			boids.push(b);
		}
		return boids;
	}

	update() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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

	calculateVelocity(boids) {
		let averageX = 0;
		let averageY = 0;
		if (boids.length > 0) {
			for (let i = 0; i < boids.length; i++) {
				averageX += boids[i].velocity.x;
				averageY += boids[i].velocity.y;
			}
			averageX /= boids.length;
			averageY /= boids.length;
		}
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
			// console.log(averageVelocity);

			let currentPos = new SAT.Vector(this.flock[i].circle.pos.x, this.flock[i].circle.pos.y); // starting pos
			let boid = this.flock[i];

			// move toward center of mass
			let v1 = this.rule1(centerOfMass, boid);

			// keep minimum distance between selves
			let v2 = this.rule2(boid);

			// tend toward average velocity of flock
			let v3 = this.rule3(boid);

			// combine both movedirs
			let vd = v1.add(v2).add(v3);

			// constrain to within bounds of canvas
			if (vd.len() > 0) {
				vd = this.boundsCheck(vd, currentPos);
			}

			// update boid w/ new velocity
            this.flock[i].setVelocity(vd.x, vd.y);
		}
	}

	rule1(center, boid) {
		// @return new pos vector
		// move toward center of mass of all boids
		let currentPos = boid.circle.pos;
		let moveDir = center.sub(currentPos);
		moveDir = moveDir.scale(this.cohesion);
		return moveDir;
	}

	rule2(boid) {
		// @return new position vector
		// avoid getting too close to other boids
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
					let delta = dir.normalize();
					delta = delta.scale(this.avoidance); // slightly faster than normal
					moveDir = moveDir.add(delta);
					// console.log(`Pushing back: (${moveDir.x}, ${moveDir.y})`);
				}
			}
		}
		return moveDir;
	}

	rule3(boid) {
		let neighbors = this.getNeighbors(boid, 80);
		let averageVelocity = this.calculateVelocity(neighbors);
		averageVelocity = averageVelocity.scale(this.alignment);
		return averageVelocity;
	}

	boundsCheck(moveDir, currentPos) {
		// @return new moveDir vector that's constrained to within canvas bounds
		let maxX = this.canvasWidth + this.radius * 2;
		let maxY = this.canvasHeight + this.radius * 2;
		let newPos = currentPos.clone();
		newPos = newPos.add(moveDir);
		newPos.x = newPos.x < maxX ? newPos.x : maxX;
		newPos.x = newPos.x > 0 ? newPos.x : 0;
		newPos.y = newPos.y < maxY ? newPos.y : maxY;
		newPos.y = newPos.y > 0 ? newPos.y : 0;
		let newDir = newPos.sub(currentPos);
		return newDir;
	}

	getNeighbors(boid, maxDistance) {
		let nearby = [];
		for (let i = 0; i < this.totalBoids; i++) {
			let neighbor = this.flock[i];
			if (neighbor !== boid) { // don't collide with self
				let a = neighbor.circle.pos.clone();
				let b = boid.circle.pos.clone();
				let dv = a.sub(b);
				let len = dv.len();
				if (len < maxDistance) {
					nearby.push(neighbor);
				}
			}
		}
		return nearby;
	}

}
