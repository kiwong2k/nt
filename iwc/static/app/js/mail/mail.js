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
		template:
			'<div class="view-pane container-fluid" ng-class="{active: selected}">' +
				'<div class="row-fluid iwc-fill">' +
					'<div class="span2 iwc-fill">' +
						'Sidebar content' +
					'</div>' +
					'<div class="span10 iwc-fill">' +
						'Body content' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true
	/*
		template:
			'<div class="view-pane" ng-class="{active: selected}">' +
				'<div class="msg-list" ng-repeat="msg in $parent.msgs">' +
				'<h4>{{msg.subject}}</h4>' +
				'</div>' +
				'<span  ng-transclude></span>' +
				'</div>',
		replace: true
	*/
	};
})