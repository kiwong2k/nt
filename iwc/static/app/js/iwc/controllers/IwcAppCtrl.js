'use strict';

/* Controllers */
function IwcAppCtrl($scope, $cacheFactory, iwcp, iwcprefs, c11n) {
	$scope.$on('iwc-SelectServicePanel', function(event, panel) {
		angular.forEach($scope.panels, function(p) {
			p.selected = false;
		});
		panel.selected = true;

		if (!panel.isLoaded) {
			panel.template = 'js/' + panel.key + '/templates/panel.html', 
			panel.isLoaded = true;
		}
	});

	// return a promise
	$scope.bootstrap = function() {
		console.log('IwcAppCtrl::bootstrap');
		return iwcp.getAllPrefs().
			then(function(result) {
				console.log('IwcAppCtrl::bootstrap succeeded');
				iwcprefs.put(result);

				// load c11n
				c11n.startup();

				//c11n.loadModule('IwcAppCtrl');

				//_loadApp(iwcprefs.get('user_prefs.general.defaultapp'));


			}, function(result) {
				console.log('IwcAppCtrl::bootstrap failed');
			});
	}


	$scope.panels = [
	/*
		{'key': 'mail', 'template': 'js/mail/templates/panel.html', 'title': 'Mail', 'selected': false},
		{'key': 'calendar', 'template': 'js/calendar/templates/panel.html', 'title': 'Calendar', 'selected': false},
		{'key': 'addressbook', 'template': 'js/addressbook/templates/panel.html', 'title': 'Address Book', 'selected': false}
	*/
	
		{'key': 'mail', 'template': '', 'title': 'Mail', 'selected': false, 'isLoaded': false},
		{'key': 'calendar', 'template': '', 'title': 'Calendar', 'selected': false, 'isLoaded': false},
		{'key': 'addressbook', 'template': '', 'title': 'Address Book', 'selected': false, 'isLoaded': false}
	
	];

 	//this.panels[0].selected = true;

 	// let's go...
 	$scope.bootstrap().
 		then(function(result) {

 		});
 	

 	// startup c11nService

}

