'use strict';

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

const AND = ' AND ';
const OR  = ' OR ';

/**
 * Filter class
 */
class Filter {
  /**
   *
   * @param filter
   * @param defaultObjectOperator - Default operator used for objects, when operator is not specified.
   * @param defaultArrayOperator - Solr default Operator, 'OR'
   */
  constructor(filter, defaultObjectOperator, defaultArrayOperator) {
    defaultObjectOperator = defaultObjectOperator || AND;
    defaultArrayOperator  = defaultArrayOperator || OR;
    this.filter           = filter;

    this.defaultObjectOperator = this.checkOperator(defaultObjectOperator);
    this.defaultArrayOperator  = this.checkOperator(defaultArrayOperator);
    if (filter) {
      this.toString();
    }
  }

  /**
   * Verified passed operator is allowed.
   *
   * @param operator
   * @returns {*}
   */
  checkOperator(operator) {
    const checkOperator = operator.trim().toUpperCase();
    switch (checkOperator) {
      case 'AND':
        operator = AND;
        break;
      case 'OR':
        operator = OR;
        break;
      default:
        throw new Error('Operator (' + operator + ') unknown');
    }

    return operator;
  }

  /**
   *
   * @returns {string|*}
   */
  toString() {

    if (!this.filterString) {
      this.filter       = this.parse(null, this.filter, this.defaultObjectOperator, this.defaultArrayOperator);
      this.filterString = this.build(this.filter);
    }

    return this.filterString;
  }

  /**
   *
   * @param name
   * @param value
   * @param operator
   * @returns {*}
   */
  parseOperation(name, value, operator, defaultArrayOperator) {
    let operation = null;

    value = this.parse(name, value, operator, defaultArrayOperator);

    if (value instanceof Object) {
      operation = new BooleanOperation({name, value});
    } else {
      operation = new FieldOperation({name, value});
    }

    return operation;
  }

  /**
   *
   * @param content
   * @param delim
   * @returns {*}
   */
  parseArray(content, operator) {
    operator = operator || this.defaultArrayOperator;

    let results = null;
    let vals    = [];
    for (let i in content) {
      let value = content[i];
      if (value instanceof Object) {
        value = '(' + this.parseObject(value, operator, this.defaultArrayOperator) + ')';
      } else if (isNaN(value)) {
        value = '"' + value + '"';
      }

      vals.push(value);
    }

    if (vals.length > 1) {
      if (operator === this.defaultArrayOperator) {
        results = '(' + vals.join(' ') + ')';
      } else {
        results = '(' + vals.join(operator) + ')';
      }
    } else {
      results = vals.join();
    }

    return results;
  }

  /**
   *
   * @param content
   * @returns {Array}
   */
  parseObject(value, operator, arrayOperator) {
    const filters = [];
    operator      = operator || this.defaultObjectOperator;
    arrayOperator = arrayOperator || this.defaultArrayOperator;

    for (let name in value) {
      let content = value[name];
      let results = null;

      /** Check if content is an object **/
      switch (name) {
        case 'to':
          results = new ToOperation({value: content});
          break;

        case 'or':
          /**
           * if content is an array, set the arrayOperator to the current operator
           * {tags: {or: ["a","b"]}}
           */
          if (content instanceof Array) {
            results = this.parseOperation(null, content, OR, OR);
          } else {
            results = this.parseOperation(null, content, OR, arrayOperator);
          }
          break;

        case 'and':
          /**
           * if content is an array, set the arrayOperator to the current operator
           * {tags: {and: ["a","b"]}}
           */
          if (content instanceof Array) {
            results = this.parseOperation(null, content, AND, AND);
          } else {
            results = this.parseOperation(null, content, AND, arrayOperator);

          }
          break;

        default:
          results = this.parse(name, content, operator, arrayOperator);

          break;
      }

      if (results) {
        filters.push(results);
      }
    }

    return filters.join(operator);
  }

  /**
   *
   * @param content
   * @param operator
   * @returns {*}
   */
  parse(name, content, operator, arrayOperator) {
    let results = content;

    this.parseDepth = this.parseDepth || 0;
    this.parseDepth++;

    if (content instanceof Object) {
      if (content instanceof Array) {
        results = this.parseArray(content, arrayOperator);

      } else {
        results = this.parseObject(content, operator, arrayOperator);

      }

      if (results.length) {
        results = new FieldOperation({name, value: results});
      }
    } else if (isNaN(name)) {
      if (!isNaN(results) || (isNaN(results) && results.length)) {
        results = new FieldOperation({name, value: results});
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

}

module.exports = Filter;
