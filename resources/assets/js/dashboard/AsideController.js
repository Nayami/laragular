;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('AsideController', AsideController);

	AsideController.$inject = ['$scope', '$location'];
	function AsideController($scope, $location) {

		$scope.isActive = function(path) {
			return $location.path() === path;
		};

		$scope.isActiveDropdown = function(path) {
			return new RegExp('^' + path, 'i').test($location.path());
		};

	}

})();