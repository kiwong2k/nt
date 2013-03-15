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
					'<div class="span3 iwcFill iwcMailNavigator">' +
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
					'<div class="iwcFill hidden-phone iwcMailViewer">' +
						'<div class="iwcMsgContent" ng-controller="MailViewerCtrl">' +
							'<mailviewer class="iwcFill">mailviewer</mailviewer>' +
						'</div>' +
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
		controller: function($scope, $element, $attrs, $rootScope) {
			$scope.rowClicked = function() {
				$rootScope.$broadcast('MailViewerCtrl-SelectMsg', this.msg.uid, this.msg)
			}

		},
		template:
			'<div>' +
				'<div class="iwcMsg" ng-repeat="msg in $parent.msgs" ng-click="rowClicked()">' +
					'<div class="iwcRow iwcRowHover">' +
						'<div class="inline-block">' +
				            '<label class="checkbox">' +
								'<input type="checkbox">' +
							'</label>' +
						'</div>' +
						'<div class="inline-block">' +
							'<div class="iwcFrom">' +
								//'<div class="pull-right">{{msg.date}}</div>' +
								'<div class="iwcEllipsis">{{msg.subject}}</div>' +
							'</div>' +
							'<div class="iwcSubject iwcEllipsis">' +
								'{{msg.from}}' +
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
}).
directive('mailviewer', function() {
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
				'<div class="iwcMsgHeader">' +
					'<div class="iwcSubject iwcEllipsis">' +
						'{{$parent.msg.subject}}' +
					'</div>' +
					'<div class="iwcFrom iwcEllipsis">' +
						'{{$parent.msg.from}}' +
					'</div>' +
				'</div>' +
				'<div class="iwcMsgBody">' +
					'<div class="iwcContent iwcEllipsis">' +
						'{{$parent.msg.html}}' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	};
})