;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('UsersController', UsersController);

	UsersController.$inject = ['$scope', '$http', '$routeParams', 'ServiceHelpers'];
	function UsersController($scope, $http, $routeParams, ServiceHelpers) {

		$scope.dynamicTemplate = 'ngviews/users/_users.html';

		$scope.userCanmanage = true;// Temporary

		$scope.roles = [
			{name:'admin', value:'Admin'},
			{name:'manager', value:'Manager'},
			{name:'customer', value:'Customer'},
			{name:'subscriber', value:'Subscriber'},
		];

		$scope.addNew = function(){

			$http.post('restusers', $scope.newuser)
				.success(function(data){

					var u = data.response.user;
					u.gravatarImage = data.response.avatar;
					u.role = data.response.role;
					$scope.users.push(u);

					$scope.newuser.name ="";
					$scope.newuser.email ="";
					$scope.newuser.password ="";
				});

		};


		if ('user_id' in $routeParams) {
			/**
			 * ==================== Single user ======================
			 */
			$scope.dynamicTemplate = 'ngviews/users/_single_user.html';

			$http.get('api/users/' + $routeParams.user_id)
				.success(function(user) {
					$scope.user = user;
					user.meta.forEach(function(mt){
						if(mt.meta_key === 'role') {
							user.role = mt.meta_value;
						}
					});

					// Set Avatar
					var argues = JSON.stringify({ email: user.email, size: 200});
					ServiceHelpers.avatarUrl()
						.get({ helper: 'user_avatar', argues: argues },
							function(data) {
								user.gravatarImage = data.avatar_uri;
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

						// Set avatar
						var argues = JSON.stringify({ email: index.email, size: 40});
						ServiceHelpers.avatarUrl()
							.get({ helper: 'user_avatar', argues: argues },
								function(data) {
									index.gravatarImage = data.avatar_uri;
								});

					})
				})
				.error(function() {$scope.users = false;});
		}

	}

})();