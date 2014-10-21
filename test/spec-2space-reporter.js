'use strict';

var _ = require('../node_modules/it/lib/extended');
var Reporter = require('../node_modules/it/lib/formatters/reporter');
var characters = _.characters;
var style = _.style;
var multiply = _.multiply;
var indent = '  ';

Reporter.extend({
  instance: {
    testRun: function printTitle(test) {
      this._super(arguments);
      if (test.description) {
        var level = test.level, title = test.description;
        console.log(multiply(indent, level) + title);
      }
    },

    actionSuccess: function (action) {
        this._super(arguments);
        var level = action.level, summary = action.get('summary');
        console.log(style(multiply(indent, level) + characters.CHECK + ' %s (%dms)', ['green']), action.description, summary.duration);
    },

    actionPending: function (action) {
        this._super(arguments);
        var summary = action.get('summary'), level = action.level;
        console.log(style(multiply(indent, level) + characters.LAMBDA + ' %s (%dms)', ['cyan']), action.description, summary.duration);
    },

    actionError: function printError(action) {
        this._super(arguments);
        var level = action.level, summary = action.get('summary');
        console.log(style(multiply(indent, level) + characters.ITALIC_X + ' %s, (%dms)', ['red', 'bold']), action.description, summary.duration);
    }
  }
}).as(module).registerType('spec-2space');
