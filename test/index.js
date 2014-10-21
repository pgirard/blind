'use strict';

var it = require('it');

require('./spec-2space-reporter');

var testIs = require('./test-is');
var testBlind = require('./test-blind');

testIs(it);
testBlind(it);

it.reporter('spec-2space');
it.run();
