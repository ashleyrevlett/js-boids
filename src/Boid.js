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
	update(center) {
		this.move(center);
		this.draw();
	}
	draw() {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.context.fillStyle = '#0095DD';
		this.context.fill();
		this.context.closePath();
	}
	move(center) {
		// generate moveDir based on 3 boid flocking rules
		const currentPos = new Vector(this.x, this.y);
		this.velocity = this.rule1(currentPos, center);
		// this.velocity = this.rule2(currentPos, center);

		// update to new position
		const newPos = Vector.add(currentPos, this.velocity);
		this.x = newPos.x;
		this.y = newPos.y;
	}
	rule1(currentPos, center) {
		// get vector from current position toward center point
		let moveDir = Vector.subtract(center, currentPos);
		moveDir = Vector.normalize(moveDir);
		moveDir = Vector.multiply(moveDir, this.moveSpeed);
		return moveDir;
	}
	// rule2(currentPos, center) {
	// 	// avoid other boids
	// 	let moveDir = Vector.subtract(center, currentPos);
	// 	moveDir = Vector.normalize(moveDir);
	// 	moveDir = Vector.multiply(moveDir, this.moveSpeed);
	// 	return moveDir;
	// }
}
