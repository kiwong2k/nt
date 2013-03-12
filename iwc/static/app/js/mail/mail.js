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
					'<div class="span2 iwcFill" ng-controller="MailMsgListCtrl">' +
						'<mailmsglist title="Mail" class="iwcFill" >Mail Service</mailmsglist>' +
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
					'<div class="span10 iwcFill">' +
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
				'</div>',
		replace: true
	};
})