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