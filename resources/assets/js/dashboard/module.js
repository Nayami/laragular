/**
 * Dashboard Content module
 */

;(function() {
	"use strict";

	angular.module('dashboardModule',[
		'ngRoute',
		'ngResource',
		'ngAnimate'
	])
		.config(dashboardConfig);

	dashboardConfig.$inject = ['$routeProvider'];
	function dashboardConfig($routeProvider){

		$routeProvider
			.when('/', {
				templateUrl: 'ngviews/dashboard.php',
				controller : 'DashboardController'
			})
			.when('/users/:user_id?', {
				templateUrl: 'ngviews/users.php',
				controller : 'UsersController'
			})
			.otherwise({
				redirectTo : '/'
			})
	}


})();