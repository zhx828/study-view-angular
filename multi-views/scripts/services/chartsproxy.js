'use strict';

/**
 * @ngdoc service
 * @name studyMultiViewsApp.ChartsProxy
 * @description
 * # ChartsProxy
 * Factory in the studyMultiViewsApp.
 */
angular.module('studyMultiViewsApp')
  .factory('ChartsProxy', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      main: function () {
        return meaningOfLife;
      }
    };
  });
