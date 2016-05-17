"use strict";

class Field {
    constructor(field) {
        this.name = field.name;
        this.value = field.value;
    }

    inspect() {
        return this.toString();
    }

    toString() {
        return this.name + ':' + this.value;
    }
}
module.exports = Field;