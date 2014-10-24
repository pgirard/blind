'use strict';

var Blind = require('../index');

module.exports = function (n) {
  n.plan(7);

  n.equals(new Blind({ binaryEncoding: 'base64' }).random(15).length, 20, 'should generate a base64 value');
  n.equals(new Blind({ binaryEncoding: 'hex' }).random(15).length, 30, 'should generate a base64 value');
  n.equals(new Blind({ randomLength: 45 }).random().length, 60, 'should generate a value using randomLength');

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.binaryEncoding = 'xyz';
      blind.random(15);
    }, 'should reject an invalid value');
  });

  n.test('property maxRandomLength', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.maxRandomLength = 'xyz';
      blind.random(15);
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.maxRandomLength = 6;
      blind.random(15);
    }, 'should reject an out-of range number');
  });

  n.test('property randomLength', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.randomLength = 'xyz';
      blind.random();
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.randomLength = 6;
      blind.random();
    }, 'should reject an out-of range number');
  });

  n.test('argument length', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().random('xyz'); }, 'should reject a non-number');
    t.throws(function () { new Blind().random(6); }, 'should reject an out-of range number');
  });
};
