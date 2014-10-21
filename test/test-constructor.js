'use strict';

var Blind = require('../index');

module.exports = function (n) {
  n.test('option binaryEncoding', function (t) {
    t.equal(Blind.create({ binaryEncoding: 'hex' }).binaryEncoding, 'hex', 'should accept a valid value');
    t.throws(function () { Blind.create({ binaryEncoding: 'xyz' }); }, 'should reject an invalid value');
    t.end();
  });

  n.test('option encryptAlgorithm', function (t) {
    t.equal(Blind.create({ encryptAlgorithm: 'aes-256-cbc' }).encryptAlgorithm, 'aes-256-cbc', 'should accept a valid value');
    t.throws(function () { Blind.create({ encryptAlgorithm: 'xyz' }); }, 'should reject an invalid value');
    t.end();
  });

  n.test('option hashLength', function (t) {
    t.equal(Blind.create({ hashLength: 20 }).hashLength, 20, 'should accept a valid value');
    t.throws(function () { Blind.create({ hashLength: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { Blind.create({ hashLength: -1 }); }, 'should reject an out-of range number');
    t.end();
  });

  n.test('option hashRounds', function (t) {
    t.equal(Blind.create({ hashRounds: 20 }).hashRounds, 20, 'should accept a valid value');
    t.throws(function () { Blind.create({ hashRounds: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { Blind.create({ hashRounds: -1 }); }, 'should reject an out-of range number');
    t.end();
  });

  n.test('option maxDataLength', function (t) {
    t.equal(Blind.create({ maxDataLength: 8192 }).maxDataLength, 8192, 'should accept a valid value');
    t.throws(function () { Blind.create({ maxDataLength: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { Blind.create({ maxDataLength: -1 }); }, 'should reject an out-of range number');
    t.end();
  });

  n.test('option maxRandomLength', function (t) {
    t.equal(Blind.create({ maxRandomLength: 256 }).maxRandomLength, 256, 'should accept a valid value');
    t.throws(function () { Blind.create({ maxRandomLength: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { Blind.create({ maxRandomLength: -1 }); }, 'should reject an out-of range number');
    t.end();
  });
};
