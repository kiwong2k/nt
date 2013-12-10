'use strict';

/* Controllers */
iwc.app.controller('BannerCtrl', ['$scope', 'iwcprefs', 'c11n', 
				function($scope, iwcprefs, c11n) {
	// initialize function to setup member variables
	$scope.initialize = function() {
		 $scope.username = iwcprefs.get('user_prefs.general.screenname') || 
		 				iwcprefs.get('user_prefs.general.cn') ||
		 				iwcprefs.get('user_prefs.general.email');
	}

	// startup function
	$scope.startup = function() {
		$scope.initialize();
	}

	console.log('BannerCtrl constructor');

 	c11n.loadModule('c11nBannerCtrl', $scope.startup, {$scope: $scope});
 
}]);
