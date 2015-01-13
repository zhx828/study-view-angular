'use strict';

describe('Service: ChartsProxy', function () {

  // load the service's module
  beforeEach(module('studyMultiViewsApp'));

  // instantiate service
  var ChartsProxy;
  beforeEach(inject(function (_ChartsProxy_) {
    ChartsProxy = _ChartsProxy_;
  }));

  it('should do something', function () {
    expect(!!ChartsProxy).toBe(true);
  });

});
