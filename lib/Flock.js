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
							var b = new Boid(this.ctx, randomX, randomY, this.radius, this.speed);
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
						this.moveBoids();
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
				}, {
					key: 'moveBoids',
					value: function moveBoids() {
						for (var i = 0; i < this.totalBoids; i++) {
							var currentPos = new Vector(this.flock[i].x, this.flock[i].y);
							var centerOfMass = this.calculateCenter();
							var newPos = this.rule1(currentPos, centerOfMass);
							newPos = this.rule2(newPos, i);
							console.log(currentPos);
							console.log(newPos);
							this.flock[i].x = newPos.x;
							this.flock[i].y = newPos.y;
						}
					}
				}, {
					key: 'rule1',
					value: function rule1(currentPos, center) {
						console.log("passed to rule1");
						console.log(currentPos);
						console.log(center);
						// @return new pos vector
						// move toward center of mass of all boids
						var moveDir = Vector.subtract(center, currentPos);
						moveDir = Vector.normalize(moveDir);
						moveDir = Vector.multiply(moveDir, this.speed);
						var newPos = Vector.add(currentPos, moveDir);
						return newPos;
					}
				}, {
					key: 'rule2',
					value: function rule2(currentPos, boidIndex) {
						// @return new position vector
						// avoid getting too close to other boids
						var boid = this.flock[boidIndex];
						for (var i = 0; i < this.totalBoids; i++) {
							var neighbor = this.flock[i];
							if (neighbor.x != boid.x && neighbor.y != boid.y) {
								var neighborPos = new Vector(neighbor.x, neighbor.y);
								var distance = Vector.distance(currentPos, neighborPos);
								if (distance < this.radius * 2.5) {
									// push back against the overlapping direction
									var moveDir = Vector.subtract(currentPos, neighborPos);
									moveDir = Vector.normalize(moveDir);
									moveDir = Vector.multiply(moveDir, this.speed);
									var newPos = Vector.add(currentPos, moveDir);
									currentPos = newPos;
								}
							}
						}
						return currentPos;
					}
				}]);

				return Flock;
			}();

			_export('default', Flock);
		}
	};
});