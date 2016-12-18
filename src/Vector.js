export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    static normalize(vector) {
        let mag = vector.magnitude();
        let newX = vector.x / mag;
        let newY = vector.y / mag;
        return new Vector(newX, newY);
    }
    static add(vector1, vector2) {
        let newX = vector1.x + vector2.x;
        let newY = vector1.y + vector2.y;
        return new Vector(newX, newY);
    }
    static subtract(vector1, vector2) {
        // vector1 - vector2
        let newX = vector1.x - vector2.x;
        let newY = vector1.y - vector2.y;
        return new Vector(newX, newY);
    }
}

