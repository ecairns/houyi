'use strict';

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

const AND = ' AND ';
const OR  = ' OR ';

class Filter {
  /**
   *
   * @param filter
   * @param defaultOperator - Solr default Operator, 'OR'
   */
  constructor(filter, defaultOperator) {
    if (!defaultOperator) {
      this.defaultOperator = OR;
    } else {
      const operator = defaultOperator.trim().toLowerCase();
      switch (operator) {
        case 'and':
          this.defaultOperator = AND;
          break;
        case 'or':
          this.defaultOperator = OR;
          break;
        default:
          throw new Error('Operator (' + defaultOperator + ') unknown')
      }
    }

    this.filter       = this.parse(filter, AND);
    this.filterString = this.build(this.filter);
  }

  /**
   *
   * @param content
   * @param delim
   * @returns {*}
   */
  parseArray(content, delim) {
    let results = null;
    let vals  = [];
    for (let i in content) {
      let value = content[i];
      if (value instanceof Object) {
        value = '(' + this.parseObject(value) + ')';
      }

      vals.push(value);
    }

    results = '(' + vals.join(delim) + ')';

    return results;
  }

  /**
   *
   * @param content
   * @returns {Array}
   */
  parseObject(content) {
    const filters = [];

    for (let name in content) {
      let value     = content[name];
      let operation = null;

      /** Check if value is an object **/
      switch (name) {
        case 'to':
          operation = new ToOperation({value});
          break;

        case 'or':
          value = this.parse(value, OR, name);

          if (value instanceof Object) {
            operation = new BooleanOperation({name, operator: AND, value: value});
          } else {
            operation = [value];
          }
          break;

        case 'and':
          value = this.parse(value, AND, name);

          if (value instanceof Object) {
            operation = new BooleanOperation({name, operator: AND, value: value});
          } else {
            operation = [value];
          }
          break;

        default:
          if (value instanceof Object) {
            if (value instanceof Array) {
              value = this.parseArray(value, this.defaultOperator);
            } else {
              value = this.parse(value, AND, name);
            }

            if (value.length) {
              operation = new FieldOperation({name, value: value});
            }

          } else if (isNaN(name)) {
            if (value.length) {
              operation = new FieldOperation({name, value});
            }

          } else {
            operation = value;
          }

          break;
      }

      if (operation) {
        filters.push(operation);
      }
    }

    return filters.join(AND);
  }

  /**
   *
   * @param content
   * @param delim
   * @returns {*}
   */
  parse(content, delim) {
    this.parseDepth = this.parseDepth || 0;
    this.parseDepth++;

    let results = content;
    if (content instanceof Object) {
      let filters = null;

      if (content instanceof Array) {
        results = this.parseArray(content, delim);

      } else {
        results = this.parseObject(content);
      }
    }

    this.parseDepth--;
    return results;
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
