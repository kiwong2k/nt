'use strict';

/* Controllers */

function iwcServiceCtrl($scope) {
	$scope.services = [
		{"ctrl":"MailCtrl", "title":"Mail"},
		{"ctrl":"CalCtrl",  "title":"Calendar"},
		{"ctrl":"AbsCtrl",  "title":"Address Book"}
	];

	$scope.panels = [
		{template: 'MailCtrlPanel.html', "title": "Mail", "selected": false},
		{template: 'CalCtrlPanel.html', "title": "Calendar", "selected": false},
		{template: 'AbsCtrlPanel.html', "title": "Address Book", "selected": false}
	]

	$scope.panels[0].selected = true;
}

function CalCtrl($scope) {
    var x = 10;
    //debugger;
    x = "abc"

}

function AbsCtrl($scope) {
    var x = 10;
    //debugger;
    x = "abc"

}