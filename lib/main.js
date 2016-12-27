'use strict';

System.register(['Flock.js'], function (_export, _context) {
  "use strict";

  var Flock;
  return {
    setters: [function (_FlockJs) {
      Flock = _FlockJs.default;
    }],
    execute: function () {

      // canvasID, totalBoids, boidRadius, boidSpeed, minDistance between boids
      new Flock('myCanvas', 30, 8, .5, 24);
    }
  };
});