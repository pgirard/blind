'use strict';

var assert = require('assert');

var Blind = require('../index');

module.exports = function (it, shared) {
  it.describe('random()', function (it) {

    it.should('generate a base64 value', function () {
      var blind = Blind.create({ binaryEncoding: 'base64' });
      return blind.random(15).then(function (value) {
        shared.randomValue = value;
        assert.strictEqual(value.length, 20);
      });
    });

    it.should('generate a hex value', function () {
      var blind = Blind.create({ binaryEncoding: 'hex' });
      return blind.random(15).then(function (value) {
        assert.strictEqual(value.length, 30);
      });
    });

    it.describe('property maxRandomLength', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.maxRandomLength = 'xyz';
        return blind.random(15).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.maxRandomLength = 6;
        return blind.random(15).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('argument length', function (it) {

      it.should('reject a non-number', function () {
        return Blind.create().random('xyz').catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        return Blind.create().random(6).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });
  });
};
