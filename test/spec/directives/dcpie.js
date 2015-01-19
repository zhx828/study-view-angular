'use strict';

describe('Directive: dcPie', function () {

  // load the directive's module
  beforeEach(module('studyMultiViewsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dc-pie></dc-pie>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dcPie directive');
  }));
});
