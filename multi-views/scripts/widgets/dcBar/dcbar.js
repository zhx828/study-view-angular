'use strict';

/**
 * @ngdoc directive
 * @name studyMultiViewsApp.directive:dcBar
 * @description
 * # dcBar
 */
angular.module('studyMultiViewsApp')
  .directive('dcBar', function () {
    return {
      template:
      	'<div style="height: 18px; width: 100%"><div style="float:right"' +
		'id="+DIV.chartDiv+-header">'+
		'<img id="+ DIV.chartDiv +-reload-icon" class="study-view-title-icon hidden hover" src="images/reload-alt.svg"/>' +
		'<div id="+ DIV.chartDiv+-download-icon-wrapper" class="study-view-download-icon"><img id="' + 
		'DIV.chartDiv+-download-icon" style="float:left" src="images/in.svg"/></div>' +
		'<img class="study-view-drag-icon" src="images/move.svg"/>' +
		'<span chartID=+param.chartID+ class="study-view-dc-chart-delete">x</span>' +
		'</div></div><div class="+ param.className +">' +
		'<div id="+DIV.chartDiv+-side" class="study-view-pdf-svg-side bar">' +
		'</div></div>' +
		'<div style="width:100%; float:center;text-align:center;">' +
		'<chartTitleH4>{{attr.attr_id}}</chartTitleH4></div><div id="study-view-bar-chart-{{attr.attr_id}}></div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
       //  var chartColors = scope.chartColors;
      	// if(attrs.group === 'sample') {
      	// 	scope.cf = scope.cfSample;
      	// }else {
      	// 	scope.cf = scope.cfPatient;
      	// }
      	// scope.$watch('cf', function(value) {
       //  	if(angular.isObject(value)) {
       //  		var chartWidth = 370;
	      //       var chartHeight = 125;
       //  		var barChart = dc.barChart('#study-view-bar-chart-'+scope.attr.attr_id, attrs.group);
		     //    var attr_id = scope.attr.attr_id;
		     //    var cluster = value.dimension(function (d) {
		     //        if(!d[attr_id] || d[attr_id].toLowerCase() === 'unknown' || d[attr_id].toLowerCase() === 'none') {return 'NA';}
	      //      		return d[attr_id];
		     //    });
		     //   	barChart
		     //        .width(chartWidth)
		     //        .height(chartHeight)
		     //        .margins({top: 10, right: 20, bottom: 30, left: 40})
		     //        .dimension(cluster)
		     //        .group(cluster.group())
		     //        .centerBar(true)
		     //        .elasticY(true)
		     //        .elasticX(false)
		     //        .turnOnControls(true)
		     //        .mouseZoomable(false)
		     //        .brushOn(true)
		     //        .renderHorizontalGridLines(false)
		     //        .renderVerticalGridLines(false);

	      //       barChart.x( d3.scale.linear()
       //                  .domain([ 
       //                            xDomain[0] - seperateDistance ,
       //                            xDomain[xDomain.length - 1] + seperateDistance
       //                          ]));
        
		     //    barChart.yAxis().ticks(6);
		     //    barChart.yAxis().tickFormat(d3.format("d"));            
		     //    barChart.xAxis().tickFormat(function(v) {
		     //        if(v === emptyValueMapping){
		     //            return 'NA'; 
		     //        }else{
		     //            return v;
		     //        }
		     //    });
	      //   	barChart.render();
       //  	}
       //  });
      }
    };
  });
