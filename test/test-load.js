/*global describe, beforeEach, it*/
'use strict';

var assert  = require('assert');

describe('klei generator', function () {
  it('can be imported without blowing up', function () {
    var app = require('../app');
    assert(app !== undefined);
  });
});

describe('klei:api generator', function () {
  it('can be imported without blowing up', function () {
    var api = require('../api');
    assert(api !== undefined);
  });
});
