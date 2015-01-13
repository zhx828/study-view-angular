'use strict';

describe('Service: MainProxy', function () {

  // load the service's module
  beforeEach(module('studyMultiViewsApp'));

  // instantiate service
  var MainProxy;
  beforeEach(inject(function (_MainProxy_) {
    MainProxy = _MainProxy_;
  }));

  it('should do something', function () {
    expect(!!MainProxy).toBe(true);
  });

});
