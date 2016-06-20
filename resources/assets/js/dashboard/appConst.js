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