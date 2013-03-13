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

				/*

						'<div class="iwcMailNavToolbar" ng-controller="MailNavCtrl">' +
							'<mailnavtoolbar></mailnavtoolbar>' +
						'<div>' +
				*/

						'<div class="iwcMailNavToolbar" ng-controller="MailNavCtrl">' +
						   	/*
						   	    '<input type="text" class="input-mini search-query" ng-model="selectedFolderDN" disabled>' +
						   	 */
							'<ul class="nav nav-pills iwcRoundRadius">' +
								'<li class="active iwcMaxWidth50"><a class="iwcEllipsis" href="#" ng-model="selectedFolderDN">{{selectedFolderDN}}</a></li>' +
								'<li><a href="#" ng-click="newFolder()"><i class="icon-plus"></i></a></li>' +
								'<li><a href="#"><i class="icon-search"></i></a></li>' +
								'<li><a href="#"><i class="icon-refresh"></i></a></li>' +
							'</ul>' +
    					'</div>' +

						'<div class="iwcMsgList" ng-controller="MailMsgListCtrl">' +
							'<mailmsglist class="iwcFill" >Mail Service</mailmsglist>' +
						'</div>' +

					'</div>' +
				/*
					'<div class="span2 iwcFill">' +
						'<div class="iwcMsgList" ng-repeat="msg in $parent.msgs">' +
							'<div class="iwcRow iwcRowHover">' +
								'<div>' +
								'<div class="iwcFrom">' +
										//'<div class="iwcFloatRight">{{msg.date}}</div>' +
										'<div class="iwcEllipsis"><h4>{{msg.from}}</h4></div>' +
								'</div>' +
								'<div class="iwcClearRight iwcSubject iwcEllipsis">' +
									'<b>{{msg.subject}}</b>' +
								'</div>' +
								'<div class="iwcContent iwcEllipsis">' +
									'{{msg.html}}' +
								'</div>' +
								'</div>' +
							'</div>' +
							'<hr>' +
						'</div>' +
					'</div>' +
				*/
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
							'<div>' +
								'<div class="iwcFrom">' +
									//'<div class="iwcFloatRight">{{msg.date}}</div>' +
									'<div class="iwcEllipsis"><h4>{{msg.from}}</h4></div>' +
								'</div>' +
								'<div class="iwcClearRight iwcSubject iwcEllipsis">' +
									'<b>{{msg.subject}}</b>' +
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