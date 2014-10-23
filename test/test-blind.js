'use strict';

module.exports = function (t) {
  t.test('constructor', require('./test-constructor'));
  t.test('random()', require('./test-random'));
  t.test('encrypt()', require('./test-encrypt'));
  t.test('decrypt()', require('./test-decrypt'));
  t.test('hash()', require('./test-hash'));
};
