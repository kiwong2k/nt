'use strict';

/* Controllers */

function LoginCtrl($scope, $window, $translate, $translatePartialLoader, iwcp, c11n) {

	$scope.dataChanged = function() {
		$scope.isDisabled = !($scope.userName && $scope.password);
	}

	$scope.login = function() {
		console.log("LoginCtrl::login", $scope.userName, $scope.password);
		iwcp.login({'username': $scope.userName, 'password': $scope.password}).
			then(function(result) {
				console.log('LoginCtrl::login succeeded');
				$window.location = "/iwc_static/main.html";
			}, function(result) {
				console.log('LoginCtrl::login failed');
			});
	}

	$scope.startup = function() {
		$scope.dataChanged();
		iwcp.preLogin()
		$translatePartialLoader.addPart('iwc');
		$translate.refresh().
			then(function() {
				$scope.isReady = true;
			});	
	}

	console.log("LoginCtrl starts")

	// manually turn on c11n
	c11n.enable();
	
	// load c11n
	c11n.startup().
		then(function() {
			console.log('LoginCtrl c11n startup succeeded');
			c11n.loadModule('c11nLoginCtrl', $scope.startup, {$scope: $scope});
		}, function() {
			console.log('LoginCtrl c11n startup failed');

		});
 	
}