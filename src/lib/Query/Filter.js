'use strict';

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

const AND = ' AND ';
const OR = ' OR ';

class Filter {
  constructor(filter, defaultDelim) {
    this.defaultDelim = defaultDelim | AND;
    this.filter       = this.parse(filter, defaultDelim);
    this.filterString = this.build(this.filter);
  }

  parse(content, delim, fieldName) {
    console.log(content);
    if (content instanceof Object) {
      let filters = null;

      if (content instanceof Array) {
        filters = content.map(value => {
          return this.parse(value, delim);
        });

      } else {
        filters = [];

        for (let name in content) {
          let value     = content[name];
          let operation = null;

          if (Object.keys(value).length !== 0) {
            switch (name) {
              case 'to':
                operation = new ToOperation({value});
                break;
              case 'or':
                operation = new BooleanOperation({name, operator: OR, value: this.parse(value, OR, name)});
                break;
              case 'and':
                operation = new BooleanOperation({name, operator: AND, value: this.parse(value, AND, name)});
                break;
              default:
                if (value instanceof Object) {
                  value     = this.parse(value, delim);
                  operation = new FieldOperation({name, value});
                } else if (isNaN(name)) {
                  operation = new FieldOperation({name, value});
                } else {
                  operation = value;
                }

                break;
            }
          }

          if (operation) {
            filters.push(operation);
          }
        }
      }

      let results = filters.join(delim);
      
      if (fieldName) {
     //   results = '(' + results + ')';
      }
      
      return results;
    }

    return content;
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

    return filterStrings.join(AND);
  }

  toString() {
    return this.filterString;
  }
}

module.exports = Filter;
