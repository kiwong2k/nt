function ComposeDialog($scope, modal){
	$scope.close = function(result){
		modal.close(result);
	};
}
