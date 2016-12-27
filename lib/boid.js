'use strict';

System.register(['../node_modules/sat/SAT.js'], function (_export, _context) {
	"use strict";

	var SAT, _createClass, Boid;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_node_modulesSatSATJs) {
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

			Boid = function () {
				function Boid(context, x, y, radius, moveSpeed) {
					_classCallCheck(this, Boid);

					this.context = context;
					this.x = x;
					this.y = y;
					this.velocity = new SAT.Vector(0, 0);
					this.radius = radius;
					this.moveSpeed = moveSpeed;
				}

				_createClass(Boid, [{
					key: 'update',
					value: function update() {
						this.move();
						this.draw();
					}
				}, {
					key: 'draw',
					value: function draw() {
						this.context.beginPath();
						this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
						this.context.fillStyle = '#0095DD';
						this.context.fill();
						this.context.closePath();
					}
				}, {
					key: 'move',
					value: function move() {
						// update to new position
						var currentPos = new SAT.Vector(this.x, this.y);
						var newPos = currentPos.add(this.velocity);
						this.x = newPos.x;
						this.y = newPos.y;
					}
				}, {
					key: 'setVelocity',
					value: function setVelocity(newX, newY) {
						this.velocity = new SAT.Vector(newX, newY);
					}
				}]);

				return Boid;
			}();

			_export('default', Boid);
		}
	};
});