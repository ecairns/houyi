"use strict";

const FieldOperation   = require('./FieldOperation');
const BooleanOperation = require('./BooleanOperation');
const ToOperation      = require('./ToOperation');

const test1 = {
    types: 1,
    to   : {},
    and  : {},
    or   : {}
};
const test2 = {
    types: 1,
    keys : 1,
    to   : [],
    and  : [],
    or   : []
};

class Filter {
    constructor(filter) {
        this.filter       = this.parse(filter);
//        this.filterString = this.build(this.filter);
    }

    parse(filters) {
        let filter = {};

        for (let name in filters) {
            let value = filters[name];

            switch (name) {
                case 'to':
                    return new ToOperation({value});
                    break;
                case 'or':
                    return new BooleanOperation({name, operator: ' OR ', value: this.parse(value)});
                    break;
                case 'and':
                    return new BooleanOperation({name, operator: ' AND ', value: this.parse(value)});
                    break;
                default:
                    if (value instanceof Object) {
                        value = this.parse(value);
                    }

                    return new FieldOperation({name, value});
                    break;
            }

            return filter;
        }
    }

    buildOne(filter) {
        console.log("---------------------");
        console.log(typeof filter);
        console.log(filter);
        console.log("---------------------");
        console.log("");
        return filter;
        /*
         let filterString = '';
         if (filter instanceof Field) {
         filterString = `${filter.name}:`;
         if (filter.value instanceof Object) {
         if (!filter.value.start && !filter.value.end) filterString += this.build(filter.value);
         else filterString += rangeFilter(filter.value.start, filter.value.end);
         }
         else filterString += filter.value;
         } else if (filter instanceof BooleanOperation) {
         filterString = '(' + filter.value.map(filters => this.build(filters)).join(filter.operator) + ')';
         } else if (filter.start || filter.end) filterString += rangeFilter(filter.start, filter.end);
         else filterString = filter;

         return filterString;
         */
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

        console.log("OKKKKKKKKKKKKKKKKKKKKK");
        console.log("OKKKKKKKKKKKKKKKKKKKKK");
        console.log("OKKKKKKKKKKKKKKKKKKKKK");
        console.log(filters);
        const filterStrings = filters.map(filter => {
//            return this.buildOne(filter);
        });
        console.log("OKKKKKKKKKKKKKKKKKKKKK");
        console.log(filterStrings);

        return filterStrings[0];
    }

    toString() {
        return this.filterString;
    }
}

module.exports = Filter;
