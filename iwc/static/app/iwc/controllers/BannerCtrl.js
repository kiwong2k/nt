'use strict';

/* Controllers */

function BannerCtrl($scope, $window, $translate, $translatePartialLoader, iwcp, c11n) {
	$scope.panel = {};
	$scope.panel.key = "iwc";

	// initialize function to setup member variables
	$scope.initialize = function() {
		$scope.panel.template = $scope.panel.key + '/templates/banner.html';
	}

	// startup function
	$scope.startup = function() {
		$scope.initialize();
	}

 	c11n.loadModule('c11nBannerCtrl', $scope.startup, {$scope: $scope});
 
}

