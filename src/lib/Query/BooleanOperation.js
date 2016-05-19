'use strict';

class BooleanOperation {
  constructor(operation) {
    this.value    = operation.value;
  }

  toString() {
    if (this.value instanceof Array) {
      return '(' + this.value.join(this.operator) + ')';

    } else if (this.value instanceof Object) {
      return this.value.toString();

    } else if (this.value.length) {
      return '(' + this.value + ')';
    }

    return '';
  }
}

module.exports = BooleanOperation;
