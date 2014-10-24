'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var salt = 'kiSyAWnj9VDVIfI3u7zj';
var hashed = 'HuPoD7hAPQ2CF9jsfzf3UESqM4vlB5DjEZ2CGCpkLbw=';

module.exports = function (n) {
  n.plan(8);

  n.equal(new Blind().hash(plainText, salt), hashed, 'should hash a value');

  new Blind().hash(plainText, salt, function (err, value) {
    n.equal(value, hashed, 'should hash a value asynchronously');
  });

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.binaryEncoding = 'xyz';
      blind.hash(plainText, salt);
    }, 'should reject an invalid value');
  });

  n.test('property hashAlgorithm', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.hashAlgorithm = 'xyz';
      blind.hash(plainText, salt);
    }, 'should reject an invalid value');
  });

  n.test('property hashRounds', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.hashRounds = 'xyz';
      blind.hash(plainText, salt);
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.hashRounds = -1;
      blind.hash(plainText, salt);
    }, 'should reject an out-of range number');
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 'xyz';
      blind.hash(plainText, salt);
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = -1;
      blind.hash(plainText, salt);
    }, 'should reject an out-of range number');
  });


  n.test('argument data', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().hash(10, salt); }, 'should reject a non-string');

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 15;
      blind.hash('abcdefghijklmnop', salt);
    }, 'should reject a string that is too long');
  });

  n.test('argument salt', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().hash(plainText, 10); }, 'should reject a non-string');
    t.throws(function () { new Blind().hash(plainText, 'abcde'); }, 'should reject a non-binary-encoded string');
  });
};
