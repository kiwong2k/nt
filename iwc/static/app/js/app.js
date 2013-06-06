'use strict';

var iwc = {};
iwc.app = angular.module('myApp', ['ngSanitize', 'ui.bootstrap']);
	/*
	 config(function($routeProvider) {
	 $routeProvider.
	 when('/mail', {controller:MailCtrl, templateUrl:'mail.html'}).
	 otherwise({redirectTo:'/'
	 }).
	 */

iwc.app.directive('banner', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: true,
		controller: function($scope, $element, $rootScope) {
			$scope.select = function(panel) {
				$rootScope.$broadcast('iwc-SelectServicePanel', panel);
			}
		},
		template:
			'<div class="iwc-banner">' +
				'<div class="navbar navbar-inverse">' +
					'<div class="navbar-inner">' +
						'<div class="container-fluid">' +
							'<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
							'</a>' +
							'<a class="brand" >Convergence</a>' +
							'<div class="nav-collapse collapse">' +
								'<ul class="nav">' +
									'<li class="nav" ng-repeat="panel in $parent.panels" ng-class="{active:panel.selected}">'+
										'<a href="" ng-click="select(panel)">{{panel.title}}</a>' +
									'</li>' +
								'</ul>' +
								'<ul class="nav pull-right">' +
									'<li><a href="#"><i class="icon-fire icon-white"></i></a></li>' +
									'<li><a href="#"><i class="icon-cog icon-white"></i></a></li>' +
									'<li>' +
										'<div class="btn-group">' +
											'<a class="btn" href="#"><i class="icon-user"></i> Jeff Lin</a>' +
											'<a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><span class="caret"></span></a>' +
											'<ul class="dropdown-menu">' +
												'<li><a href="#"><i class="icon-pencil"></i> Edit</a></li>' +
												'<li><a href="#"><i class="icon-trash"></i> Delete</a></li>' +
												'<li><a href="#"><i class="icon-ban-circle"></i> Ban</a></li>' +
												'<li class="divider"></li>' +
												'<li><a href="#"><i class="i"></i> Sign out </a></li>' +
											'</ul>' +
										'</div>' +
									'</li>' +
								'</ul>' +
								/*'<p class="navbar-text pull-right">Logged in as <a href="#">username</a></p>' + */
							'</div>' + //.nav-collapse
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	};
});

