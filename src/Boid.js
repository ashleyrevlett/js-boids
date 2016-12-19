import Vector from 'Vector.js';

export default class {
	constructor(context, x, y, radius, moveSpeed) {
		this.context = context;
		this.x = x;
		this.y = y;
		this.velocity = new Vector(0, 0);
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
		const currentPos = new Vector(this.x, this.y);
		const newPos = Vector.add(currentPos, this.velocity);
		this.x = newPos.x;
		this.y = newPos.y;
	}
	setVelocity(newX, newY) {
		this.velocity = new Vector(newX, newY);
	}
}
