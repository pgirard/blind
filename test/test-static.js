'use strict';

var Blind = require('../index');

module.exports = function (n) {
  n.test('create()', function (t) {
    t.ok(Blind.create() instanceof Blind, 'should instantiate a new Blind object');
    t.end();
  });
};
