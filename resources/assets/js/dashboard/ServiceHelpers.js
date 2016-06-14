;(function() {
	"use strict";


	angular.module('dashboardModule')
		.factory('ServiceHelpers', ServiceHelpers);

	ServiceHelpers.$inject = ['$resource', '$http', '$location'];
	function ServiceHelpers($resource, $http, $location) {
		return {
			avatarUrl    : function() {
				return $resource("api/data/:helper/:argues", {
					helper: '@helper',
					argues: '@argues'
				});
			},
			mconf : function(confirmid, itemClass, msg){
				return "\
			<div class='alert-backdrop' id='"+confirmid+"'>\
				<div class='alert alert-" + itemClass + "'>\
				<h2>" + msg + "</h2>\
				<div class='btn-group btn-group-justified' role='group'>\
					<div class='btn-group' role='group'>\
						<button data-confirm='confirm' type='button' class='btn btn-default'>I'm sure</button>\
					</div>\
					<div class='btn-group' role='group'>\
						<button data-confirm='cancel' type='button' class='btn btn-default'>I've changed my mind</button>\
					</div>\
				</div>\
				</div>\
			</div>"
			}

		};
	}

})();