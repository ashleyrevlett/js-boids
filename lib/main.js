"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
	function Vector(x, y) {
		_classCallCheck(this, Vector);

		this.x = x;
		this.y = y;
	}

	_createClass(Vector, [{
		key: "magnitude",
		value: function magnitude() {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		}
	}], [{
		key: "normalize",
		value: function normalize(vector) {
			var mag = vector.magnitude();
			var newX = vector.x / mag;
			var newY = vector.y / mag;
			return new Vector(newX, newY);
		}
	}, {
		key: "add",
		value: function add(vector1, vector2) {
			var newX = vector1.x + vector2.x;
			var newY = vector1.y + vector2.y;
			return new Vector(newX, newY);
		}
	}, {
		key: "subtract",
		value: function subtract(vector1, vector2) {
			// vector1 - vector2
			var newX = vector1.x - vector2.x;
			var newY = vector1.y - vector2.y;
			return new Vector(newX, newY);
		}
	}]);

	return Vector;
}();

var Boid = function () {
	function Boid(context, xpos, ypos, radius) {
		_classCallCheck(this, Boid);

		this.context = context;
		this.x = xpos;
		this.y = ypos;
		this.radius = radius;
	}

	_createClass(Boid, [{
		key: "update",
		value: function update(center) {
			this.move(center);
			this.draw();
		}
	}, {
		key: "draw",
		value: function draw() {
			this.context.beginPath();
			this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			this.context.fillStyle = "#0095DD";
			this.context.fill();
			this.context.closePath();
		}
	}, {
		key: "move",
		value: function move(center) {
			var newPos = this.rule1(center);
			this.x = newPos.x;
			this.y = newPos.y;
		}
	}, {
		key: "rule1",
		value: function rule1(center) {
			// move 1% toward center point
			// get vector from current position toward center point
			var currentPos = new Vector(this.x, this.y);
			var moveDir = Vector.subtract(center, currentPos);
			moveDir = Vector.normalize(moveDir);
			var newPos = Vector.add(currentPos, moveDir);

			// debug draw
			// this.context.beginPath();
			// this.context.lineWidth="5";
			// this.context.strokeStyle="#009000"; // Green path
			// this.context.moveTo(currentPos.x,currentPos.y);
			// this.context.lineTo(newPos.x,newPos.y);
			// this.context.stroke(); // Draw it

			return newPos;
		}
	}]);

	return Boid;
}();

var Flock = function () {
	function Flock() {
		_classCallCheck(this, Flock);

		this.cvs = document.getElementById("myCanvas");
		this.ctx = document.getElementById("myCanvas").getContext("2d");
		this.totalBoids = 10;
		this.radius = 10;
		this.canvas_width = this.cvs.width;
		this.canvas_height = this.cvs.height;
		this.speed = 10;
		this.flock = this.createFlock(); // array of Boid objects
		this.center_point = new Vector(0, 0);
		window.setInterval(function () {
			this.update();
		}.bind(this), 60); // have to bind 'this' to interval scope
	}

	_createClass(Flock, [{
		key: "createFlock",
		value: function createFlock(flock) {
			var boids = new Array();
			for (var i = 0; i < this.totalBoids; i++) {
				var random_x = Math.floor(Math.random() * this.canvas_width + 1);
				var random_y = Math.floor(Math.random() * this.canvas_height + 1);
				var b = new Boid(this.ctx, random_x, random_y, this.radius);
				boids.push(b);
			}
			return boids;
		}
	}, {
		key: "update",
		value: function update() {
			this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
			this.center_point = this.calculateCenter();
			this.drawCenter(this.center_point.x, this.center_point.y);
			for (var i = 0; i < this.totalBoids; i++) {
				this.flock[i].update(this.center_point);
			}
		}
	}, {
		key: "calculateCenter",
		value: function calculateCenter() {
			var average_x = 0;
			var average_y = 0;
			for (var i = 0; i < this.totalBoids; i++) {
				average_x += this.flock[i].x;
				average_y += this.flock[i].y;
			}
			average_x /= this.totalBoids;
			average_y /= this.totalBoids;
			return new Vector(average_x, average_y);
		}
	}, {
		key: "drawCenter",
		value: function drawCenter(x, y) {
			this.ctx.beginPath();
			this.ctx.arc(x, y, 20, 0, Math.PI * 2);
			this.ctx.fillStyle = "#ffff00";
			this.ctx.fill();
			this.ctx.closePath();
		}
	}]);

	return Flock;
}();

var f = new Flock();