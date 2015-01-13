'use strict';

/**
 * @ngdoc service
 * @name StudyMultiViewsApp.DataPool
 * @description
 * # DataPool
 * Factory in the StudyMultiViewsApp.
 */
angular.module('StudyMultiViewsApp')
  .factory('DataPool', function ($http, $q) {
    var fromFile = true;

    function getData() {
      //Q promises. allSettled function implemented in app.js
      return $q.allSettled([
        getSamplePatientMapping(),
        getCaseLists(),
        getSummaryMain(),
        getMutationCounts(),
        getCNAFraction(),
        getSMG(),
        getCNA(),
        getGistic()
      ]);
    }

    function getSummaryMain() {
      if(fromFile) {
        return $http.get('data/webservice_main.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getSamplePatientMapping() {
      if(fromFile) {
        return $http.get('data/webservice_sp.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getSMG() {
      if(fromFile) {
        return $http.get('data/get_smg.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getCNA() {
      if(fromFile) {
        return $http.get('data/cna.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getMutationCounts() {
      if(fromFile) {
        return $http.get('data/count_mutations.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getCNAFraction() {
      if(fromFile) {
        return $http.get('data/get_cna_fraction.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getGistic() {
      if(fromFile) {
        return $http.get('data/gistic.json').then(function(res){
          return res.data;
        });
      }else {
      }
    }

    function getCaseLists() {
      if(fromFile) {
        return $http.get('data/caseLists.txt').then(function(res){
          return res.data;
        });
      }else {
      }
    }
    // Public API here
    return {
      getData: getData
    };
  });
