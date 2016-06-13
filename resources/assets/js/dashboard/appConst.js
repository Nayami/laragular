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