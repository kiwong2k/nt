'use strict';

/* Controllers */
function IwcAppCtrl($scope, $cacheFactory, iwcp, iwcprefs) {
	
	$scope.$on('iwc-SelectServicePanel', function(event, panel) {
		angular.forEach($scope.panels, function(p) {
			p.selected = false;
		});
		panel.selected = true;
	});
	
	// return a promise
	this.bootstrap = function() {
		console.log("IwcAppCtrl::bootstrap");
		return iwcp.getAllPrefs().
			then(function(result) {
				console.log('IwcAppCtrl::bootstrap succeeded');
				iwcprefs.put(result);
				
				//_loadApp(iwcprefs.get('user_prefs.general.defaultapp'));


			}, function(result) {
				console.log('IwcAppCtrl::bootstrap failed');
			});
	}

	$scope.panels = this.panels = [
		{"template": 'js/mail/templates/main/panel.html', "title": "Mail", "selected": false},
		{"template": 'js/calendar/templates/panel.html', "title": "Calendar", "selected": false},
		{"template": 'js/addressbook/templates/panel.html', "title": "Address Book", "selected": false}
	];

 	//this.panels[0].selected = true;

 	// let's go...
 	this.bootstrap();
 	

 	// startup c11nService

}

