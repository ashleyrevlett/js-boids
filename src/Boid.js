import Vector from 'Vector.js';

export default class {
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
		this.context.fillStyle = '#0095DD';
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
