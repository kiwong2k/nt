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
		{"template": 'js/mail/templates/main/viewer/viewerbar.html', "selected": false},
		{"template": 'js/mail/templates/main/viewer/notice.html', "selected": true},
		{"template": 'js/mail/templates/main/viewer/chkboxnotice.html', "selected": false},
		{"template": 'js/mail/templates/main/viewer/message.html', "selected": false}
	];
	
	//
	// private functions start here
	//
	$scope._fetchMsgs = function(mbox, start, count) {
		var msgs = [];
		var uid = 0;
		var time = (new Date()).getTime(); // in milliseconds
		
		for (var i=0; i<count; i++) {
			uid = start+i;
			msgs.push(
				{
					"uid": uid,
					"date": time - i*21600000,
					"from": "ki.wong@oracle.com",
					"subject": "Demo msg " + uid,
					"size": 100000 * Math.random(),
					"shortText": "This is demo " + uid,
					"html": "<h2>This is demo " + uid
				}
			)
		}
		
		return msgs;
	}

	$scope._showPanels = function(arr, names) {
		function _showPanel(arr, name) {
			name = '/' + name;
			angular.forEach(arr, function(p) {
				p.selected = p.selected || (p.template.indexOf(name) != -1);
			});
		}
	
		angular.forEach(arr, function(p) {
			p.selected = false;
		});
		angular.forEach(names, function(n) {
			_showPanel(arr, n);
		});
	}


	//
	// private functions end here
	//

	// public functions start here
	$scope.newFolder = function() {
		alert("Compose email not yet implemented");
	}

	$scope.getMail = function() {
		var msgs = $scope._fetchMsgs("Inbox", --$scope.uid, 1);
		$scope.msgs = msgs.concat($scope.msgs);
	}

	$scope.rowClicked = function(msg) {
		console.log("row Clicked");
		if ($scope.msg) $scope.msg.isSelected = false;
		$scope.msg = msg;
		$scope.msg.isSelected = true;

		angular.forEach($scope.msgsChecked, function(msg, i) {
			msg.isChecked = false;
		});
		$scope.msgsChecked = [];

		$scope._showPanels($scope.viewpanels, ["viewerbar.html", "message.html"]);
	}
	
	$scope.checkBoxClicked = function(msg, $event) {
		console.log("checkbox Clicked: " + msg.isChecked);
		$event.stopPropagation();
		if (msg.isChecked) {
			$scope.msgsChecked.push(msg);
			if ($scope.msg) $scope.msg.isSelected = false;
			$scope.msg = null;
		} else {
			var newMsgs = $filter('filter')($scope.msgsChecked, function(m) {
				return m !== msg;
			});
			$scope.msgsChecked = newMsgs;
		}

		$scope._showPanels($scope.viewpanels, ["viewerbar.html", "chkboxnotice.html"]);
		
	}
	
	$scope.deleteMsg = function() {
		if ($scope.msg) {
			$scope.msgsChecked.push($scope.msg);
		}

		angular.forEach($scope.msgsChecked, function(msg1, i) {
			var newMsgs = $filter('filter')($scope.msgs, function(m) {
				return m !== msg1;
			});
			$scope.msgs = newMsgs;			
		})

		$scope.msg = null;
		$scope.msgsChecked = [];

		$scope._showPanels($scope.viewpanels, ["notice.html"]);
	}

	// public functions end here

	// initializations

	$scope.selectedFolder = "inbox";
	$scope.selectedFolderDN = "< " + $scope.selectedFolder;
	$scope.uid = 100;
	$scope.msgs = $scope._fetchMsgs("Inbox", $scope.uid, 300);
	$scope.msgsChecked = [];

}