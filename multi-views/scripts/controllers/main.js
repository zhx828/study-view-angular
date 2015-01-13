'use strict';

/**
 * @ngdoc function
 * @name StudyMultiViewsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the StudyMultiViewsApp
 */
angular.module('StudyMultiViewsApp')
  .controller('MainCtrl',
  	['$scope', 'DataProxy', 'DataPool',
  	function ($scope, DataProxy, DataPool) {
  		function init() {
  			//Get global variables
  			getGlobalV();
  			getSummrayData();

  			//function()
  			//if no data available
  		}

  		function getGlobalV() {
  			$scope.studyId = 'ucec_tcga';
  			$scope.caseSetId = 'ucec_tcga_all';
  			$scope.cnaProfileId = 'ucec_tcga_gistic';
  			$scope.mutationProfileId = 'ucec_tcga_mutations';
  		}

  		function getSummrayData() {
  			DataPool.getData().then(
		    //Callback for All promises have been resolved
	    	function(data){
		    	var main = DataProxy.main(data);
		    	console.log(main);
		    },
		    //Call back for Not all promiseds have been resolved
		    function(data){
		    	DataProxy.main(data);
		    });
  		}

	    init();
	}
  ]);
