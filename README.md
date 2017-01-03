##Javascript Boids

Demo of boid flocking algorithm using ES6 Javascript.

Algorithm reference: http://www.kfish.org/boids/pseudocode.html

###Boid Flocking Rules
1. Cohesion: Boids try to move toward their neighbors' center of mass.
2. Avoidance: Boids try to keep a minimum distance from each other.
3. Alignment: Boids try to match their neighbors' velocity.
4. Migration: Boids move toward their migration target, if one exists.
5. Boids don't move beyond canvas bounds.

###Dev Notes
- SystemJS is used to load modules 
- Babel is used to transpile ES6 into ES5 (http://kangax.github.io/compat-table/es6/) 
- NPM scripts are used to invoke Babel and serve static files 
- ESLint is used w/ google preset 

 

