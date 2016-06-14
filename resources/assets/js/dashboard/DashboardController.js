;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$http', '$timeout'];
	function DashboardController($scope, $http, $timeout) {

		//@TODO: maybe change to http call
		$timeout(function(){
			$scope.dashboardWidgets = true;
		},50);

		//$http.get('api/settings')
		//	.success(function(settings) {$scope.settings = true;})
		//	.error(function() {$scope.user = false;});
	}

})();