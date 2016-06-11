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
			.otherwise({
				redirectTo : '/'
			})
	}


})();
;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$http'];
	function DashboardController($scope, $http) {
		$scope.settings = false;

		//$http.get('api/settings')
		//	.success(function(settings) {$scope.settings = true;})
		//	.error(function() {$scope.user = false;});
	}

})();
;(function() {
	"use strict";

	angular.module('dashboardModule')
		.factory('ServiceHelpers', ServiceHelpers);

	ServiceHelpers.$inject = ['$resource', '$http'];
	function ServiceHelpers($resource, $http) {
		return {
			getGravatar: function(email) {
				return $http({
					method: 'GET',
					url   : 'api/helpers/get_gravatar/' + email
				}).then(function(response) {
					return response.data;
				}, function(error) {
					return error;
				});
			},

		};
	}

})();
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

//# sourceMappingURL=dashboard-script.js.map
