;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$http', 'appConst'];
	function SettingsController($scope, $http, appConst) {

		$http.get('settings')
			.success(function(settings){
				$scope.allsettings = settings;
			});

		$scope.activeTab = 'acl-tab';
		$scope.switchTab = function(tab) {
			return $scope.activeTab = tab;
		};

		// ?i=1000
		// ?i=1001
		$scope.templates = {
			//aclAssign : 'ngviews/settings/acl-assign.html',
			//aclCreate : 'ngviews/settings/acl-manage.html',
			aclAssign : 'ngviews/settings/acl-assign.html?i=1000',
			aclCreate : 'ngviews/settings/acl-manage.html?i=1000',
		};
		$scope.aclTpl = $scope.templates.aclAssign;

		/**
		 * ==================== Store ACL relations ======================
		 */
		$scope.storeAclSettings = function(){
			var data = $scope.aclSettings;
		};
		/**
		 * ==================== Create Role/Permission ======================
		 */
		$scope.newRolePermission = {
			type : 'permission'
		};
		$scope.createRolePermission = function(){
			$http.post('api/aclreq', $scope.newRolePermission)
				.success(function(response){
					switch (response) {
						case 'exists':
							appConst.launchModalAlert('info', 'Role with this name already exists');
							break;
						case 'success':
							appConst.flashNotice('success', $scope.newRolePermission.label+' successfully created');
							$scope.newRolePermission.name = '';
							$scope.newRolePermission.label = '';
							break;
						default:
							console.log('something wrong');
					}
				});
		};

	}

})();