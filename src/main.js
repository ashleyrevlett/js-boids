class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	magnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	static normalize (vector) {
		let mag = vector.magnitude();
		let newX = vector.x / mag;
		let newY = vector.y / mag;
		return new Vector(newX, newY);
  	}
	static add (vector1, vector2) {
		let newX = vector1.x + vector2.x;
		let newY = vector1.y + vector2.y;
		return new Vector(newX, newY);
  	}
	static subtract (vector1, vector2) {
		// vector1 - vector2
		let newX = vector1.x - vector2.x;
		let newY = vector1.y - vector2.y;
		return new Vector(newX, newY);
  	}
}


class Boid {
	constructor(context, xpos, ypos, radius) {
		this.context = context;
		this.x = xpos;
		this.y = ypos;
		this.radius = radius;
	}
	update(center) {
		this.move(center);
		this.draw();
	}
	draw() {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.context.fillStyle = "#0095DD";
		this.context.fill();
		this.context.closePath();
	}
	move(center) {
		let newPos = this.rule1(center);
		this.x = newPos.x;
		this.y = newPos.y;
	}
	rule1(center) {
		// move 1% toward center point
		// get vector from current position toward center point
		let currentPos = new Vector(this.x, this.y);
		let moveDir = Vector.subtract(center, currentPos);
		moveDir = Vector.normalize(moveDir);
		let newPos = Vector.add(currentPos, moveDir);

		// debug draw
		// this.context.beginPath();
		// this.context.lineWidth="5";
		// this.context.strokeStyle="#009000"; // Green path
		// this.context.moveTo(currentPos.x,currentPos.y);
		// this.context.lineTo(newPos.x,newPos.y);
		// this.context.stroke(); // Draw it

		return newPos;
	}
}

class Flock {
	constructor() {
		this.cvs = document.getElementById("myCanvas");
		this.ctx = document.getElementById("myCanvas").getContext("2d");
		this.totalBoids = 10;
		this.radius = 10;
		this.canvas_width = this.cvs.width;
		this.canvas_height = this.cvs.height;
		this.speed = 10;
		this.flock = this.createFlock(); // array of Boid objects
		this.center_point = new Vector(0, 0);
		window.setInterval(function(){
			this.update();
		}.bind(this), 60); // have to bind 'this' to interval scope
	}
	createFlock(flock) {
		let boids = new Array();
		for (let i = 0; i < this.totalBoids; i++) {
			const random_x = Math.floor((Math.random() * this.canvas_width) + 1);
			const random_y = Math.floor((Math.random() * this.canvas_height) + 1);
			let b = new Boid(this.ctx, random_x, random_y, this.radius);
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
		let average_x = 0;
		let average_y = 0;
		for (let i = 0; i < this.totalBoids; i++) {
			average_x += this.flock[i].x;
			average_y += this.flock[i].y;
		}
		average_x /= this.totalBoids;
		average_y /= this.totalBoids;
		return new Vector(average_x, average_y);
	}
	drawCenter(x, y) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, 20, 0, Math.PI * 2);
		this.ctx.fillStyle = "#ffff00";
		this.ctx.fill();
		this.ctx.closePath();
	}
}

let f = new Flock();
