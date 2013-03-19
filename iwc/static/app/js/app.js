'use strict';

var iwc = {};
iwc.app = angular.module('myApp', []);
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
		scope: { title: '@', svcname: '@' },
		template:
			'<div class="iwcBanner">' +
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
									'<li class="nav" ng-repeat="pane in $parent.panels" ng-class="{active:pane.selected}">'+
										'<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
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
												'<li><a href="#"><i class="i"></i> Make admin</a></li>' +
											'</ul>' +
										'</div>' +
									'</li>' +
								'</ul>' +
								/*'<p class="navbar-text pull-right">Logged in as <a href="#">username</a></p>' + */
							'</div>' + <!--/.nav-collapse -->
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	};
});

iwc.app.directive('views', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: function($scope, $element) {
			var panes = $scope.panes = [];

			$scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
					pane.selected = false;
				});
				pane.selected = true;

            }

			this.addPane = function(pane) {
				if (panes.length == 0) $scope.select(pane);
				panes.push(pane);
			}
		},
		template:
			'<div class="views-container">' +
				'<div class="view-content" ng-transclude></div>' +
			'</div>',
		replace: true
	};
});

iwc.app.directive('pane', function() {
	return {
		require: '^views',
		restrict: 'E',
		transclude: true,
		scope: { title: '@', svcname: '@' },
		link: function(scope, element, attrs, viewsCtrl) {
			viewsCtrl.addPane(scope);
		},
		template:
			'<div class="view-pane" ng-class="{active: selected}" ng-transclude>' +
				'</div>',
		replace: true
	};
})  ;