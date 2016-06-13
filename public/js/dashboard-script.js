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

	var modalAlert = function(itemClass, msg) {
		return "<div class='alert-backdrop'><div class='alert alert-" + itemClass + "'>" +
			"<p>" + msg + "</p></div></div>"
	};


	angular.module('dashboardModule')
		.constant('appConst', {
			csrf            : angular.element.find('meta[name="csrf-roken"]')[0].content,
			launchModalAlert: function(itemClass, msg) {
				var bodyselector = angular.element('body');
				bodyselector.prepend(modalAlert(itemClass, msg));
				setTimeout(function() {
					bodyselector.find('.alert-backdrop').addClass('show');
				}, 100);
			},
			detachModalEvent: function(modal) {
				var modalOverlay = angular.element(modal),
					relatedTrigger = angular.element('[data-related-modal="' + modal + '"]') || null,
					type = relatedTrigger.length > 0 ? relatedTrigger.attr('data-modal-trigger') : null;

				modalOverlay.removeClass('show');
				setTimeout(function() {
					modalOverlay.css('display', 'none');
					angular.element(window).trigger('aaModalClosed', [type, relatedTrigger])
				}, 300);

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
			avatarUrl : function() {
				return $resource("api/data/:helper/:argues",{ helper: '@helper', argues: '@argues' });
			}

		};
	}

})();
;(function() {
	"use strict";

	angular.module('dashboardModule')
		.controller('UsersController', UsersController);

	UsersController.$inject = ['$scope', '$http', '$routeParams', 'ServiceHelpers', 'appConst' ];
	function UsersController($scope, $http, $routeParams, ServiceHelpers, appConst) {

		//appConst.csrf

		$scope.dynamicTemplate = 'ngviews/users/_users.html';

		$scope.userCanmanage = true;// Temporary

		$scope.roles = [
			{name:'admin', value:'Admin'},
			{name:'manager', value:'Manager'},
			{name:'customer', value:'Customer'},
			{name:'subscriber', value:'Subscriber'},
		];

		// Create a User
		$scope.addNew = function(){
			$http.post('restusers', $scope.newuser)
				.success(function(data){

					if(data !== 'fail') {
						var u = data.response.user;
						u.gravatarImage = data.response.avatar;
						u.role = data.response.role;
						$scope.users.push(u);

						$scope.newuser.name ="";
						$scope.newuser.email ="";
						$scope.newuser.password ="";

						appConst.detachModalEvent('#add-a-user-modal');
					}
				});
		};

		// Destroy user
		$scope.destroyUser = function (id, $index) {

			if(!confirm('Are you sure?'))
				return false;
			$http.delete('restusers/' + id).then(function(response) {

				if (response.data.status === "self_del")
					appConst.launchModalAlert('danger','You can\'t delete yourself');

				if (response.data.status === "success")
					$scope.users.splice($index, 1);
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
			e.stopPropagation();
			if (elemHasClass(e.target, 'alert-backdrop')) {
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
