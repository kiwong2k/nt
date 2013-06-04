function IwcMailCtrl($scope, $filter) {
	$scope.panels = [
		{"template": 'js/mail/templates/main/navigator/navigator.html', "selected": true},
		{"template": 'js/mail/templates/main/viewer/viewer.html', "selected": true}
	];

	$scope.navpanels = [
		{"template": 'js/mail/templates/main/navigator/navbar.html', "selected": true},
		{"template": 'js/mail/templates/main/navigator/msglist.html', "selected": true}
	];

	$scope.viewpanels = [
		{"template": 'js/mail/templates/main/viewer/viewerbar.html', "selected": true},
		{"template": 'js/mail/templates/main/viewer/message.html', "selected": true}
	];
	

	$scope.selectedFolder = "inbox";

	$scope.selectedFolderDN = "< " + $scope.selectedFolder;

	$scope.newFolder = function() {
		alert("Compose email not yet implemented");
	}

	$scope.msgs = [
	
		{
			"uid": 5,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 5",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 5",
			"html": "<h2>this is a demo</h2>"

		},
		
		{
			"uid": 6,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 6",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 6",
			"html": "<h2>this is a demo</h2>"

		}
	];
	
	$scope.rowClicked = function(msg) {		
		console.log("row clicked uid="+msg.uid);
		//selectMsg(msg);
		var newMsgs = $filter('filter')($scope.msgs, function(m) {
			return m !== msg;
		});
		
		$scope.msgs = newMsgs;
	}


}