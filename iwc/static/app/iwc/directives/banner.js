iwc.app.directive('banner', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: false,
		controller: function($scope, $element, $rootScope) {
			$scope.select = function(panel) {
				$rootScope.$broadcast('iwc-SelectServicePanel', panel);
			}
		},
		template:
			'<div class="iwc-banner">' +
				'<div class="navbar navbar-inverse navbar-static-top">' +
					'<div class="container">' +
						'<div class="navbar-header">' +
							'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' +
								'<span class="sr-only">Toggle navigation</span>' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
							'</button>' +
							'<a class="navbar-brand" href="#">Convergence</a>' +
						'</div>' +
						'<div class="navbar-collapse collapse">' +
							'<ul class="nav navbar-nav">' +
								'<li class="nav" ng-repeat="panel in $parent.panels" ng-class="{active:panel.selected}">'+
									'<a href="" ng-click="select(panel)">{{panel.title}}</a>' +
								'</li>' +
							'</ul>' +
							'<ul class="nav navbar-nav pull-right">' +
								'<li><a href="#"><i class="glyphicon glyphicon-fire icon-white"></i></a></li>' +
								'<li><a href="#"><i class="glyphicon glyphicon-cog icon-white"></i></a></li>' +
								'<li class="dropdown">' +
									'<a class="dropdown-toggle" data-toggle="dropdown" href="#">Jeff Lin <b class="caret"></b></a>' +
									'<ul class="dropdown-menu">' +
										'<li><a href="#"><i class="glyphicon glyphicon-pencil"></i> Edit</a></li>' +
										'<li><a href="#"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>' +
										'<li><a href="#"><i class="glyphicon glyphicon-ban-circle"></i> Ban</a></li>' +
										'<li class="divider"></li>' +
										'<li><a href="#"><i class="i"></i> Sign out </a></li>' +
									'</ul>' +
								'</li>' +
							'</ul>' +
						'</div>' + //.nav-collapse
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	};
});

