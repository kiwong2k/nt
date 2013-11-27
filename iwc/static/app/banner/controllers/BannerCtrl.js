'use strict';

/* Controllers */

function BannerCtrl($scope, $window, $translate, $translatePartialLoader, iwcp, c11n) {

	// initialize function to setup member variables
	$scope.initialize = function() {

	}

	// startup function
	$scope.startup = function() {
		$scope.initialize();
	}

	console.log('BannerControl constructor');

 	c11n.loadModule('c11nBannerCtrl', $scope.startup, {$scope: $scope});
 
}