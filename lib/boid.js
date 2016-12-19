'use strict';

System.register(['Vector.js'], function (_export, _context) {
	"use strict";

	var Vector, _createClass, _class;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [function (_VectorJs) {
			Vector = _VectorJs.default;
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

			_class = function () {
				function _class(context, x, y, radius, moveSpeed) {
					_classCallCheck(this, _class);

					this.context = context;
					this.x = x;
					this.y = y;
					this.velocity = new Vector(0, 0);
					this.radius = radius;
					this.moveSpeed = moveSpeed;
				}

				_createClass(_class, [{
					key: 'update',
					value: function update(center) {
						this.move(center);
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
					value: function move(center) {
						// generate moveDir based on 3 boid flocking rules
						var currentPos = new Vector(this.x, this.y);
						this.velocity = this.rule1(currentPos, center);
						// this.velocity = this.rule2(currentPos, center);

						// update to new position
						var newPos = Vector.add(currentPos, this.velocity);
						this.x = newPos.x;
						this.y = newPos.y;
					}
				}, {
					key: 'rule1',
					value: function rule1(currentPos, center) {
						// get vector from current position toward center point
						var moveDir = Vector.subtract(center, currentPos);
						moveDir = Vector.normalize(moveDir);
						moveDir = Vector.multiply(moveDir, this.moveSpeed);
						return moveDir;
					}
				}]);

				return _class;
			}();

			_export('default', _class);
		}
	};
});