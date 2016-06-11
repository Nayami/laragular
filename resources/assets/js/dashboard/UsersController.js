;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('UsersController', UsersController);

	UsersController.$inject = ['$scope', '$http', '$routeParams', 'ServiceHelpers'];
	function UsersController($scope, $http, $routeParams, ServiceHelpers) {

		$scope.dynamicTemplate = 'ngviews/users/_users.html';


		if ('user_id' in $routeParams) {
			/**
			 * ==================== Single user ======================
			 */
			$scope.dynamicTemplate = 'ngviews/users/_single_user.html';

			$http.get('api/users/' + $routeParams.user_id)
				.success(function(user) {
					$scope.user = user;
					ServiceHelpers.getGravatar(user.email).then(function(data) {
						user.gravatarImage = data;
					});
				})
				.error(function() {$scope.user = false;});
		} else {
			/**
			 * ==================== All users ======================
			 */
			$http.get('api/users')
				.success(function(users) {
					$scope.users = users;

					angular.forEach($scope.users, function(index){
						index.meta.forEach(function(mt) {
							if(mt.meta_key === 'role') {
								index.role = mt.meta_value;
							}
						});
						ServiceHelpers.getGravatar(index.email).then(function(data){
							index.gravatarImage = data;
						});

					})
				})
				.error(function() {$scope.users = false;});
		}

	}

})();