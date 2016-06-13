var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
	mix.sass('bootstrap.scss')
		.sass('frontend.scss')
		.sass('dashboard.scss');
});


elixir(function(mix) {
	//var boooJs = "./node_modules/bootstrap-sass/assets/javascripts/bootstrap/";

	mix
	// jQuery
	//	.scripts([
	//		'./bower_components/jquery/dist/jquery.min.js',
	//	], 'public/js/jquery.js')

		// Bootstrap Components
		//.scripts([
		//	//boooJs+'affix.js', //
		//	boooJs+'alert.js',
		//	//boooJs+'button.js', //
		//	boooJs+'carousel.js',
		//	boooJs+'collapse.js',
		//	boooJs+'dropdown.js',
		//	//boooJs+'modal.js', //
		//	//boooJs+'tooltip.js', //
		//	//boooJs+'popover.js', //
		//	//boooJs+'scrollspy.js', //
		//	boooJs+'tab.js',
		//	boooJs+'transition.js'
		//], 'public/js/bootstrap.js')

		// Plugins Components
		//.scripts([
		//	'./bower_components/angular/angular.min.js',
		//	'./bower_components/angular-resource/angular-resource.min.js',
		//	'./bower_components/angular-route/angular-route.min.js',
		//	'./bower_components/angular-animate/angular-animate.min.js',

			//'./bower_components/ng-dialog/js/ngDialog.min.js',

			//'./bower_components/angular/angular.js',
			//'./bower_components/angular-resource/angular-resource.js',
			//'./bower_components/angular-route/angular-route.js',
			//'./bower_components/angular-animate/angular-animate.js'

			//'./bower_components/ng-dialog/js/ngDialog.js',

		//], 'public/js/angular-compiled.js')


		// Dashboard
		.scripts([
			'dashboard/module.js',
			'dashboard/DashboardController.js',
			'dashboard/appConst.js',
			'dashboard/ServiceHelpers.js',
			'dashboard/UsersController.js',
			'dashboard/AsideController.js',
			'dashboard-script.js'
		], 'public/js/dashboard-script.js')
	;


});