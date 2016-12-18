"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		value: function update() {
			this.draw();
			this.updatePosition();
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
		key: "updatePosition",
		value: function updatePosition() {
			this.x += 1;
			this.y += 1;
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
		this.flock = this.createFlock(); // array of Boid objects
		window.setInterval(function () {
			this.update();
		}.bind(this), 60);
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
			try {
				this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
				this.flock.forEach(function (f) {
					return f.update();
				});
			} catch (e) {
				// statements to handle any exceptions
				console.log("ERROR");
				console.log(e);
			}
		}
	}]);

	return Flock;
}();

var f = new Flock();