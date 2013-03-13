'use strict';

var iwc = {};
iwc.app = angular.module('myApp', []).
	/*
	 config(function($routeProvider) {
	 $routeProvider.
	 when('/mail', {controller:MailCtrl, templateUrl:'mail.html'}).
	 otherwise({redirectTo:'/'
	 }).
	 */
	directive('views', function() {
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
					'<div class="view-banner">' +
						'<ul class="nav nav-pills iwcRoundRadius">' +
							'<li><span class="logo">Convergence</span></li>' +
							'<li class="nav" ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
								'<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
							'</li>' +
							'<li class="pull-right">' +
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
							'<li class="pull-right"><a href="#"><i class="icon-cog icon-white"></i></a></li>' +
							'<li class="pull-right"><a href="#"><i class="icon-fire icon-white"></i></a></li>' +
						'</ul>' +
					/*
						'<div class="btn-group pull-right">' +
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
						'<a href="#"><i class="icon-cog pull-right"></i></a>' +
						'<a href="#"><i class="icon-fire pull-right"></i></a>' +
					*/
					'</div>' +
					'<div class="view-content" ng-transclude></div>' +
				'</div>',
			replace: true
		};
	}).
	directive('pane', function() {
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
	})