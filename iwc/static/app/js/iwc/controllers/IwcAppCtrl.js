'use strict';

/* Controllers */
function IwcAppCtrl($scope, $cacheFactory, $http, iwcp, iwcprefs, c11n) {
	$scope.$on('iwc-SelectServicePanel', function(event, panel) {
		$scope.selectPanel(panel);
	});

	$scope.selectPanel = function(panel) {
		angular.forEach($scope.panels, function(p) {
			p.selected = false;
		});
		panel.selected = true;

		if (!panel.isLoaded) {
			var packageJSON = 'js/'+panel.key+'/package.json';
			$http.get(
				packageJSON
			).
			success(function(json) {
				$script(
					json,
					function() {
						console.log("successfully loaded", packageJSON)
						$scope.$apply(function() {
							panel.template = 'js/' + panel.key + '/templates/panel.html', 
							panel.isLoaded = true;
						});
					}
				);
			}).
			error(function() {
				console.error("failed to load", packageJSON)
			})
		}
	}

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


			}, function(result) {
				console.log('IwcAppCtrl::bootstrap failed');
			});
	}

	$scope.initialize = function() {
		// template will be loaded dynamically
		$scope.panels = [
			{'key': 'mail', 'template': '', 'title': 'Mail', 'selected': false, 'isLoaded': false},
			{'key': 'calendar', 'template': '', 'title': 'Calendar', 'selected': false, 'isLoaded': false},
			{'key': 'addressbook', 'template': '', 'title': 'Address Book', 'selected': false, 'isLoaded': false}
		];
	}

	$scope.startup = function() {
		$scope.initialize();

		var defaultApp = iwcprefs.get('user_prefs.general.defaultapp');
		var panel;
		angular.forEach($scope.panels, function(p) {
			if (p.key == defaultApp) {
				panel = p;
			}
		});

		if (panel) {
			$scope.selectPanel(panel)
		} else {
			console.error('IwcAppCtrl::startup failed - cannot find defaultApp', defaultApp);
		}
	}

 	//this.panels[0].selected = true;

 	// let's go...
 	$scope.bootstrap().
 		then(function(result) {
 			$scope.startup();
 		});
 	

 	// startup c11nService

}

