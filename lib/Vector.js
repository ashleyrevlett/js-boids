"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, Vector;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
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

            Vector = function () {
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
                }, {
                    key: "multiply",
                    value: function multiply(vector1, scalar) {
                        var newX = vector1.x * scalar;
                        var newY = vector1.y * scalar;
                        return new Vector(newX, newY);
                    }
                }, {
                    key: "distance",
                    value: function distance(vector1, vector2) {
                        var xd = Math.pow(vector2.x - vector1.x, 2);
                        var yd = Math.pow(vector2.y - vector1.y, 2);
                        return Math.sqrt(Math.abs(xd + yd));
                    }
                }]);

                return Vector;
            }();

            _export("default", Vector);
        }
    };
});