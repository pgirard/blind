'use strict';

var Blind = require('../index');

module.exports = function (n) {
  n.plan(5);

  Blind.create({ binaryEncoding: 'base64' }).random(15).then(function (value) {
    n.equals(value.length, 20, 'should generate a base64 value');
  });

  Blind.create({ binaryEncoding: 'hex' }).random(15).then(function (value) {
    n.equals(value.length, 30, 'should generate a hex value');
  });

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.binaryEncoding = 'xyz';
    blind.random(15).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property maxRandomLength', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.maxRandomLength = 'xyz';
    blind.random(15).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.maxRandomLength = 6;
    blind.random(15).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('argument length', function (t) {
    t.plan(2);

    Blind.create().random('xyz').catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    Blind.create().random(6).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });
};
