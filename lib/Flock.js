'use strict';

System.register(['Vector.js', 'Boid.js'], function (_export, _context) {
	"use strict";

	var Vector, Boid, _createClass, Flock;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_VectorJs) {
			Vector = _VectorJs.default;
		}, function (_BoidJs) {
			Boid = _BoidJs.default;
		}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			Flock = function () {
				function Flock(canvasID, totalBoids, boidRadius, boidSpeed) {
					_classCallCheck(this, Flock);

					this.cvs = document.getElementById(canvasID);
					this.ctx = document.getElementById(canvasID).getContext('2d');
					this.totalBoids = totalBoids;
					this.radius = boidRadius;
					this.canvas_width = this.cvs.width;
					this.canvas_height = this.cvs.height;
					this.speed = boidSpeed;
					this.flock = this.createFlock(); // array of Boid objects
					this.center_point = new Vector(0, 0);
					window.setInterval(function () {
						this.update();
					}.bind(this), 60); // have to bind 'this' to interval scope
				}

				_createClass(Flock, [{
					key: 'createFlock',
					value: function createFlock(flock) {
						var boids = [];
						for (var i = 0; i < this.totalBoids; i++) {
							var randomX = Math.floor(Math.random() * this.canvas_width + 1);
							var randomY = Math.floor(Math.random() * this.canvas_height + 1);
							var b = new Boid(this.ctx, randomX, randomY, this.radius);
							boids.push(b);
						}
						return boids;
					}
				}, {
					key: 'update',
					value: function update() {
						this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
						this.center_point = this.calculateCenter();
						this.drawCenter(this.center_point.x, this.center_point.y);
						for (var i = 0; i < this.totalBoids; i++) {
							this.flock[i].update(this.center_point);
						}
					}
				}, {
					key: 'calculateCenter',
					value: function calculateCenter() {
						var averageX = 0;
						var averageY = 0;
						for (var i = 0; i < this.totalBoids; i++) {
							averageX += this.flock[i].x;
							averageY += this.flock[i].y;
						}
						averageX /= this.totalBoids;
						averageY /= this.totalBoids;
						return new Vector(averageX, averageY);
					}
				}, {
					key: 'drawCenter',
					value: function drawCenter(x, y) {
						this.ctx.beginPath();
						this.ctx.arc(x, y, 20, 0, Math.PI * 2);
						this.ctx.fillStyle = '#ffff00';
						this.ctx.fill();
						this.ctx.closePath();
					}
				}]);

				return Flock;
			}();

			_export('default', Flock);
		}
	};
});