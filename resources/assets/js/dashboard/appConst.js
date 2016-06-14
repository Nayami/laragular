;(function() {
	"use strict";

	var modalAlert = function(itemClass, msg) {
		return "\
			<div class='alert-backdrop'>\
				<div class='alert alert-" + itemClass + "'>\
				<p>" + msg + "</p>\
				</div>\
			</div>";
	},
		modalConfirm = function(confirmid, itemClass, msg) {
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
			</div>";
		};


	angular.module('dashboardModule')
		.constant('appConst', {
			csrf            : angular.element.find('meta[name="csrf-roken"]')[0].content,
			launchModalAlert: function(itemClass, msg) {
				var bodyElem = angular.element('body');
				bodyElem.prepend(modalAlert(itemClass, msg));
				setTimeout(function() {
					bodyElem.find('.alert-backdrop').addClass('show');
				}, 100);
			},
			modalConfirm : function(confirmid, itemClass, msg){
				var bodyElem = angular.element('body');
				bodyElem.prepend(modalConfirm(confirmid, itemClass, msg));
				setTimeout(function() {
					bodyElem.find('.alert-backdrop').addClass('show');
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