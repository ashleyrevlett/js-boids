'use strict';

System.register(['Boid.js', 'Vector.js', '../node_modules/sat/SAT.js'], function (_export, _context) {
	"use strict";

	var Boid, Vector, SAT, _createClass, Flock;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_BoidJs) {
			Boid = _BoidJs.default;
		}, function (_VectorJs) {
			Vector = _VectorJs.default;
		}, function (_node_modulesSatSATJs) {
			SAT = _node_modulesSatSATJs.default;
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
				function Flock(canvasID, totalBoids, boidRadius, boidSpeed, minDistance) {
					_classCallCheck(this, Flock);

					this.cvs = document.getElementById(canvasID);
					this.ctx = document.getElementById(canvasID).getContext('2d');
					this.totalBoids = totalBoids;
					this.radius = boidRadius;
					this.canvas_width = this.cvs.width;
					this.canvas_height = this.cvs.height;
					this.speed = boidSpeed;
					this.minDistance = minDistance;
					this.flock = this.createFlock(); // array of Boid objects
					this.center_point = new SAT.Vector(0, 0);
					window.setInterval(function () {
						this.update();
					}.bind(this), 10); // have to bind 'this' to Flock in interval scope
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
						for (var i = 0; i < this.totalBoids; i++) {
							this.flock[i].update(this.center_point);
						}
						this.moveBoids();
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
						return new SAT.Vector(averageX, averageY);
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

							var centerOfMass = this.calculateCenter();
							var currentPos = new SAT.Vector(this.flock[i].x, this.flock[i].y); // starting pos

							// move toward center of mass
							var v1 = this.rule1(currentPos, centerOfMass);

							// keep minimum distance between selves
							var v2 = this.rule2(i);

							// combine both movedirs
							var vd = v1.add(v2);

							// constrain to within bounds of canvas
							if (vd.len() > 0) {
								// currentPos = new SAT.Vector(this.flock[i].x, this.flock[i].y); // update after rule2
								// currentPos = currentPos.add(moveDir); // update after rule1
								vd = this.boundsCheck(vd, currentPos);
							}

							// update boid w/ new velocity
							this.flock[i].setVelocity(vd.x, vd.y);
						}
					}
				}, {
					key: 'rule1',
					value: function rule1(currentPos, center) {
						// @return new pos vector
						// move toward center of mass of all boids
						// if doing so won't cause a collision
						var moveDir = center.sub(currentPos);
						moveDir = moveDir.normalize();
						moveDir = moveDir.scale(this.speed);
						return moveDir;
					}
				}, {
					key: 'rule2',
					value: function rule2(boidIndex) {
						// @return new position vector
						// avoid getting too close to other boids
						var boid = this.flock[boidIndex];
						var moveDir = new SAT.Vector(0, 0);

						// get distance between this and all neighbor boids
						for (var i = 0; i < this.totalBoids; i++) {
							var neighbor = this.flock[i];
							if (neighbor !== boid) {
								// don't collide with self
								var currentPos = new SAT.Vector(boid.x, boid.y); // may change, have to update each time
								var neighborPos = new SAT.Vector(neighbor.x, neighbor.y);

								// get vector from between 2 points
								var dir = currentPos.sub(neighborPos);
								var distance = dir.len();
								// console.log(`i: ${i}\tDist:${distance}`);
								if (distance <= this.minDistance) {
									// push back against the overlapping direction
									moveDir = dir.normalize();
									moveDir = moveDir.scale(this.speed); // slightly faster than normal
									// console.log(`Pushing back: (${moveDir.x}, ${moveDir.y})`);

									// i = 0; // recheck !
								}
							}
						}
						return moveDir;
					}
				}, {
					key: 'boundsCheck',
					value: function boundsCheck(moveDir, currentPos) {
						// @return new moveDir vector that's constrained to within canvas bounds
						var maxX = this.canvas_width + this.radius * 2;
						var maxY = this.canvas_height + this.radius * 2;
						var newPos = currentPos.clone();
						newPos = newPos.add(moveDir);
						newPos.x = newPos.x < maxX ? newPos.x : maxX;
						newPos.x = newPos.x > 0 ? newPos.x : 0;
						newPos.y = newPos.y < maxY ? newPos.y : maxY;
						newPos.y = newPos.y > 0 ? newPos.y : 0;
						var newDir = newPos.sub(currentPos);
						return newDir;
					}
				}]);

				return Flock;
			}();

			_export('default', Flock);
		}
	};
});