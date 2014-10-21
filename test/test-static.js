'use strict';

var assert = require('assert');

var Blind = require('../index');

module.exports = function (it) {
  it.describe('create()', function (it) {

    it.should('instantiate a new Blind object', function () {
      assert.instanceOf(Blind.create(), Blind);
    });
  });
};
