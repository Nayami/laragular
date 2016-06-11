;(function() {
	"use strict";

	angular.module('dashboardModule')
		.factory('ServiceHelpers', ServiceHelpers);

	ServiceHelpers.$inject = ['$resource', '$http', '$location'];
	function ServiceHelpers($resource, $http, $location) {
		return {
			avatarUrl : function() {
				return $resource("api/data/:helper/:argues",{ helper: '@helper', argues: '@argues' });
			}

		};
	}

})();