'use strict';

/**
 * @ngdoc service
 * @name studyMultiViewsApp.DataProxy
 * @description
 * # DataProxy
 * Factory in the studyMultiViewsApp.
 */
 angular.module('studyMultiViewsApp')
 .factory('DataProxy', ['MainProxy', 'ChartsProxy', function (Main, Charts) {
 	return {
        main: Main.main,
        charts: Charts.main
    };
}]);
