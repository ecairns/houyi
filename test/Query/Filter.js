'use strict';

const should = require('chai').should;
const Filter = require(process.cwd() + '/src/Lib/Query').Filter;

describe('Filter', function () {
    describe('By Value', function () {
        describe('Find document by id', function () {
            let filter = new Filter({
                id: 1
            });

            it('should find the document id:1', function () {
                filter.filterString.should.equal('id:1');
            });
        });
    });

    describe('By Arrays', function () {
        describe('Find list of docs based on an array of ids', function () {
            let filter = new Filter({
                id: {
                    or: [1, 2, 3]
                }
            });

            it('should equal id:(1 OR 2 OR 3)', function () {
                filter.filterString.should.equal('id:(1 OR 2 OR 3)');
            });
        });

        describe('Find list of docs based on matching all tags', function () {
            let filter = new Filter({
                tags: {
                    and: ['sports', 'thunder', 'nba']
                }
            });

            it('should equal tags:(sports AND thunder AND nba)', function () {
                filter.filterString.should.equal('tags:(sports AND thunder AND nba)');
            });
        });
    });

    describe('By Multiple Types', function () {
        describe.only('Find urgence nba thunder sports articles not referencing ibaka or westbrook', function () {
            var filter = new Filter({
                and: {
                    type   : 1,
                    tags   : {
                        and: ['sports', 'nba', 'thunder']
                    },
                    '-tags': {
                        or: ['westbrook', 'ibaka']
                    },
                    urgency: {
                        to: {
                            gte: 1,
                            lt: 2
                        }
                    }
                }
            });

            it('should equal (type:1 AND tags:(sports AND nba AND thunder) AND -tags:(westbrook OR ibaka) AND urgency:[1 TO 2})', function () {
                filter.filterString.should.equal('(type:1 AND tags:(sports AND nba AND thunder) AND -tags:(westbrook OR ibaka) AND urgency:[1 TO 2})');
            });
        });
    });
});