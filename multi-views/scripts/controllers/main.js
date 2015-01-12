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
  	['$scope', 'DataProxy',
  	function ($scope, DataProxy) {
  		function init() {
  			getSummrayData();
  		}

  		function getSummrayData() {
  			DataProxy.getSummaryData().then(
		    //Callback for All promises have been resolved
	    	function(data){
		    	assign(data);
		    },
		    //Call back for Not all promiseds have been resolved
		    function(data){
		    	assign(data);
		    });
  		}

	    function assign(data) {
	    	console.log('Original data');
	    	console.log(data);
            console.log('------------------------------------------------');
	    	if(angular.isArray(data)) {
	    		data.forEach(function(e, i){
	    			assignSwitch(e, i);
	    		});
	    		console.log($scope);
	    	}else {
	    		console.error(data, 'is not array');
	    	}
	    }

	    function assignSwitch(data, index) {
	    	var _data;
	    	if(angular.isObject(data) && data.hasOwnProperty('status') && data.status === 404) {
	    		_data = [];
			}else {
				_data = data;
			}
	    	switch(index) {
	    		case 0:
	    			trimSamplePatientList(_data);
	    			break;
    			case 1:
    				trimCaseList(_data);
	    			break;
    			case 2:
	    			trimSummrayMainData(_data);
	    			break;
    			case 3:
    				trimMutationCount(_data);
	    			break;
    			case 4:
    				trimCNAFraction(_data);
	    			break;
    			case 5:
    				trimSMG(_data);
	    			break;
    			case 6:
    				trimCNA(_data);
	    			break;
				case 7:
					trimGistic(_data);
	    			break;
    			default:
    				break;
	    	}
	    }

	    function trimSamplePatientList(data) {
	    	$scope.sampleIds = [];
            $scope.patientIds = [];
            $scope.patientSampleM = data; //one to many
            $scope.samplePatientM = {}; //one to one

            for(var key in data) {
                $scope.patientIds.push(key);
                for(var i = 0; i< data[key].length; i++){
                    if($scope.sampleIds.indexOf(data[key][i]) === -1) {
                        $scope.sampleIds.push(data[key][i]);
                        $scope.samplePatientM[data[key][i]] = key;
                    }
                }
            }
            $scope.sampleIdsL = $scope.sampleIds.length;
            $scope.patientIdsL = $scope.patientIds.length;
            $scope.sampleIdStr = $scope.sampleIds.join(' ');
            $scope.patientIdStr = $scope.patientIds.join(' ');
            console.info($scope.sampleIdsL, ': number of sampels');
            console.info($scope.patientIdsL, ': number of patients');
            data = null;
	    }

	    //Sample data
	    function trimSummrayMainData(d) {
	    	//Reorganize data into wanted format datum[ caseID ][ Attribute Name ] = Attribute Value
            //The original data structure is { attr_id: , attr_val, sample}

            var sampleDataM = {}, //Map attrbute value with attribute name for each datum
                sampleIndexM = {},
                arr = d.data,
                attr = d.attributes.map(function(e){
                	e.display_name = e.display_name.toString().split(/\s|_/).join(' ');
                	return e;
                }),
                arrL = arr.length,
                attrC = {};

            extendAttr(attr, 'CASE_ID', {
            	attr_id: 'SAMPLE_ID',
                display_name: 'SAMPLE ID',
                description: 'Sample Identifier',
                datatype: 'STRING'
            });
            extendAttr(attr, 'PATIENT_ID', {
            	attr_id: 'PATIENT_ID',
                display_name: 'PATIENT ID',
                description: 'Patient Identifier',
                datatype: 'STRING'
            });

			attrClass(attr);
            $scope.arr = [];

            for(var i = 0; i < arrL; i++){
            	var a = arr[i].sample || undefined,
            		b = arr[i].attr_id || undefined,
            		c = arr[i].attr_val || undefined;

            	if(!sampleDataM.hasOwnProperty(a)) {
            		sampleDataM[a] = angular.copy(attrC);
            		sampleDataM[a].SAMPLE_ID =  a;
					sampleDataM[a].PATIENT_ID = $scope.samplePatientM[a];
            	}

            	if(sampleDataM[a].hasOwnProperty(b)) {
               		sampleDataM[a][b.toString().toUpperCase()] = c;
            	}
            }

            //Initial samples without any attribute data from servlet
            for(i = 0; i < $scope.sampleIdsL; i++){
            	var _sampleId = $scope.sampleIds[i];
            	if(sampleDataM.hasOwnProperty(_sampleId)) {
            		$scope.arr.push(sampleDataM[_sampleId]);
            	}else {
            		var datum = angular.copy(attrC);
            		datum.SAMPLE_ID =  _sampleId;
					datum.PATIENT_ID = $scope.samplePatientM[_sampleId];
					$scope.arr.push(datum);
            	}
            	sampleIndexM[_sampleId] = i;
            }
            $scope.sampleIndexM = sampleIndexM;
            $scope.attr = attr;
            d = null;
            console.info($scope.attr.length, ': number of attributs');
            console.info($scope.arr.length, ': number of data');
            console.log('------------------------------------------------');
	    }

	    function trimCaseList(data){

	    }

	    function trimMutationCount(data){
	    	if(Object.keys(data).length > 0) {
	    		console.info('Has mutation count.');
            	console.log('------------------------------------------------');
	    		$scope.attr = extendAttr($scope.attr, 'MUTATION_COUNT', {
		    		attr_id: 'MUTATION_COUNT',
					display_name: 'Mutation Count',
					description: 'Mutation Count',
					datatype: 'NUMBER',
				});
				$scope.sampleIds.forEach(function(e){
					var _data;
					if(data.hasOwnProperty(e)) {
						_data=  data[e];
					}else {
						_data = 'NA';
					}
					$scope.arr[$scope.sampleIndexM[e]].MUTATION_COUNT = _data;
				});
			}
			data = null;
	    }

	    function trimCNAFraction(data){
	    	if(Object.keys(data).length > 0) {
	    		console.info('Has cna fraction.');
            	console.log('------------------------------------------------');
	    		$scope.attr = extendAttr($scope.attr, 'COPY_NUMBER_ALTERATIONS', {
		    		attr_id: 'COPY_NUMBER_ALTERATIONS',
					display_name: 'Copy Number Alterations',
					description: 'Copy Number Alterations',
					datatype: 'NUMBER',
				});
				$scope.sampleIds.forEach(function(e){
					var _data;
					if(data.hasOwnProperty(e)) {
						_data=  data[e];
					}else {
						_data = 'NA';
					}
					$scope.arr[$scope.sampleIndexM[e]].COPY_NUMBER_ALTERATIONS = _data;
				});
	    	}
	    	data = null;
	    }

	    function trimSMG(data){
	    	if(angular.isObject(data)) {
	    		$scope.mutatedGenes = data;
	    	}
    		data = null;
	    }

	    function trimCNA(data){
	    	if(angular.isObject(data)) {
	    		$scope.cna = data;
	    	}
    		data = null;
	    }

	    function trimGistic(data){
	    	if(angular.isObject(data)) {
	    		$scope.gistic = data;
	    	}
    		data = null;
	    }

	    function extendAttr(attr, key, datum) {
	    	var attrIds = attr.map(function(e){return e.attr_id;});

			if(attrIds.indexOf(key) === -1) {
				attr.push(datum);
			}else {
				console.info(key, 'already exists.');
			}

	    	return attr;
	    }

	    function attrClass(attr) {
	    	if(angular.isArray(attr)) {
	    		var attrs = attr.map(function(e){
	    			return e.attr_id;
	    		});

	    		//Mutation and CNA fraction should only come from two servlet individually.
	    		//Remove attributes if they exist in attrs array
	    		attrs = $scope.without(attrs, 'MUTATION_COUNT', 'COPY_NUMBER_ALTERATIONS');
	    		
	    		var value = $scope.range(attrs.length).map(function () { return 'NA'; });
	    		return $scope.object(attrs, value);
	    	}else {
	    		console.error(attr, 'is not array.');
	    		return {};
	    	}
	    }
	    //Webservice may retrun extra cases including there data
	    //This function is designed to elimate data based on case id
	    //which not inlcuded in globle caseIds Array
	    function removeExtraData(_caseIds,_data){
	        var _newData = {},
	            _hasValue = false;
	        for(var i=0; i< _caseIds.length ; i++){
	            _newData[_caseIds[i]] = _data[_caseIds[i]];
	            if(_data[_caseIds[i]] !== undefined){
	                _hasValue = true;
	            }
	        }
	        if(_hasValue) {
	            return _newData;
	        }else {
	            return [];
	        }
	    }

	    init();
	}
  ]);
