'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var salt = 'kiSyAWnj9VDVIfI3u7zj';

module.exports = function (n) {
  n.plan(7);

  Blind.create().hash(plainText, salt).then(function (value) {
    n.equal(value, 'Pk5KTHuPUW9HtNBb/Ga4d8JBR1qELDmyYDzMEUr0hQj6fz7p26jDSNRkkjKwnaCh3/Qyzy0ehlbb+uRc', 'should hash a value');
  });

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.binaryEncoding = 'xyz';
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property hashLength', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.hashLength = 'xyz';
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.hashLength = -1;
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('property hashRounds', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.hashRounds = 'xyz';
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.hashRounds = -1;
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.maxDataLength = 'xyz';
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.maxDataLength = -1;
    blind.hash(plainText, salt).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('argument data', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.maxDataLength = 15;
    blind.hash('abcdefghijklmnop', salt).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a string that is too long');
    });
  });

  n.test('argument salt', function (t) {
    t.plan(2);

    Blind.create().hash(plainText, 10).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    Blind.create().hash(plainText, 'abcde').catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-binary-encoded string');
    });
  });
};
