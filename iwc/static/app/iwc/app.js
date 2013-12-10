'use strict';

var iwc = {};
iwc.app = angular.module('myApp', ['ngSanitize', 'ngCookies', 'ui.bootstrap', 'pascalprecht.translate']);
	/*
	 config(function($routeProvider) {
	 $routeProvider.
	 when('/mail', {controller:MailCtrl, templateUrl:'mail.html'}).
	 otherwise({redirectTo:'/'
	 }).
	 */

iwc.app.config(function($translateProvider, $translatePartialLoaderProvider) {
	$translateProvider.translations('en', {});
	$translateProvider.useLoader('$translatePartialLoader', {
		urlTemplate: '{part}/i18n/locale_{lang}.json'
	});

	$translateProvider.preferredLanguage('en');
});


iwc.app.config(function($controllerProvider, $provide) {
	iwc.app.controller = $controllerProvider.register;
	iwc.app.service = $provide.service;
});

