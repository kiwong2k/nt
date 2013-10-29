function ComposeDialog($scope, dialog){
	$scope.close = function(result){
		dialog.close(result);
	};
}
