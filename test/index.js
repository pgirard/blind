'use strict';

var test = require('tape');

test(function (t) {
  t.test('is', require('./test-is'));
  t.test('blind', require('./test-blind'));
});
