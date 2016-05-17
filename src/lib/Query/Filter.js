'use strict';

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

class Filter {
  constructor(filter) {
    this.filter       = this.parse(filter);
    this.filterString = this.build(this.filter);
  }

  parse(filters) {
    let filter = [];

    for (let name in filters) {
      let value     = filters[name];
      let operation = null;

      switch (name) {
        case 'to':
          operation = new ToOperation({value});
          break;
        case 'or':
          operation = new BooleanOperation({name, operator: ' OR ', value: this.parse(value)});
          break;
        case 'and':
          operation = new BooleanOperation({name, operator: ' AND ', value: this.parse(value)});
          break;
        default:
          if (value instanceof Object) {
            value     = this.parse(value);
            operation = new FieldOperation({name, value});
          } else if (isNaN(name)) {
            operation = new FieldOperation({name, value});
          } else {
            operation = value;
          }

          break;
      }

      filter.push(operation);
    }

    return filter;
  }

  /**
   *
   * @param filters
   * @returns {string}
   */
  build(filters) {
    if (!(filters instanceof Array)) {
      filters = [filters];
    }

    const filterStrings = filters.map(filter => {
      return filter.toString();
    });

    return filterStrings.join(' AND ');
  }

  toString() {
    return this.filterString;
  }
}

module.exports = Filter;
