;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('UsersController', UsersController);

	UsersController.$inject = ['$scope', '$http', '$routeParams'];
	function UsersController($scope, $http, $routeParams) {

		$scope.dynamicTemplate = 'ngviews/users/_users.php';

		if ('user_id' in $routeParams) {
			$scope.dynamicTemplate = 'ngviews/users/_single_user.php';

			$http.get('api/users/' + $routeParams.user_id)
				.success(function(user) {
					$scope.user = user;
				})
				.error(function() {
					$scope.user = false;
				});

		} else {
			$http.get('api/users')
				.success(function(users) {
					$scope.users = users;
				})
				.error(function() {
					$scope.users = false;
				});

		}

	}

})();