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
			console.log(e.target);
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