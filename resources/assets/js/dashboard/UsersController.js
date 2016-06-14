;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('UsersController', UsersController);

	UsersController.$inject = [
		'$scope',
		'$http',
		'$routeParams',
		'ServiceHelpers',
		'appConst',
		'$timeout',
		'$compile',
		'$location'
	];
	function UsersController(
		$scope,
		$http,
		$routeParams,
		ServiceHelpers,
		appConst,
		$timeout,
		$compile,
		$location
	) {

		//appConst.csrf

		$scope.dynamicTemplate = 'ngviews/users/_users.html';

		$scope.userCanmanage = true;// Temporary

		$scope.roles = [
			{name:'developer', value:'Developer'},
			{name:'admin', value:'Admin'},
			{name:'manager', value:'Manager'},
			{name:'customer', value:'Customer'},
			{name:'subscriber', value:'Subscriber'},
		];

		$scope.currentRole = function(role) {
			var position = 0;
			angular.forEach($scope.roles, function(v, k){
				if(v.name == role)
					position = k;
			});
			return position;
		};

		// Create a User
		$scope.addNew = function(){
			$http.post('restusers', $scope.newuser)
				.success(function(data){

					if(data !== 'fail') {
						var u = data.response.user;
						u.gravatarImage = data.response.avatar;
						u.role = data.response.role;
						u._date = new Date(data.response.user.created_at);

						$scope.users.push(u);

						$scope.newuser.name ="";
						$scope.newuser.email ="";
						$scope.newuser.password ="";

						appConst.detachModalEvent('#add-a-user-modal');
					}
				});
		};

		$scope.updateUser = function(id){
			$http.patch('restusers/'+id, $scope.edituser)
				.success(function(data){
					if(data.status === 'restrict') {
						appConst.launchModalAlert('danger', 'You can\'t perform this actions');
					}
					if(data.status === 'success') {
						appConst.launchModalAlert('success', 'User Updated');
						$location.path('/users/'+id).replace();
					}

				});
		};

		// Destroy user
		$scope.destroyUser = function (id, $index) {

			$timeout(function() {
				var ahtm = ServiceHelpers.mconf('alert-users-warn', 'warning', 'Are you sure?');
				$("body").prepend($compile(ahtm)($scope));
				setTimeout(function() {angular.element('body').find('#alert-users-warn').addClass('show');}, 50);

				angular.element('#alert-users-warn').find('[data-confirm=confirm]').on('click', function(){

					$http.delete('restusers/' + id).then(function(response) {

						if (response.data.status === "self_del")
							appConst.launchModalAlert('danger','You can\'t delete yourself');

						if (response.data.status === "success")
							$scope.users.splice($index, 1);

					});

				});

			}, 50);

		};


		if ('user_id' in $routeParams) {
			/**
			 * ==================== Single user ======================
			 */
			$scope.dynamicTemplate = 'ngviews/users/_single_user.html';

			if($location.path().indexOf('/users/edit/') > -1) {
				$scope.dynamicTemplate = 'ngviews/users/_edit_user.html';
			}

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
						index._date = new Date(index.created_at);

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