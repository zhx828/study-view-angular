'use strict';

describe('Service: DataPool', function () {

  // load the service's module
  beforeEach(module('angularStudyViewApp'));

  // instantiate service
  var DataPool;
  beforeEach(inject(function (_DataPool_) {
    DataPool = _DataPool_;
  }));

  it('should do something', function () {
    expect(!!DataPool).toBe(true);
  });

});
