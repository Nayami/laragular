;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$http', 'appConst', '$compile'];
	function SettingsController($scope, $http, appConst, $compile) {
		var AE = angular.element;
		$http.get('settings')
			.success(function(settings) {
				$scope.allsettings = settings;
			});

		$scope.activeTab = 'acl-tab';
		$scope.switchTab = function(tab) {
			return $scope.activeTab = tab;
		};

		// ?i=1000
		// ?i=1001
		$scope.templates = {
			aclOverview: 'ngviews/settings/acl-overview.html',
			aclCreate: 'ngviews/settings/acl-manage.html',
			//aclOverview: 'ngviews/settings/acl-overview.html?i=1001',
			//aclCreate: 'ngviews/settings/acl-manage.html?i=1001',
		};
		//$scope.aclTpl = $scope.templates.aclOverview;
		$scope.aclTpl = $scope.templates.aclCreate;

		$http.get('api/aclreq')
			.success(function(response) {
				$scope.rolesAndPermissions = response.roles;
				$scope.permissionsDefaults = response.permissions;
			})
			.error(function(){
				$scope.rolesAndPermissions = false;
				$scope.permissionsDefaults = false;
			});

		/**
		 * ==================== Create Role/Permission ======================
		 */
		$scope.newRolePermission = {
			type: 'role'
		};
		$scope.createRolePermission = function() {

			$http.post('api/aclreq', $scope.newRolePermission)
				.success(function(response) {
					var _type = $scope.newRolePermission.type,
						_label = $scope.newRolePermission.label,
						checkType = _type.toLowerCase();
					if (response.status === 'exists') {
						appConst.launchModalAlert('info', _type +' with name '+_label+' already exists');
					}
					if (response.status === 'success') {
						if (checkType === 'role') {
							$scope.rolesAndPermissions.push(response._role);
						}
						if (checkType === 'permission') {
							$scope.permissionsDefaults.push(response._permission);
						}
						appConst.flashNotice('success', $scope.newRolePermission.label + ' successfully created');
					}

					$scope.newRolePermission.name = '';
					$scope.newRolePermission.label = '';
				});

		};

		// Edit Role/Permisison
		$scope.editRolePermission = function(item, type) {
			item.type = type;

			$http.patch('api/aclreq/'+item.id, item)
				.success(function(response){

					if(response.status === 'empty_fields')
						appConst.launchModalAlert('warning','The fields cannot be blank');

					if(response.status === 'success')
						appConst.flashNotice('success', '<i class="fa fa-info-circle"></i> Updated');
				});
		};

		// Destroy Role
		$scope.destroyRole = function(item) {
			var index = $scope.rolesAndPermissions.indexOf(item),
				ahtm = appConst.mconf('alert-role-warn', 'warning', 'Are you sure?');

			AE("body").prepend($compile(ahtm)($scope));
			setTimeout(function() {AE('body').find('#alert-role-warn').addClass('show');}, 50);
			AE('#alert-role-warn').find('[data-confirm=confirm]').on('click', function() {
				$http.delete('api/aclreq/' + item.id).then(function(response) {
					if (response.data.status === "self_role")
						appConst.launchModalAlert('danger', 'You can\'t delete your role');

					if (response.data.status === "success")
						$scope.rolesAndPermissions.splice(index, 1);

				});
			});

		};

		// Destroy Permission
		$scope.destroyPermission = function(permission) {
			var index = $scope.permissionsDefaults.indexOf(permission),
				ahtm = appConst.mconf('alert-permission-warn', 'warning', 'Are you sure?');
			AE("body").prepend($compile(ahtm)($scope));
			setTimeout(function() {AE('body').find('#alert-permission-warn').addClass('show');}, 50);

			AE('#alert-permission-warn').find('[data-confirm=confirm]').on('click', function() {
				$http.delete('api/aclreq/destroy_permission/'+permission.id)
					.then(function(response){
						var data = response.data;
						if (data.status === "self_permission")
							appConst.launchModalAlert('danger', 'You can\'t delete your current permissions');

						if(data.status === 'success')
							$scope.permissionsDefaults.splice(index, 1);

					});
			});



		}

	}

})();