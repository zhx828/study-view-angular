'use strict';

/**
 * @ngdoc function
 * @name studyMultiViewsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the studyMultiViewsApp
 */
angular.module('studyMultiViewsApp')
  .controller('MainCtrl',
  	['$scope', '$compile', 'DataProxy', 'DataPool', 'crossfilter', '$window',
  	function ($scope, $compile, DataProxy, DataPool, crossfilter, $window) {
  		function init() {
  			//Get global variables
        	var startTS = new Date().getTime();
  			getGlobalV();
  			getSummrayData(function(data){
  				var main = DataProxy.main(data);
                for(var key in main) {
                    $scope[key] = main[key];
                }

                //Set test attrs
                $scope.testAttr = {};
                var i =0;
                for(var key in $scope.attr) {
                    $scope.testAttr[key] = $scope.attr[key];
                    i++;
                    if(i > 6){ break;}
                }
                setCrossFilters();
        		timeDiff(startTS, new Date().getTime());
                console.log($scope);
  			});
  			
  			//function()
  			//if no data available
  		}

  		function timeDiff(startTS, endTS) {
  			var difference = endTS - startTS;

	        var daysDifference = Math.floor(difference/1000/60/60/24);
	        difference -= daysDifference*1000*60*60*24;

	       	var hoursDifference = Math.floor(difference/1000/60/60);
	        difference -= hoursDifference*1000*60*60;

	        var minutesDifference = Math.floor(difference/1000/60);
	        difference -= minutesDifference*1000*60;

	        var secondsDifference = Math.floor(difference/1000);

	        console.log('------------------------------------------------');
  			console.info('Time difference:', daysDifference + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ');
  			console.log('------------------------------------------------');
  		}

  		function getGlobalV() {
  			$scope.studyId = 'ucec_tcga';
  			$scope.caseSetId = 'ucec_tcga_all';
  			$scope.cnaProfileId = 'ucec_tcga_gistic';
  			$scope.mutationProfileId = 'ucec_tcga_mutations';
  		}

  		function getSummrayData(callback) {
  			DataPool.getData().then(
		    //Callback for All promises have been resolved
	    	function(data){
		    	if(angular.isFunction(callback)) {
		    		callback(data);
		    	}
		    },
		    //Call back for Not all promiseds have been resolved
		    function(data){
		    	if(angular.isFunction(callback)) {
		    		callback(data);
		    	}
		    });
  		}

        // function dcDimensionGroup() {

        // }

  		//Generate two crossfilters for two visions
  		function setCrossFilters() {
        //crossfilter is global library
            $scope.cf = {
                sample: crossfilter($scope.sample.arr),
                patient: crossfilter($scope.patient.arr)
            };

            console.log($scope);
            var widgetDefinitions = [
              {
                name: 'dcPie',
                directive: 'dc-pie'
              }
            ];
            var defaultWidgets = [];
            var i = 0;
            for (var key in $scope.attr) {
                var datum = $scope.attr[key];
                if(i < 10) {
                    if(datum.dcType === 'pie') {
                        defaultWidgets.push({
                            name: 'dcPie',
                            directive: 'dc-pie',
                            attrs: {
                                'cf': 'cf',
                                'attrid': datum.attr_id,
                                'group': datum.group
                            }
                        });
                        i++;
                    }
                }else {
                    break;
                }
            }

            // $scope.gridsterOpts = {
            //     columns: 6,
            //     defaultSizeX: 1, // the default width of a gridster item, if not specifed
            //     defaultSizeY: 1,
            //     colWidth: 175,
            //     swapping: true,
            //     draggable: {
            //         enabled: true,
            //         handle: '.study-view-drag-icon'
            //     },
            //     resizable: {
            //         enabled: false,
            //         handles: ['n', 'e', 's', 'w', 'ne', 'sw']
            //     }
            // };

            $scope.dashboardOptions = {
                widgetButtons: false,
                widgetDefinitions: widgetDefinitions,
                defaultWidgets: defaultWidgets
            };

            // $scope.$on('gridster-resized', function(event, newSizes){
            //     console.log(newSizes);
            // });

            // var w = angular.element($window);
            // $scope.getWindowDimensions = function () {
            //     return {
            //         'h': w.height(),
            //         'w': w.width()
            //     };
            // };
            // $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
            //     if(newValue.w < 992) {
            //         $scope.gridsterOpts.columns = 4;
            //     }else  if(newValue.w < 1200) {
            //         $scope.gridsterOpts.columns = 5;
            //     }else {
            //         $scope.gridsterOpts.columns = 6;
            //     }
            // }, true);

            // w.bind('resize', function () {
            //     $scope.$apply();
            // });

 			console.log('------------------------------------------------');
  			console.log('Patient crossfilter has ', $scope.cf.patient.size(), 'data');
  			console.log('Sample crossfilter has ', $scope.cf.sample.size(), 'data');
 			console.log('------------------------------------------------');
  		}

	    init();
	}
]);
