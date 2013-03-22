'use strict';

/* Controllers */

function IwcServiceCtrl($scope) {
	$scope.$on('iwcServiceCtrl-selectPanel', function(event, panel) {
		angular.forEach($scope.panels, function(p) {
			p.selected = false;
		});
		panel.selected = true;
	});


	$scope.services = [
		{"ctrl":"MailCtrl", "title":"Mail"},
		{"ctrl":"CalCtrl",  "title":"Calendar"},
		{"ctrl":"AbsCtrl",  "title":"Address Book"}
	];

	$scope.panels = [
		{"template": 'js/mail/templates/panel.html', "title": "Mail", "selected": false},
		{"template": 'js/calendar/templates/panel.html', "title": "Calendar", "selected": false},
		{"template": 'js/addressbook/templates/panel.html', "title": "Address Book", "selected": false}
	]

 	$scope.panels[0].selected = true;

}

