'use strict';

/* Controllers */

function iwcServiceCtrl($scope) {
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
		{template: 'js/mail/panel.html', "title": "Mail", "selected": false},
		{template: 'js/calendar/panel.html', "title": "Calendar", "selected": false},
		{template: 'js/addressbook/panel.html', "title": "Address Book", "selected": false}
	]

 	$scope.panels[0].selected = true;

}

