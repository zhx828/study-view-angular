'use strict';

/**
 * @ngdoc service
 * @name StudyMultiViewsApp.DataProxy
 * @description
 * # DataProxy
 * Factory in the StudyMultiViewsApp.
 */
 angular.module('StudyMultiViewsApp')
 .factory('DataProxy', ['$rootScope', function ($rootScope) {
 	var mainData = {};

 	function main(data) {
 		console.log('Original data');
 		console.log(data);
 		console.log('------------------------------------------------');
 		if(angular.isArray(data)) {
 			data.forEach(function(e, i){
 				mainSwitch(e, i);
 			});
 		}else {
 			console.error(data, 'is not array');
 		}

 		if(angular.isArray(mainData.attr) && mainData.attr.length > 0) {
	 		seperateClinicalData(mainData.attr, mainData.arr);
 		}

 		return mainData;
 	}

 	function mainSwitch(data, index) {
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
 			trimClinicalData(_data);
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

 	function seperateClinicalData(attr, arr) {
 		mainData.sampleAttr = [];
 		mainData.sampleArr = [];
 		mainData.patientAttr = [];
 		mainData.patientArr = [];


 	}

 	function trimSamplePatientList(data) {
 		mainData.sampleIds = [];
 		mainData.patientIds = [];
        mainData.patientSampleM = data; //one to many
        mainData.samplePatientM = {}; //one to one

        for(var key in data) {
        	mainData.patientIds.push(key);
        	for(var i = 0; i< data[key].length; i++){
        		if(mainData.sampleIds.indexOf(data[key][i]) === -1) {
        			mainData.sampleIds.push(data[key][i]);
        			mainData.samplePatientM[data[key][i]] = key;
        		}
        	}
        }
        mainData.sampleIdsL = mainData.sampleIds.length;
        mainData.patientIdsL = mainData.patientIds.length;
        mainData.sampleIdStr = mainData.sampleIds.join(' ');
        mainData.patientIdStr = mainData.patientIds.join(' ');
        console.info(mainData.sampleIdsL, ': number of sampels');
        console.info(mainData.patientIdsL, ': number of patients');
        data = null;
    }

  	//Sample data
  	function trimClinicalData(d) {
    	//Reorganize data into wanted format datum[ caseID ][ Attribute Name ] = Attribute Value
        //The original data structure is { attr_id: , attr_val, sample}

        var sDataM = {}, //Map sample attrbute value with attribute name for each datum
        pDataM = {}, //Map patient attrbute value with attribute name for each datum
        sIndexM = {},
        pIndexM = {},
        arr = d.data,
        attr = d.attributes.map(function(e){
        	e.display_name = e.display_name.toString().split(/\s|_/).join(' ');
        	return e;
        }),
        arrL = arr.length;

		extendAttr(attr, 'CASE_ID', {
        	attr_id: 'SAMPLE_ID',
        	display_name: 'SAMPLE ID',
        	description: 'Sample Identifier',
        	datatype: 'STRING',
        	patient_attr: false
        });

        extendAttr(attr, 'PATIENT_ID', {
        	attr_id: 'PATIENT_ID',
        	display_name: 'PATIENT ID',
        	description: 'Patient Identifier',
        	datatype: 'STRING',
        	patient_attr: true
        });

        var seperatedAttr = seperateAttr(attr),
        pAttr = seperatedAttr.patient,
        sAttr = seperatedAttr.sample,
        sAttrC = attrClass(sAttr),
        pAttrC = attrClass(pAttr);
        
 		console.log('------------------------------------------------');
        console.info('sample attr class', sAttrC);
 		console.log('------------------------------------------------');
        console.info('patient attr class', pAttrC);
 		console.log('------------------------------------------------');

        for(var i = 0; i < arrL; i++){
        	var a = arr[i].sample || undefined,
        	b = arr[i].attr_id || undefined,
        	c = arr[i].attr_val || undefined;

    		//Whether attribute belongs to sample or patient
    		if(pAttrC.hasOwnProperty(b)) {
    			var _pId = mainData.samplePatientM[a];
    			if(!pDataM.hasOwnProperty(_pId)) {
    				pDataM[_pId] = angular.copy(pAttrC);
        			pDataM[_pId].PATIENT_ID = _pId;
    			}
    			pDataM[_pId][b.toString().toUpperCase()] = c;
    		}else {
    			if(!sDataM.hasOwnProperty(a)) {
    				sDataM[a] = angular.copy(sAttrC);
        			sDataM[a].SAMPLE_ID = a;
    			}
    			sDataM[a][b.toString().toUpperCase()] = c;
    		}
        }
        console.log(sDataM);
 		console.log('------------------------------------------------');
 		console.log(pDataM);
 		console.log('------------------------------------------------');

        //Initial samples without any attribute data from servlet
        mainData.sampleArr = [];
        for(i = 0; i < mainData.sampleIdsL; i++){
        	var _sampleId = mainData.sampleIds[i];
        	if(sDataM.hasOwnProperty(_sampleId)) {
        		mainData.sampleArr.push(sDataM[_sampleId]);
        	}else {
        		var datum = angular.copy(sAttrC);
        		datum.SAMPLE_ID =  _sampleId;
        		mainData.sampleArr.push(datum);
        	}
        	sIndexM[_sampleId] = i;
        }
        mainData.sampleIndexM = sIndexM;

        //Initial patient without any attribute data from servlet
        mainData.patientArr = [];
        for(i = 0; i < mainData.patientIdsL; i++){
        	var _patientId = mainData.patientIds[i];
        	if(pDataM.hasOwnProperty(_patientId)) {
        		mainData.patientArr.push(pDataM[_patientId]);
        	}else {
        		var datum = angular.copy(pAttrC);
        		datum.PATIENT_ID =  _patientId;
        		mainData.patientArr.push(datum);
        	}
        	pIndexM[_patientId] = i;
        }

        mainData.patientIndexM = pIndexM;
		mainData.patientAttr = pAttr;
		mainData.sampleAttr = sAttr;
        d = null;
        console.info(mainData.patientAttr.length, ': number of patient attributs');
        console.info(mainData.patientArr.length, ': number of patient data');
        console.log('------------------------------------------------');
        console.info(mainData.sampleAttr.length, ': number of sample attributs');
        console.info(mainData.sampleArr.length, ': number of sample data');
        console.log('------------------------------------------------');
    }

    function trimCaseList(data){
    	mainData.sequecedSampleIds = [];

    	if(angular.isString(data)) {
    		var lists = data.split('\n');
    		for(var i = 0; i < lists.length; i++) {
    			if(lists[i].indexOf('sequenced samples') !== -1) {
    				var _info = lists[i].split('\t');
    				if(_info.length === 5) {
    					mainData.sequecedSampleIds = _info[4].split(' ');
    				}
    				break;
    			}
    		}
    	}
    	data = null;
    }

    function trimMutationCount(data){
    	if(Object.keys(data).length > 0) {
    		console.info('Has mutation count.');
    		console.log('------------------------------------------------');
    		mainData.sampleAttr = extendAttr(mainData.sampleAttr, 'MUTATION_COUNT', {
    			attr_id: 'MUTATION_COUNT',
    			display_name: 'Mutation Count',
    			description: 'Mutation Count',
    			datatype: 'NUMBER',
    		});
    		mainData.sampleIds.forEach(function(e){
    			var _data;
    			if(data.hasOwnProperty(e)) {
    				_data=  data[e];
    			}else if(mainData.sequecedSampleIds.indexOf(e) !== -1){
    				console.log(e, 'has been sequenced but does not have data. Changed mutation count to 0.');
    				_data = 0;
    			}else {
    				_data = 'NA';
    			}
    			mainData.sampleArr[mainData.sampleIndexM[e]].MUTATION_COUNT = _data;
    		});
    	}
    	data = null;
    }

    function trimCNAFraction(data){
    	if(Object.keys(data).length > 0) {
    		console.info('Has cna fraction.');
    		console.log('------------------------------------------------');
    		mainData.sampleAttr = extendAttr(mainData.sampleAttr, 'COPY_NUMBER_ALTERATIONS', {
    			attr_id: 'COPY_NUMBER_ALTERATIONS',
    			display_name: 'Copy Number Alterations',
    			description: 'Copy Number Alterations',
    			datatype: 'NUMBER',
    		});
    		mainData.sampleIds.forEach(function(e){
    			var _data;
    			if(data.hasOwnProperty(e)) {
    				_data=  data[e];
    			}else {
    				_data = 'NA';
    			}
    			mainData.sampleArr[mainData.sampleIndexM[e]].COPY_NUMBER_ALTERATIONS = _data;
    		});
    	}
    	data = null;
    }

    function trimSMG(data){
    	if(angular.isObject(data)) {
    		mainData.mutatedGenes = data;
    	}
    	data = null;
    }

    function trimCNA(data){
    	if(angular.isObject(data)) {
    		mainData.cna = data;
    	}
    	data = null;
    }

    function trimGistic(data){
    	if(angular.isObject(data)) {
    		mainData.gistic = data;
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

    function seperateAttr(attr) {
    	var seperatedAttr = {
    		sample: [],
    		patient: []
    	};

    	if(angular.isArray(attr)) {
    		attr.forEach(function(e){
    			if(e.hasOwnProperty('patient_attr')){
    				var b = e.patient_attr;
    				if(angular.isString(b)) {
    					b = !!b;
    				}

    				if(b) {
    					seperatedAttr.patient.push(e);
    				}else {
    					seperatedAttr.sample.push(e);
    				}
    			}else {
    				console.info(e.attr_id, 'does not have patient_attr attribute.')
    				console.log(e);
    			}
    		});
      	}else {
	      	console.error(attr, 'is not array.');
      	}

      	return seperatedAttr;
    }

    function attrClass(attr) {
    	var datum = {};

    	if(angular.isArray(attr)) {
    		var _attr = [];
    		_attr = attr.map(function(e){return e.attr_id;})
          	//Mutation and CNA fraction should only come from two servlet individually.
          	//Remove attributes if they exist in attrs array
          	_attr = $rootScope.without(_attr, 'MUTATION_COUNT', 'COPY_NUMBER_ALTERATIONS');
          	datum =  $rootScope.object(_attr, $rootScope.range(_attr.length).map(function () { return 'NA'; }));
      	}else {
	      	console.error(attr, 'is not array.');
      	}

      	return datum;
  	}

  	return {
      	main: main
  	};
}]);
