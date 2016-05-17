'use strict';

const should = require('chai').should;
const Filter = require(process.cwd() + '/src/Lib/Query').Filter;

describe('Filter', function () {
    describe('By Value', function () {
        describe('Find document by id', function () {
            it('should find the document id:1', function () {
                let filter = new Filter({
                    id: 1
                });

                filter.filterString.should.equal('id:1');
            });

            it('should find the document id:10 and typeId:20', function () {
                let filter = new Filter({
                    id: 10,
                    typeId: 20
                });

                filter.filterString.should.equal('id:10 AND typeId:20');
            });
        });
    });

    describe('By Arrays', function () {
        describe('Find list of docs based on an array of ids', function () {
            it('should equal id:(1 OR 2 OR 3)', function () {
                let filter = new Filter({
                    id: {
                        or: [1, 2, 3]
                    }
                });

                filter.filterString.should.equal('id:(1 OR 2 OR 3)');
            });
        });

        describe('Find list of docs based on matching all tags', function () {
            it('should equal tags:(sports AND nba)', function () {
                let filter = new Filter({
                    tags: {
                        and: ['sports', 'nba']
                    }
                });

                filter.filterString.should.equal('tags:(sports AND nba)');
            });
        });
    });

    describe('By Multiple Types', function () {
        describe('Find urgency nba sports articles not referencing ibaka or westbrook', function () {
            it('should equal (type:1 AND tags:(sports AND nba) AND -tags:(nfl OR nhl) AND urgency:[1 TO 2})', function () {
                var filter = new Filter({
                    and: {
                        type   : 1,
                        tags   : {
                            and: ['sports', 'nba' ]
                        },
                        '-tags': {
                            or: ['nfl', 'nhl']
                        },
                        urgency: {
                            to: {
                                gte: 1,
                                lt : 2
                            }
                        }
                    }
                });

                filter.filterString.should.equal('(type:1 AND tags:(sports AND nba) AND -tags:(nfl OR nhl) AND urgency:[1 TO 2})');
            });
        });
    });
});