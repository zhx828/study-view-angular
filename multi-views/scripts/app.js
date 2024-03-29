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
    'angular-packery',
    'datatables',
    'datatables.scroller'
  ])
  .constant('dc', window.dc)
  .constant('crossfilter', window.crossfilter)
  //Lodash object used in angular
  .constant('_', window._)
  .constant('ChartColors', ['#2986e2','#dc3912','#f88508','#109618','#990099','#0099c6','#dd4477','#66aa00','#b82e2e','#316395','#994499','#22aa99','#aaaa11','#6633cc','#e67300','#8b0707','#651067','#329262','#5574a6','#3b3eac','#b77322','#16d620','#b91383','#f4359e','#9c5935','#a9c413','#2a778d','#668d1c','#bea413','#0c5922','#743411','#743440','#9986e2','#6c3912','#788508','#609618','#790099','#5099c6','#2d4477','#76aa00','#882e2e','#916395','#794499','#92aa99','#2aaa11','#5633cc','#667300','#100707','#751067','#229262','#4574a6','#103eac','#177322','#66d620','#291383','#94359e','#5c5935','#29c413','#6a778d','#868d1c','#5ea413','#6c5922','#243411','#103440','#2886e2','#d93912','#f28508','#110618','#970099','#0109c6','#d10477','#68aa00','#b12e2e','#310395','#944499','#24aa99','#a4aa11','#6333cc','#e77300','#820707','#610067','#339262','#5874a6','#313eac','#b67322','#13d620','#b81383','#f8359e','#935935','#a10413','#29778d','#678d1c','#b2a413','#075922','#763411','#773440','#2996e2','#dc4912','#f81508','#104618','#991099','#0049c6','#dd2477','#663a00','#b84e2e','#312395','#993499','#223a99','#aa1a11','#6673cc','#e66300','#8b5707','#656067','#323262','#5514a6','#3b8eac','#b71322','#165620','#b99383','#f4859e','#9c4935','#a91413','#2a978d','#669d1c','#be1413','#0c8922','#742411','#744440','#2983e2','#dc3612','#f88808','#109518','#990599','#0092c6','#dd4977','#66a900','#b8282e','#316295','#994199','#22a499','#aaa101','#66310c','#e67200','#8b0907','#651167','#329962','#5573a6','#3b37ac','#b77822','#16d120','#b91783','#f4339e','#9c5105','#a9c713','#2a710d','#66841c','#bea913','#0c5822','#743911','#743740','#298632','#dc3922','#f88588','#109658','#990010','#009916','#dd4447','#66aa60','#b82e9e','#316365','#994489','#22aa69','#aaaa51','#66332c','#e67390','#8b0777','#651037','#329232','#557486','#3b3e4c','#b77372','#16d690','#b91310','#f4358e','#9c5910','#a9c493','#2a773d','#668d5c','#bea463','#0c5952','#743471','#743450','#2986e3','#dc3914','#f88503','#109614','#990092','#0099c8','#dd4476','#66aa04','#b82e27','#316397','#994495','#22aa93','#aaaa14','#6633c1','#e67303','#8b0705','#651062','#329267','#5574a1','#3b3ea5'])
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