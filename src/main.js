class Boid {
	constructor(context, xpos, ypos, radius) {
		this.context = context;
		this.x = xpos;
		this.y = ypos;
		this.radius = radius;
	}
	update() {
		this.draw();
		this.updatePosition();
	}
	draw() {
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.context.fillStyle = "#0095DD";
		this.context.fill();
		this.context.closePath();
	}
	updatePosition() {
		this.x += 1;
		this.y += 1;
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
		this.flock = this.createFlock(); // array of Boid objects
		window.setInterval(function(){
			this.update();
		}.bind(this), 60)
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
		try {
		    this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
			this.flock.forEach(f => f.update());
		}
		catch (e) {
		    // statements to handle any exceptions
			console.log("ERROR");
			console.log(e);
		}
	}
}

let f = new Flock();
