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
;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$http'];
	function DashboardController($scope, $http) {

	}

})();
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
