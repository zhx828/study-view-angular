'use strict';

/**
 * @ngdoc directive
 * @name studyMultiViewsApp.directive:dcPie
 * @description
 * # dcPie
 */
angular.module('studyMultiViewsApp')
  .directive('dcPie', function (dc) {
    return {
      restrict: 'A',
      templateUrl: 'views/widgets/dcPie.html',
      scope: {
        cf: '=',
        attrid: '@',
        groupName: '@group'
      },
      controller: function ($scope) {
        if($scope.groupName === 'sample') {
            $scope.cf = $scope.cf.sample;
        }else {
            $scope.cf = $scope.cf.patient;
        }
        $scope.width =  130;
        $scope.height = $scope.width;
        $scope.radius = ($scope.width - 10) /2;
        $scope.dimension = $scope.cf.dimension(function(d){return d[$scope.attrid];});
        $scope.group = $scope.dimension.group();
        $scope.label = function(d) { return d.value};
        $scope.ordering = function(d) { return d.key};
      }
    };
  });
