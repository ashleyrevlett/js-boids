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
					var _this = this;

					_classCallCheck(this, Flock);

					this.cohesion = parseFloat(document.getElementById('cohesion').value);
					this.avoidance = parseFloat(document.getElementById('avoidance').value);
					this.alignment = parseFloat(document.getElementById('alignment').value);
					this.neighborhoodSize = parseFloat(document.getElementById('neighborhood').value);
					this.migration = parseFloat(document.getElementById('migration').value);
					this.cvs = document.getElementById(canvasID);
					this.ctx = document.getElementById(canvasID).getContext('2d');
					this.totalBoids = totalBoids;
					this.migrationTarget = new SAT.Vector(800, 300);
					this.radius = boidRadius;
					this.canvasWidth = this.cvs.width;
					this.canvasHeight = this.cvs.height;
					this.speed = boidSpeed;
					this.minDistance = minDistance;
					this.flock = this.createFlock(); // array of Boid objects
					window.setInterval(function () {
						this.update();
					}.bind(this), 10); // have to bind 'this' to Flock in interval scope
					document.querySelectorAll('.boid-form-input').forEach(function () {
						addEventListener("change", function (e) {
							_this.formUpdate(e);
						});
					});
					document.getElementById('myCanvas').addEventListener('click', function (e) {
						_this.changeTarget(e);
					}, false);
				}

				_createClass(Flock, [{
					key: 'changeTarget',
					value: function changeTarget(e) {
						console.log("CLICKED!");
						console.log(e);
						this.migrationTarget = new SAT.Vector(e.x, e.y);
					}
				}, {
					key: 'formUpdate',
					value: function formUpdate(event) {
						// anytime an input parameter changes, update our stored copy
						this.cohesion = parseFloat(document.getElementById('cohesion').value);
						this.avoidance = parseFloat(document.getElementById('avoidance').value);
						this.alignment = parseFloat(document.getElementById('alignment').value);
						this.neighborhoodSize = parseFloat(document.getElementById('neighborhood').value);
						this.migration = parseFloat(document.getElementById('migration').value);
					}
				}, {
					key: 'createFlock',
					value: function createFlock(flock) {
						var boids = [];
						for (var i = 0; i < this.totalBoids; i++) {
							var randomX = Math.floor(Math.random() * this.canvasWidth + 1);
							var randomY = Math.floor(Math.random() * this.canvasHeight + 1);
							var b = new Boid(this.ctx, randomX, randomY, this.radius, this.speed);
							boids.push(b);
						}
						return boids;
					}
				}, {
					key: 'update',
					value: function update() {
						this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
						var center = this.calculateCenter();
						this.drawCircle(center.x, center.y, '#ffff00', 20);
						this.drawCircle(this.migrationTarget.x, this.migrationTarget.y, '#ee00aa', 10);

						for (var i = 0; i < this.totalBoids; i++) {
							this.flock[i].update();
						}
						this.moveBoids(); // move after 1st draw
					}
				}, {
					key: 'calculateCenter',
					value: function calculateCenter() {
						var averageX = 0;
						var averageY = 0;
						for (var i = 0; i < this.totalBoids; i++) {
							averageX += this.flock[i].circle.pos.x;
							averageY += this.flock[i].circle.pos.y;
						}
						averageX /= this.totalBoids;
						averageY /= this.totalBoids;
						return new SAT.Vector(averageX, averageY);
					}
				}, {
					key: 'calculateVelocity',
					value: function calculateVelocity(boids) {
						var averageX = 0;
						var averageY = 0;
						if (boids.length > 0) {
							for (var i = 0; i < boids.length; i++) {
								averageX += boids[i].velocity.x;
								averageY += boids[i].velocity.y;
							}
							averageX /= boids.length;
							averageY /= boids.length;
						}
						return new SAT.Vector(averageX, averageY);
					}
				}, {
					key: 'drawCircle',
					value: function drawCircle(x, y, color, size) {
						this.ctx.beginPath();
						this.ctx.arc(x, y, size, 0, Math.PI * 2);
						this.ctx.fillStyle = color;
						this.ctx.fill();
						this.ctx.closePath();
					}
				}, {
					key: 'moveBoids',
					value: function moveBoids() {
						for (var i = 0; i < this.totalBoids; i++) {

							var currentPos = new SAT.Vector(this.flock[i].circle.pos.x, this.flock[i].circle.pos.y); // starting pos
							var boid = this.flock[i];

							// get distance between this and all neighbor boids
							var neighbors = this.getNeighbors(boid, this.neighborhoodSize);

							// move toward center of mass
							var v1 = this.rule1(boid, neighbors);

							// keep minimum distance between selves
							var v2 = this.rule2(boid, neighbors);

							// tend toward average velocity of flock
							var v3 = this.rule3(boid, neighbors);

							// move toward migration destination target
							var v4 = this.rule4(boid);
							// console.log(v4);

							// combine both movedirs
							var vd = v1.add(v2).add(v3).add(v4);

							// constrain to within bounds of canvas
							if (vd.len() > 0) {
								vd = this.boundsCheck(vd, currentPos);
							}

							// update boid w/ new velocity
							this.flock[i].setVelocity(vd.x, vd.y);
						}
					}
				}, {
					key: 'rule1',
					value: function rule1(boid, neighbors) {
						// @return new pos vector
						// move toward center of mass of all boids
						var centerOfMass = this.calculateCenter(neighbors);
						var currentPos = boid.circle.pos;
						var moveDir = centerOfMass.sub(currentPos);
						moveDir = moveDir.normalize().scale(this.cohesion);
						return moveDir;
					}
				}, {
					key: 'rule2',
					value: function rule2(boid, neighbors) {
						// @return new position vector
						// avoid getting too close to other boids
						var moveDir = new SAT.Vector(0, 0);

						for (var i = 0; i < neighbors.length; i++) {
							var neighbor = neighbors[i];
							if (neighbor !== boid) {
								// don't collide with self
								var currentPos = new SAT.Vector(boid.circle.pos.x, boid.circle.pos.y); // may change, have to update each time
								var neighborPos = new SAT.Vector(neighbor.circle.pos.x, neighbor.circle.pos.y);

								// get vector from between 2 points
								var dir = currentPos.sub(neighborPos);
								var distance = dir.len();
								// console.log(`i: ${i}\tDist:${distance}`);
								if (distance <= this.minDistance) {
									// push back against the overlapping direction
									var delta = dir.normalize();
									delta = delta.scale(this.avoidance); // slightly faster than normal
									moveDir = moveDir.add(delta);
									// console.log(`Pushing back: (${moveDir.x}, ${moveDir.y})`);
								}
							}
						}
						return moveDir;
					}
				}, {
					key: 'rule3',
					value: function rule3(boid, neighbors) {
						// try to match the volocity of neighboring boids
						var averageVelocity = this.calculateVelocity(neighbors);
						averageVelocity = averageVelocity.scale(this.alignment);
						return averageVelocity;
					}
				}, {
					key: 'rule4',
					value: function rule4(boid) {
						// steer toward migration target
						// set temp target
						var targetPos = this.migrationTarget.clone();
						var moveDir = targetPos.sub(boid.circle.pos);
						moveDir = moveDir.normalize().scale(this.migration);
						return moveDir;
					}
				}, {
					key: 'boundsCheck',
					value: function boundsCheck(moveDir, currentPos) {
						// @return new moveDir vector that's constrained to within canvas bounds
						var maxX = this.canvasWidth + this.radius * 2;
						var maxY = this.canvasHeight + this.radius * 2;
						var newPos = currentPos.clone();
						newPos = newPos.add(moveDir);
						newPos.x = newPos.x < maxX ? newPos.x : maxX;
						newPos.x = newPos.x > 0 ? newPos.x : 0;
						newPos.y = newPos.y < maxY ? newPos.y : maxY;
						newPos.y = newPos.y > 0 ? newPos.y : 0;
						var newDir = newPos.sub(currentPos);
						return newDir;
					}
				}, {
					key: 'getNeighbors',
					value: function getNeighbors(boid, maxDistance) {
						var nearby = [];
						for (var i = 0; i < this.totalBoids; i++) {
							var neighbor = this.flock[i];
							if (neighbor !== boid) {
								// don't collide with self
								var a = neighbor.circle.pos.clone();
								var b = boid.circle.pos.clone();
								var dv = a.sub(b);
								var len = dv.len();
								if (len < maxDistance) {
									nearby.push(neighbor);
								}
							}
						}
						return nearby;
					}
				}]);

				return Flock;
			}();

			_export('default', Flock);
		}
	};
});