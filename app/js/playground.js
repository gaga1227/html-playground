angular.module('playground',
[
	'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource',
	'ui.router', 'ui.ace',
])
.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('dash', {
			url: '/',
			templateUrl: 'partials/dash.html',
			controller: 'DashController'
		})
		.state('pattern', {
			url: '/pattern/:id',
			templateUrl: 'partials/pattern.html',
			controller: 'PatternController'
		});
	$urlRouterProvider.otherwise('/');
});
