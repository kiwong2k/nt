'use strict';

/* Controllers */
function IwcAppCtrl($scope, $cacheFactory, $http, $q, $injector, iwcp, iwcprefs, c11n) {
	$scope.$on('iwc-SelectServicePanel', function(event, panel) {
		$scope.selectPanel(panel);
	});

	$scope.selectPanel = function(panel) {
		angular.forEach($scope.panels, function(p) {
			p.selected = false;
		});
		panel.selected = true;

		if (!panel.isLoaded) {
			var packageJSON = panel.key+'/package.json';
			$http.get(
				packageJSON
			).
			success(function(json) {
				$script(
					json,
					function() {
						console.log('IwcAppCtrl::selectPanel', packageJSON, 'loaded')
						$scope.$apply(function() {
							panel.template = panel.key + '/templates/panel.html', 
							panel.isLoaded = true;
						});
					}
				);
			}).
			error(function() {
				console.error("IwcAppCtrl::selectPanel failed to load", packageJSON)
			})
		}
	}

	// return a promise
	$scope.bootstrap = function() {
		console.log('IwcAppCtrl::bootstrap');

		var deferred = $q.defer();
		
		iwcp.getAllPrefs().
			then(function(result) {
				console.log('IwcAppCtrl::bootstrap getAllPrefs succeeded');
				iwcprefs.put(result);

				// load c11n
				c11n.startup().
					then(function() {
						console.log('IwcAppCtrl::bootstrap succeeded');
						deferred.resolve();
					}, function() {
						console.log('IwcAppCtrl::bootstrap failed');
						deferred.reject();
					});
			}, function(result) {
				console.log('IwcAppCtrl::bootstrap failed');
				deferred.reject();
			});

			return deferred.promise;
	}

	// initialize function to setup member variables
	$scope.initialize = function() {
		// template will be loaded dynamically
		$scope.panels = [
			{'key': 'mail', 'template': '', 'title': 'Mail', 'selected': false, 'isLoaded': false},
			{'key': 'calendar', 'template': '', 'title': 'Calendar', 'selected': false, 'isLoaded': false},
			{'key': 'addressbook', 'template': '', 'title': 'Address Book', 'selected': false, 'isLoaded': false}
		];

	}

	// startup function
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

 	// let's go...
 	$scope.bootstrap().
 		then(function(result) {
 			c11n.loadModule('c11nIwcAppCtrl', $scope.startup, {$scope: $scope});
 		});
 	

 	// startup c11nService

}

