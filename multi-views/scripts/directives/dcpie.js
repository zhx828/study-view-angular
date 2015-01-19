'use strict';

/**
 * @ngdoc directive
 * @name studyMultiViewsApp.directive:dcPie
 * @description
 * # dcPie
 */
angular.module('studyMultiViewsApp')
  .directive('dcPie', function ($compile) {
    return {
      restrict: 'E',
      template: 
		'<div class="study-view-dc-chart study-view-pie-main">'+
        '<div style="height: 16px; width:100%; float:left; text-align:center;">'+
        '<div style="height:16px;float:right;">'+
        '<img  class="study-view-title-icon hidden hover" src="images/reload-alt.svg"/>' +
        '<img class="study-view-title-icon hover" src="images/pie.svg"/>'+
        '<img class="study-view-title-icon study-view-table-icon hover" src="images/table.svg"/>'+
        '<div class="study-view-download-icon"><img style="float:left"'+
        'src="images/in.svg"/></div>'+
        '<img class="study-view-drag-icon" src="images/move.svg"/>'+
        '<span class="study-view-dc-chart-delete">x</span>'+
        '</div><chartTitleH4>{{attr.display_name}}</chartTitleH4></div>'+
      	'<div style="width:180px;float:left;text-align:center" id="study-view-pie-chart-{{attr.attr_id}}"></div></div>',
      link: function postLink(scope, element, attrs) {
        var chartColors = scope.chartColors;
      	if(attrs.group === 'sample') {
      		scope.cf = scope.cfSample;
      	}else {
      		scope.cf = scope.cfPatient;
      	}
      	scope.$watch('cf', function(value) {
        	if(angular.isObject(value)) {
        		var _pieWidth = 130;
	            var _pieRadius = (_pieWidth - 20) /2;
        		var pieChart = dc.pieChart('#study-view-pie-chart-'+scope.attr.attr_id, attrs.group);
		        var attr_id = scope.attr.attr_id;
		        var cluster = value.dimension(function (d) {
		            if(!d[attr_id] || d[attr_id].toLowerCase() === 'unknown' || d[attr_id].toLowerCase() === 'none') {return 'NA';}
	           		return d[attr_id];
		        });
		       	pieChart
		            .width(_pieWidth)
		            .height(_pieWidth)
		            .radius(_pieRadius)
		            .dimension(cluster)
		            .group(cluster.group())
		            .colors(chartColors)
		            // .ordinalColors(attrs.colors) Bower version does not support ordinalcolors yet. It's added in version 2.0
        			.label(function (d) {
		                return d.value;
		            })
		            .ordering(function(d){ return d.key;});
	        	pieChart.render();
        	}
        });
      }
    };
  });
