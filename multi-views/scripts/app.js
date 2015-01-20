'use strict';

/**
 * @ngdoc overview
 * @name studyMultiViewsApp
 * @description
 * # studyMultiViewsApp
 *
 * Main module of the application.
 */
angular
  .module('studyMultiViewsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-underscore',
    'ui.bootstrap',
    'ui.dashboard',
    'angularDc',
    'gridster'
  ])
  .constant('dc', dc)
  .constant('crossfilter', crossfilter)
  //Lodash object used in angular
  .constant('_', window._)
  //$q.allSettled comes from http://jsfiddle.net/Zenuka/pHEf9/
  //Angular team is planning to add this function in next release
  //Need to remove once updated in angular
  .config(['$provide', '$routeProvider', function ($provide, $routeProvider) {
  	$routeProvider
      	.when('/', {
	        templateUrl: 'views/main.html',
	        controller: 'MainCtrl'
    	})
      	.otherwise({
        	redirectTo: '/'
      	});
        
	$provide.decorator('$q', ['$delegate', function ($delegate) {
		var $q = $delegate;

		// Extention for q
		$q.allSettled = $q.allSettled || function (promises) {
			var deferred = $q.defer();
			if (angular.isArray(promises)) {
				var states = [];
				var results = [];
				var didAPromiseFail = false;

				// First create an array for all promises setting their state to false (not completed)
				angular.forEach(promises, function (promise, key) {
					states[key] = false;
				});

				// Helper to check if all states are finished
				var checkStates = function (states, results, deferred, failed) {
					var allFinished = true;
					angular.forEach(states, function (state) {
						if (!state) {
							allFinished = false;
							return;
						}
					});
					if (allFinished) {
						if (failed) {
							deferred.reject(results);
						} else {
							deferred.resolve(results);
						}
					}
				};

				// Loop through the promises
				// a second loop to be sure that checkStates is called when all states are set to false first
				angular.forEach(promises, function (promise, key) {
					$q.when(promise).then(function (result) {
						states[key] = true;
						results[key] = result;
						checkStates(states, results, deferred, didAPromiseFail);
					}, function (reason) {
						states[key] = true;
						results[key] = reason;
						didAPromiseFail = true;
						checkStates(states, results, deferred, didAPromiseFail);
					});
				});
			} else {
				throw 'allSettled can only handle an array of promises (for now)';
			}

			return deferred.promise;
		};

		return $q;
	}]);
}]);