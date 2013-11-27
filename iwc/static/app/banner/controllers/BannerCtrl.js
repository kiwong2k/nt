'use strict';

/* Controllers */

function BannerCtrl($scope, $window, $translate, $translatePartialLoader, iwcp, c11n) {

	// initialize function to setup member variables
	$scope.initialize = function() {
		$scope.template = 'iwc/templates/banner.html';
	}

	// startup function
	$scope.startup = function() {
		console.log('BannerControl::startup');

		$scope.initialize();
	}

 	c11n.loadModule('c11nBannerCtrl', $scope.startup, {$scope: $scope});
 
}