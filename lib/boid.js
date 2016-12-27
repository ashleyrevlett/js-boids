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
					this.velocity = new SAT.Vector(0, 0);
					this.moveSpeed = moveSpeed;
					this.circle = new SAT.Circle(new SAT.Vector(x, y), radius);
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
						var x = this.circle.pos.x;
						var y = this.circle.pos.y;
						var r = this.circle.r;
						this.context.beginPath();
						this.context.arc(x, y, r, 0, Math.PI * 2);
						this.context.fillStyle = '#0095DD';
						this.context.fill();
						this.context.closePath();
					}
				}, {
					key: 'move',
					value: function move() {
						// update to new position
						var currentPos = new SAT.Vector(this.circle.pos.x, this.circle.pos.y);
						var newPos = currentPos.add(this.velocity);
						this.circle.pos = newPos.clone();
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