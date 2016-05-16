"use strict";

class BooleanOperation {
    constructor(operation) {
        this.operator = operation.operator;
        this.value = operation.value;
    }
    
    toString() {
        return '(' + this.value.join(this.operator) + ')';
    }
}
module.exports = BooleanOperation;