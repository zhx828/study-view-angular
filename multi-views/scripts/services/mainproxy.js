'use strict';

/**
 * @ngdoc service
 * @name studyMultiViewsApp.MainProxy
 * @description
 * # MainProxy
 * Factory in the studyMultiViewsApp.
 */
angular.module('studyMultiViewsApp')
  .factory('MainProxy', ['$rootScope', function ($rootScope) {
    var mainData = {};//mainData.sample and mainData.patient

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

    function trimSamplePatientList(data) {
        mainData.sample = {};
        mainData.patient = {};
        mainData.sample.ids = [];
        mainData.patient.ids = [];
        mainData.patientSampleM = data; //one to many
        mainData.samplePatientM = {}; //one to one

        for(var key in data) {
          mainData.patient.ids.push(key);
          for(var i = 0; i< data[key].length; i++){
            if(mainData.sample.ids.indexOf(data[key][i]) === -1) {
              mainData.sample.ids.push(data[key][i]);
              mainData.samplePatientM[data[key][i]] = key;
            }
          }
        }
        mainData.sample.idsL = mainData.sample.ids.length;
        mainData.patient.idsL = mainData.patient.ids.length;
        mainData.sample.idStr = mainData.sample.ids.join(' ');
        mainData.patient.idStr = mainData.patient.ids.join(' ');
        console.info(mainData.sample.idsL, ': number of sampels');
        console.info(mainData.patient.idsL, ': number of patients');
    }

    function trimClinicalData(d) {
        //Reorganize data into wanted format datum[ caseID ][ Attribute Name ] = Attribute Value
        //The original data structure is { attr_id: , attr_val, sample}

        var sDataM = {},    //Map sample attrbute value with attribute name for each datum
        pDataM = {},    //Map patient attrbute value with attribute name for each datum
        sIndexM = {},   //attr_id: index(in the sample.attr)
        pIndexM = {},   //same as above
        arr = d.data,
        attr = d.attributes.map(function(e){
          e.display_name = e.display_name.toString().split(/\s|_/).join(' ');
          return e;
        }),
        arrL = arr.length,
        attrKeys = {};

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
        allAttr = seperatedAttr.all,
        sAttrC = attrClass(sAttr),
        pAttrC = attrClass(pAttr);

        for(var i = 0; i < arrL; i++){
            var a = arr[i].sample || undefined,
            b = arr[i].attr_id.toString().toUpperCase() || undefined,
            c = arr[i].attr_val || undefined;

            //Whether attribute belongs to sample or patient
            if(pAttrC.hasOwnProperty(b)) {
                var _pId = mainData.samplePatientM[a];
                if(!pDataM.hasOwnProperty(_pId)) {
                    pDataM[_pId] = angular.copy(pAttrC);
                    pDataM[_pId].PATIENT_ID = _pId;
                }
                pDataM[_pId][b] = c;
            }else {
                if(!sDataM.hasOwnProperty(a)) {
                    sDataM[a] = angular.copy(sAttrC);
                    sDataM[a].SAMPLE_ID = a;
                }
                sDataM[a][b] = c;
            }
            if(!allAttr[b].hasOwnProperty('keys')) {
                allAttr[b].keys = [];
            }

            if(allAttr[b].keys.indexOf(c) === -1) {
                allAttr[b].keys.push(c);
            }
        }

        //Add dc chart type and keys type for each attribute
        for(var key in allAttr) {
            var keys = allAttr[key].keys || [];

            if(allNumber(keys)) {
                allAttr[key].keyType = 'allnumeric';
            }else {
                allAttr[key].keyType = 'string';
            }

            if(['NUMBER', 'BOOLEAN'].indexOf(allAttr[key].dataType) !== -1 || allAttr[key].keyType === 'allnumeric') {
                if(keys.length>10 || ['AGE', 'MUTATION_COUNT', 'COPY_NUMBER_ALTERATIONS'].indexOf(key) !== -1) {
                    allAttr[key].dcType = 'bar';
                }else {
                    allAttr[key].dcType = 'pie';
                }
            }else {
                allAttr[key].dcType = 'pie';
            }

            if(allAttr[key].keyType === 'allnumeric') {
                var _max = Math.max.apply( Math, keys),
                _min = Math.min.apply( Math, keys );
                allAttr[key].keyRange = {
                    diff : _max - _min,
                    min : _min,
                    max : _max
                };
            }else{
                allAttr[key].keyRange = undefined;
            }
        }

        //Initial samples without any attribute data from servlet
        mainData.sample.arr = [];
        for(i = 0; i < mainData.sample.idsL; i++){
            var _sampleId = mainData.sample.ids[i];
            if(sDataM.hasOwnProperty(_sampleId)) {
                mainData.sample.arr.push(sDataM[_sampleId]);
            }else {
                var sDatum = angular.copy(sAttrC);
                sDatum.SAMPLE_ID =  _sampleId;
                mainData.sample.arr.push(sDatum);
            }
            sIndexM[_sampleId] = i;
        }
        mainData.sample.indexM = sIndexM;

        //Initial patient without any attribute data from servlet
        mainData.patient.arr = [];
        for(i = 0; i < mainData.patient.idsL; i++){
            var _patientId = mainData.patient.ids[i];
            if(pDataM.hasOwnProperty(_patientId)) {
                mainData.patient.arr.push(pDataM[_patientId]);
            }else {
                var pDatum = angular.copy(pAttrC);
                pDatum.PATIENT_ID =  _patientId;
                mainData.patient.arr.push(pDatum);
            }
            pIndexM[_patientId] = i;
        }

        mainData.patient.indexM = pIndexM;
        mainData.patient.attr = pAttr;
        mainData.sample.attr = sAttr;
        mainData.attr = allAttr;
        console.log('------------------------------------------------');
        console.info(mainData.patient.attr.length, ': number of patient attributs');
        console.info(mainData.patient.arr.length, ': number of patient data');
        console.log('------------------------------------------------');
        console.info(mainData.sample.attr.length, ': number of sample attributs');
        console.info(mainData.sample.arr.length, ': number of sample data');
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
    }

    function trimMutationCount(data){
        if(Object.keys(data).length > 0) {
            console.info('Has mutation count.');
            console.log('------------------------------------------------');
            mainData.sample.attr = extendAttr(mainData.sample.attr, 'MUTATION_COUNT', {
                attr_id: 'MUTATION_COUNT',
                display_name: 'Mutation Count',
                description: 'Mutation Count',
                datatype: 'NUMBER',
            });
            mainData.sample.ids.forEach(function(e){
                var _data;
                if(data.hasOwnProperty(e)) {
                _data=  data[e];
                }else if(mainData.sequecedSampleIds.indexOf(e) !== -1){
                    console.log(e, 'has been sequenced but does not have data. Changed mutation count to 0.');
                    _data = 0;
                }else {
                    _data = 'NA';
                }
                mainData.sample.arr[mainData.sample.indexM[e]].MUTATION_COUNT = _data;
            });
        }
    }

    function trimCNAFraction(data){
        if(Object.keys(data).length > 0) {
            console.info('Has cna fraction.');
            console.log('------------------------------------------------');
            mainData.sample.attr = extendAttr(mainData.sample.attr, 'COPY_NUMBER_ALTERATIONS', {
                attr_id: 'COPY_NUMBER_ALTERATIONS',
                display_name: 'Copy Number Alterations',
                description: 'Copy Number Alterations',
                datatype: 'NUMBER',
            });
            mainData.sample.ids.forEach(function(e){
                var _data;
                if(data.hasOwnProperty(e)) {
                    _data=  data[e];
                }else {
                    _data = 'NA';
                }
                mainData.sample.arr[mainData.sample.indexM[e]].COPY_NUMBER_ALTERATIONS = _data;
            });
        }
    }

    function trimSMG(data){
        if(angular.isObject(data)) {
            mainData.mutatedGenes = data;
        }
    }

    function trimCNA(data){
        if(angular.isObject(data)) {
            mainData.cna = data;
        }
    }

    function trimGistic(data){
        if(angular.isObject(data)) {
            mainData.gistic = data;
        }
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
        //Sample and patient attributes will be seperated into three groups.
        //'sample'/'patient' groups will be stored as array. 
        //'all' will be stored as object, attr_id will be the key
        var seperatedAttr = {
            sample: [],
            patient: [],
            all: {}
        };

        if(angular.isArray(attr)) {
            attr.forEach(function(e){
                if(e.hasOwnProperty('patient_attr')){
                    var b = e.patient_attr;
                    if(angular.isString(b)) {
                        b = !!b;
                    }

                    if(!seperatedAttr.all.hasOwnProperty(e.attr_id)) {
                        seperatedAttr.all[e.attr_id] = angular.copy(e);
                    }

                    if(b) {
                        seperatedAttr.patient.push(e);
                        seperatedAttr.all[e.attr_id].group = 'patient'; //For using in dc groups
                    }else {
                        seperatedAttr.sample.push(e);
                        seperatedAttr.all[e.attr_id].group = 'sample'; //For using in dc groups
                    }
                    delete seperatedAttr.all[e.attr_id].patient_attr; //For using in dc groups

                }else {
                    console.info(e.attr_id, 'does not have patient_attr attribute.');
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
            _attr = attr.map(function(e){return e.attr_id;});
            //Mutation and CNA fraction should only come from two servlet individually.
            //Remove attributes if they exist in attrs array
            _attr = $rootScope.without(_attr, 'MUTATION_COUNT', 'COPY_NUMBER_ALTERATIONS');
            datum =  $rootScope.object(_attr, $rootScope.range(_attr.length).map(function () { return 'NA'; }));
        }else {
          console.error(attr, 'is not array.');
        }

        return datum;
    }

    function allNumber(array) {
        var flag = true;//all number flag;
        if(angular.isArray(array)) {
            for(var i = 0, aL = array.length ; i < aL; i++) {
                if(array[i] !== 'NA' && isNaN(array[i])){
                    flag = false;
                    break;
                }
            }
        }else {
            flag = false;
        }
        return flag;
    }
    return {
        main: main
    };
}]);
