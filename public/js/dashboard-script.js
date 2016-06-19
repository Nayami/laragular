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
			.when('/users/edit/:user_id?', {
				templateUrl: 'ngviews/users.html',
				controller : 'UsersController'
			})
			.when('/settings/:option_param?', {
				templateUrl: 'ngviews/settings.html',
				controller : 'SettingsController'
			})
			.otherwise({
				redirectTo : '/'
			})
	}

})();
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
;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$scope', '$http', '$timeout'];
	function DashboardController($scope, $http, $timeout) {

		//@TODO: maybe change to http call
		$timeout(function(){
			$scope.dashboardWidgets = true;
		},50);

		//$http.get('api/settings')
		//	.success(function(settings) {$scope.settings = true;})
		//	.error(function() {$scope.user = false;});
	}

})();
;(function() {
	"use strict";

	function removeNotice (elem){
		return setTimeout(function(){
			elem.remove();
		}, 300);
	}

	var AE = angular.element,
		_BODY = AE('body'),
		modalAlert = function(itemClass, msg) {
			return "\
			<div class='alert-backdrop'>\
				<div class='alert alert-" + itemClass + "'>\
				<p>" + msg + "</p>\
				</div>\
			</div>";
		},
		modalConfirm = function(confirmid, itemClass, msg) {
			return "\
			<div class='alert-backdrop' id='" + confirmid + "'>\
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
			</div>";
		},
		noticeHtml = function(itemClass, msg) {
			return "\
			<div class='notice-container alert alert-"+itemClass+"'>\
				<p>"+msg+"</p>\
			</div>\
			";
		};


	angular.module('dashboardModule')
		.constant('appConst', {
			csrf: AE.find('meta[name="csrf-roken"]')[0].content,

			launchModalAlert: function(itemClass, msg) {
				_BODY.prepend(modalAlert(itemClass, msg));
				setTimeout(function() {
					_BODY.find('.alert-backdrop').addClass('show');
				}, 100);
			},

			modalConfirm: function(confirmid, itemClass, msg) {
				_BODY.prepend(modalConfirm(confirmid, itemClass, msg));
				setTimeout(function() {
					_BODY.find('.alert-backdrop').addClass('show');
				}, 100);
			},

			detachModalEvent: function(modal) {
				var modalOverlay = AE(modal),
					relatedTrigger = AE('[data-related-modal="' + modal + '"]') || null,
					type = relatedTrigger.length > 0 ? relatedTrigger.attr('data-modal-trigger') : null;

				modalOverlay.removeClass('show');
				setTimeout(function() {
					modalOverlay.css('display', 'none');
					AE(window).trigger('aaModalClosed', [type, relatedTrigger])
				}, 300);
			},

			flashNotice: function(noticeClass, message) {
				_BODY.prepend(noticeHtml(noticeClass, message));
				setTimeout(function() {
					_BODY.find('.notice-container').addClass('show');
					setTimeout(function(){
						_BODY.find('.notice-container').removeClass('show');
						removeNotice(_BODY.find('.notice-container'));
					}, 4000);
				}, 200);
			}

		});


})();
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

		// Get available roles
		$scope.defaultRoles = [];
		$http.get('api/data/get_available_roles')
			.success(function(data) {
				angular.forEach(data, function(item) {
					$scope.defaultRoles.push({
						name : item.name,
						value: item.label
					});
				});
			});

		// Create a User
		$scope.addNew = function(){
			$http.post('restusers', $scope.newuser)
				.success(function(data){

					if(data !== 'fail') {
						var u = data.response.user;
						u.gravatarImage = data.response.avatar;
						u.roles = data.response.roles;
						u._date = new Date(data.response.user.created_at);

						$scope.users.push(u);

						$scope.newuser.name ="";
						$scope.newuser.email ="";
						$scope.newuser.password ="";

						appConst.detachModalEvent('#add-a-user-modal');
					}
				});
		};

		/**
		 * =======================================================
		 * ==================== Update User ======================
		 * =======================================================
		 */
		$scope.updateUser = function(id){

			$http.patch('restusers/'+id, $scope.user)
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
			 * =======================================================
			 * ==================== Single user ======================
			 * =======================================================
			 */
			$scope.dynamicTemplate = 'ngviews/users/_single_user.html';

			if($location.path().indexOf('/users/edit/') > -1) {
				$scope.dynamicTemplate = 'ngviews/users/_edit_user.html';
			}

			$http.get('api/users/' + $routeParams.user_id)
				.success(function(user) {
					var rls = [];
					angular.forEach(user.roles, function(item) {
						rls.push({
							name : item.name,
							value: item.label
						});
					});
					user.__roles = rls;
					$scope.user = user;

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
			 * =====================================================
			 * ==================== All users ======================
			 * =====================================================
			 */
			$http.get('api/users')
				.success(function(users) {
					angular.forEach(users, function(index){
						index._date = new Date(index.created_at);
					});
					$scope.users = users;
				})
				.error(function() {$scope.users = false;});
		}

		$scope.pagedValue = 8;
		$scope.loadmore = function() {

			$http.get('api/users/paginate/'+$scope.pagedValue+'/8')
				.success(function(users){
					angular.forEach(users, function(index){
						index._date = new Date(index.created_at);
						$scope.users.push(index);
					})
				});

			$scope.pagedValue += 8;
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
jQuery(document).ready(function ($){

	/**
	 * ==================== Modal and alerts Alicelf Plugin ======================
	 */

	$.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {
		var found = 'found';
		var $this = $(this.selector);
		var $elements = $this.not(function() {
			return $(this).data(found);
		}).each(handler).data(found, true);

		if (!isChild) {
			(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
				window.setInterval(function() {
					$this.waitUntilExists(handler, shouldRunHandlerOnce, true);
				}, 500)
			;
		}
		else
			if (shouldRunHandlerOnce && $elements.length) {
				window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
			}

		return $this;
	};

	var _BODY = document.body,
		_HTML = document.documentElement,
		_DOCUMENT_HEIGHT = Math.max(_BODY.scrollHeight, _BODY.offsetHeight,
			_HTML.clientHeight, _HTML.scrollHeight, _HTML.offsetHeight),
		_TOP_OFFSET = document.documentElement.scrollTop || document.body.scrollTop,
		_LEFT_OFFSET = document.documentElement.scrollLeft || document.body.scrollLeft,

		alertHolder = function(itemClass, sendedMessage) {
			return "<div class='alert alert-" + itemClass + "'>" +
				"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
				"<span aria-hidden='true'>&times;</span>" +
				"</button><h3 class='text-center'>" + sendedMessage + "</h3></div>"
		},
		modalAlert = function(itemClass, msg) {
			return "<div class='alert-backdrop'><div class='alert alert-" + itemClass + "'>" +
				"<p>" + msg + "</p></div></div>"
		},
		launchModalAlert = function(itemClass, msg) {
			var bodyselector = $('body');
			bodyselector.prepend(modalAlert(itemClass, msg));
			setTimeout(function() {
				bodyselector.find('.alert-backdrop').addClass('show');
			}, 100);
		},
		elemHasClass = function(el, cls) {
			return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
		},
		capitalize = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};

	$('[data-modal-trigger]').waitUntilExists(function(){
		var that = $(this);
		that.on('click', function(e) {

			e.preventDefault();
			var that = $(this),
				type = that.attr('data-modal-trigger'),
				body = $('body'),
				relatedModal = that.attr('data-related-modal');

			body.find(relatedModal).css({'display': 'block'});
			setTimeout(function() {
				body.find(relatedModal).addClass('show');
			}, 10);
			$(relatedModal).trigger('aaModalOpened', [type, relatedModal]);

		});
	});

	/**
	 * ==================== Open modal from event ======================
	 * raizeModalEvent("#login-modal")
	 */
	var raizeModalEvent = function(modal) {
		var relatedTrigger = $('[data-related-modal="' + modal + '"]') || null,
			type = relatedTrigger.length > 0 ? relatedTrigger.attr('data-modal-trigger') : null;

		$(modal).css({'display': 'block'});
		setTimeout(function() {
			$(modal).addClass('show');
		}, 10);

		$(window).trigger('aaModalOpened', [type, relatedTrigger]);
	};

	/**
	 * ==================== Remove Modal ======================
	 * detachModalEvent("#login-modal")
	 */
	var detachModalEvent = function(modal) {
		var modalOverlay = $(modal),
			relatedTrigger = $('[data-related-modal="' + modal + '"]') || null,
			type = relatedTrigger.length > 0 ? relatedTrigger.attr('data-modal-trigger') : null;

		modalOverlay.removeClass('show');
		setTimeout(function() {
			modalOverlay.css('display', 'none');
			$(window).trigger('aaModalClosed', [type, relatedTrigger])
		}, 300);

	};

	/**
	 * ==================== Close modal button ======================
	 * closeParentModal("#login-modal")
	 */
	var closeParentModal = function(modal) {
		var closeTrigger = $('[data-destroy-modal="' + modal + '"]'),
			modalOverlay = $(closeTrigger.attr('data-destroy-modal'));

		closeTrigger.on('click', function(e) {
			e.preventDefault();
			modalOverlay.removeClass('show');
			setTimeout(function() {
				modalOverlay.css('display', 'none');
				$(window).trigger('aaModalClosed');
			}, 300);
		});

	};

	var closeTrigger = $('[data-destroy-modal]');

	closeTrigger.waitUntilExists(function(){
		var that = $(this);
		that.on('click', function(e) {
			e.preventDefault();
			var that = $(this),
				modalOverlay = $(that.attr('data-destroy-modal'));

			modalOverlay.removeClass('show');
			setTimeout(function() {
				modalOverlay.css('display', 'none');
				$(window).trigger('aaModalClosed');
			}, 300);
		});
	});


	$('.modal-backdrop[itemscope="aa-modal"]').waitUntilExists(function() {
		var that = $(this);
		that.on('click', function(e) {
			if (elemHasClass(e.target, 'modal-backdrop')) {
				that.removeClass('show');
				$(window).trigger('aaModalClosed');
				setTimeout(function() {
					that.css({'display': 'none'});
				}, 400);
			}
		});
	});

	$(window).on('aaModalOpened', function(e) {
		$(_BODY).addClass('aa-modal-overlay');
	});

	$(window).on('aaModalClosed', function(e) {
		$(_BODY).removeClass('aa-modal-overlay');
	});

	$('.alert-backdrop').waitUntilExists(function() {
		var that = $(this);
		that.on('click', function(e) {
			if (elemHasClass(e.target, 'alert-backdrop') || $(e.target).attr('data-confirm')) {
				that.removeClass('show');
				setTimeout(function() {
					that.remove();
				}, 300);
			}
		});
	});

	//raizeModalEvent("#login-modal");
	//setTimeout(function(){
	//	detachModalEvent("#login-modal");
	//}, 3000);
	//$(window).on('aaModalOpened', function(e, type, relatedModal){
	//	console.log(e, type, relatedModal);
	//});

	// !Modals and alerts ends


});
//# sourceMappingURL=dashboard-script.js.map
