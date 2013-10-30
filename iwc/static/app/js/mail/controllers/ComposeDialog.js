function ComposeDialog($scope, $modalInstance){
	$scope.close = function(result){
		$modalInstance.close(result);
	};
}
