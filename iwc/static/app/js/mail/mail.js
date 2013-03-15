iwc.app.
directive('mailpanel', function() {
	return {
		require: '^views',
		restrict: 'E',
		transclude: true,
		scope: {title: '@'},
		link: function(scope, element, attrs, viewsCtrl) {
			viewsCtrl.addPane(scope);
		},
		controller: function($scope, $element) {
			var panes = $scope.panes = [];

			this.addPane = function(pane) {
				panes.push(pane);
			}
		},
		template:
			'<div class="view-pane container-fluid" ng-class="{active: selected}">' +
				'<div class="row-fluid iwcFill">' +
					'<div class="span3 span3andhalf iwcFill iwcMailNavigator">' +
                			'<div class="iwcMailNavToolbar" ng-controller="MailNavCtrl">' +
						   	'<ul class="nav nav-pills">' +
                     			'<li class="active iwcMaxWidth50"><a class="iwcEllipsis" href="#" ng-model="selectedFolderDN">{{selectedFolderDN}}</a></li>' +
								'<li class="pull-right"><a href="#"><i class="icon-refresh icon-white"></i></a></li>' +
								'<li class="pull-right"><a href="#"><i class="icon-search icon-white"></i></a></li>' +
								'<li class="pull-right"><a href="#" ng-click="newFolder()"><i class="icon-plus icon-white"></i></a></li>' +

							'</ul>' +
    					'</div>' +

						'<div class="iwcMsgList" ng-controller="MailMsgListCtrl">' +
							'<mailmsglist class="iwcFill" >Mail Service</mailmsglist>' +
						'</div>' +

					'</div>' +
					'<div class="iwcFill hidden-phone">' +
						'Body content' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	};
}).
directive('mailmsglist', function() {
	return {
		require: '^mailpanel',
		restrict: 'E',
		transclude: true,
		scope: {title: '@'},
		link: function(scope, element, attrs, paneCtrl) {
			paneCtrl.addPane(scope);
		},
		template:
				'<div>' +
					'<div class="iwcMsg" ng-repeat="msg in $parent.msgs">' +
						'<div class="iwcRow iwcRowHover">' +
							'<div class="inline-block">' +
					            '<label class="checkbox">' +
									'<input type="checkbox">' +
								'</label>' +
							'</div>' +
							'<div class="inline-block">' +
								'<div class="iwcFrom">' +
									//'<div class="pull-right">{{msg.date}}</div>' +
									'<div class="iwcEllipsis">{{msg.from}}</div>' +
								'</div>' +
								'<div class="iwcSubject iwcEllipsis">' +
									'{{msg.subject}}' +
								'</div>' +
								'<div class="iwcContent iwcEllipsis">' +
									'{{msg.html}}' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>',
		replace: true
	};
})