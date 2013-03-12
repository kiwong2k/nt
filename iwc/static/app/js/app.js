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
					'<span class="logo">Convergence</span>' +
					'<span class="nav" ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
						'<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
					'</span>' +
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