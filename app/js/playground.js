angular.module('playground',
	[
		'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource',
		'ui.router', 'ui.ace',
		'pasvaz.bindonce'
	])
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'partials/home.html',
				controller: 'HomeController'
			})
			.state('pattern', {
				url: '/pattern:id',
				templateUrl: 'partials/pattern.html',
				controller: 'PatternController'
			});
		$urlRouterProvider.otherwise('/');
	})
;
