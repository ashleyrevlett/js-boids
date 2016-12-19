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
	// moveBoids() {
	// 	for (let i = 0; i < this.totalBoids; i++) {
	// 		for (let j = 0; i < this.totalBoids; j++) {
	// 			if (j != i) {
	// 			// 	IF |b.position - bJ.position| < 100 THEN
	// 			// 		c = c - (b.position - bJ.position)
	// 			//  END IF

	// 				// this.flock[i]
	// 			}
	// 		}
	// 	}
	// }
}
