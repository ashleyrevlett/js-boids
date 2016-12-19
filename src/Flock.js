import Vector from 'Vector.js';
import Boid from 'Boid.js';

export default class Flock {
	constructor(canvasID, totalBoids, boidRadius, boidSpeed) {
		this.cvs = document.getElementById(canvasID);
		this.ctx = document.getElementById(canvasID).getContext('2d');
		this.totalBoids = totalBoids;
		this.radius = boidRadius;
		this.canvas_width = this.cvs.width;
		this.canvas_height = this.cvs.height;
		this.speed = boidSpeed;
		this.flock = this.createFlock(); // array of Boid objects
		this.center_point = new Vector(0, 0);
		window.setInterval(function() {
			this.update();
		}.bind(this), 60); // have to bind 'this' to interval scope
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
		this.moveBoids();
		for (let i = 0; i < this.totalBoids; i++) {
			this.flock[i].update(this.center_point);
		}
	}
	calculateCenter() {
		let averageX = 0;
		let averageY = 0;
		for (let i = 0; i < this.totalBoids; i++) {
			averageX += this.flock[i].x;
			averageY += this.flock[i].y;
		}
		averageX /= this.totalBoids;
		averageY /= this.totalBoids;
		return new Vector(averageX, averageY);
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
			let currentPos = new Vector(this.flock[i].x, this.flock[i].y);
			let centerOfMass = this.calculateCenter();
			let moveDir = this.rule1(currentPos, centerOfMass);
			currentPos = Vector.add(currentPos, moveDir);
			moveDir = this.rule2(currentPos, i);
			currentPos = Vector.add(currentPos, moveDir);
			this.flock[i].x = currentPos.x;
			this.flock[i].y = currentPos.y;
		}
	}
	rule1(currentPos, center) {
		// @return new pos vector
		// move toward center of mass of all boids
		let moveDir = Vector.subtract(center, currentPos);
		moveDir = Vector.normalize(moveDir);
		moveDir = Vector.multiply(moveDir, this.speed);
		return moveDir;
	}
	rule2(currentPos, boidIndex) {
		// @return new position vector
		// avoid getting too close to other boids
		let moveDir = new Vector(0, 0);
		let boid = this.flock[boidIndex];
		for (let i = 0; i < this.totalBoids; i++) {
			let neighbor = this.flock[i];
			if (neighbor.x != boid.x && neighbor.y != boid.y) {
				let neighborPos = new Vector(neighbor.x, neighbor.y);
				let distance = Vector.distance(currentPos, neighborPos);
				console.log(distance);
				if (distance < this.radius * 5) {
					// push back against the overlapping direction
					moveDir = Vector.subtract(currentPos, neighborPos);
					moveDir = Vector.normalize(moveDir);
					moveDir = Vector.multiply(moveDir, this.speed);
					let newPos = Vector.add(currentPos, moveDir);
					currentPos = newPos;
				}
			}
		}
		return moveDir;
	}

}
