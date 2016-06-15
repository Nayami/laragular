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
				templateUrl: 'ngviews/dashboard.html',
				controller : 'DashboardController'
			})
			.when('/users/:user_id?', {
				templateUrl: 'ngviews/users.html',
				controller : 'UsersController'
			})
			.when('/users/edit/:user_id?', {
				templateUrl: 'ngviews/users.html',
				controller : 'UsersController'
			})
			.when('/settings/:option_param?', {
				templateUrl: 'ngviews/settings.html',
				controller : 'SettingsController'
			})
			.otherwise({
				redirectTo : '/'
			})
	}

})();