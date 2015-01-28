'use strict';

/**
 * @ngdoc directive
 * @name studyMultiViewsApp.directive:dcPie
 * @description
 * # dcPie
 */
angular.module('studyMultiViewsApp')
  .directive('dcPie', function (ChartColors) {
    return {
      restrict: 'A',
      templateUrl: 'views/widgets/dcPie.html',
      scope: {
        cf: '=',
        attrid: '@',
        groupName: '@group'
      },
      controller: function ($scope) {
        var naValue = ['na', 'unknown', '[unknown]', 'none'];
        if($scope.groupName === 'sample') {
            $scope.cf = $scope.cf.sample;
        }else {
            $scope.cf = $scope.cf.patient;
        }
        $scope.width =  140;
        $scope.height = 135;
        $scope.radius = ($scope.width - 20) /2;
        $scope.dimension = $scope.cf.dimension(function(d){
            if(!d[$scope.attrid] || naValue.indexOf(d[$scope.attrid].toLowerCase()) !== -1) {
                return "NA";
            }else{
                return d[$scope.attrid];
            }
        });
        $scope.group = $scope.dimension.group();
        $scope.lableKeys = $scope.group.top(Infinity).sort(function(a, b){
            if(a.key === 'NA') {
                $scope.hasNA = true;
                return 1;
            }
            if(b.key === 'NA') {
                $scope.hasNA = true;
                return -1;
            }
            if(a.value < b.value) {
                return 1;
            }else {
                return -1;
            }
        });
        $scope.label = function(d) { return d.value};
        $scope.ordering = function(d) { return -d.value};
        $scope.chartColors = _.first(ChartColors, $scope.lableKeys.length);
        if($scope.hasNA) {
            $scope.chartColors[$scope.chartColors.length-1] = '#cccccc';
        }
      },
      link: function postLink(scope, element, attrs) {
        element.qtip({
            content: {
                text: 'My content'
            }
        });
        // d3.select(element[0])
        // console.log(element);
        // console.log(attrs);
      }
    };
  })
  .directive('dcPieLabel', function (DTOptionsBuilder, DTColumnDefBuilder) {
      return {
        restrict: 'E',
        templateUrl: 'views/widgets/dcPieLabel.html',
        controller: function($scope) {
            $scope.dtOptions = DTOptionsBuilder
                            .newOptions()
                            .withDOM('tf')
                            .withScroller()
                            .withOption('deferRender', true)
                            // Do not forget to add the scorllY option!!!
                            .withOption('scrollY', 100);
            $scope.dtColumns = [
                DTColumnDefBuilder.newColumnDef('attrid').withTitle($scope.attrid),
                DTColumnDefBuilder.newColumnDef('num').withTitle('#')
            ];

            $scope.highlightPieSlice = function(key, color) {
                console.log(key);
                console.log(color);
            };
        },
        link: function postLink(scope, element, attrs) {
            console.log(scope);
        }
      };
    });
