/* Controllers */

/*
iwc.app.controller('c11nIwcAppCtrl', ['$scope', 
				function($scope) {
*/
function c11nIwcAppCtrl($scope) {
	// To reuse parent class methods, you must save parent class methods before redefine them
	$scope.oldFuncs = {};
	$scope.oldFuncs.initialize = $scope.initialize;

	//
	// Get the $injector
	// var $injector = angular.element('body').injector();
	//
	// Use the $injector to get service
	// $injector.get('iwcutil')
	// $injector.get('http')
	//

	$scope.initialize = function() {
		// template will be loaded dynamically
		$scope.oldFuncs.initialize();

		$scope.panels.push(
			{'key': 'plaxo', 'template': '', 'title': 'Plaxo', 'selected': false, 'isLoaded': false}
		);		
	}

//}]);
}

