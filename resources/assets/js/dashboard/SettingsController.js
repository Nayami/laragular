;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$http'];
	function SettingsController($scope, $http) {

		$http.get('settings')
			.success(function(settings){
				$scope.allsettings = settings;
			});


	}

})();