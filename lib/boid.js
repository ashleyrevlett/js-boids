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
				function _class(context, xpos, ypos, radius) {
					_classCallCheck(this, _class);

					this.context = context;
					this.x = xpos;
					this.y = ypos;
					this.radius = radius;
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
						var newPos = this.rule1(center);
						this.x = newPos.x;
						this.y = newPos.y;
					}
				}, {
					key: 'rule1',
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

				return _class;
			}();

			_export('default', _class);
		}
	};
});