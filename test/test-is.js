'use strict';

var is = require('../is');

module.exports = function (n) {
  n.test('base64()', function (t) {
    t.ok(is.base64('wxyzWXYZ/+=='), 'should accept a valid base64 value');
    t.notOk(is.base64('wxyzWXYZ1234/+'), 'should reject an invalid base64 value');
    t.end();
  });

  n.test('hex()', function (t) {
    t.ok(is.hex('abcd1234'), 'should accept a valid hex value');
    t.notOk(is.hex('wxyz1234'), 'should reject an invalid hex value');
    t.end();
  });
};
