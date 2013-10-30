function IwcMailCtrl($scope, $filter, $modal) {
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

	$scope.composepanels = [
		{"template": 'js/mail/templates/dialog/compose/compose.html', "selected": true, "controller": 'ComposeDialog'}
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
					"date": time - i*18000000,
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

	$scope._setMsg = function(index) {
		if (index >=0 && index <= $scope.msgs.length-1) {
			$scope.isFirstMsg = (index == 0);
			$scope.isLastMsg = (index == ($scope.msgs.length-1));
			$scope.msgIndex = index;

			if ($scope.msg) $scope.msg.isSelected = false;
			$scope.msg = $scope.msgs[index];
			$scope.msg.isSelected = true;
		}
	}


	//
	// private functions end here
	//

	// public functions start here
	 var t = '<div class="modal-header">'+
          '<h1>This is the title</h1>'+
          '</div>'+
          '<div class="modal-body">'+
          '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
          '</div>'+
          '<div class="modal-footer">'+
          '<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
          '</div>';

	$scope.composeMail = function() {
		var d = $modal.open(
			{ 
				backdrop: true,
				keyboard: true,
				backdropClick: false,
				templateUrl: $scope.composepanels[0].template,
				//template: t,
				controller: $scope.composepanels[0].controller
			}
		);
		d.result.then(function(result) {
			alert('dialog closed with result: ' + result);
		});
	}

	$scope.getMail = function() {
		var msgs = $scope._fetchMsgs("Inbox", --$scope.uid, 1);
		$scope.msgs = msgs.concat($scope.msgs);
	}

	$scope.rowClicked = function(msg, index) {
		console.log("row " + index + " clicked");
		
		angular.forEach($scope.msgsChecked, function(msg, i) {
			msg.isChecked = false;
		});
		$scope.msgsChecked = [];

		$scope._showPanels($scope.viewpanels, ["viewerbar.html", "message.html"]);

		$scope._setMsg(index);

	}

	$scope.checkBoxChanged = function(msg) {
		console.log("checkbox changed", msg.isChecked);
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
	
	//
	// 1.2.0 rc-3 has a bug that checkbox ng-model is not updated in ng-click event
	// so add ng-change together with ng-click for now
	$scope.checkBoxClicked = function(msg, $event) {
		console.log("checkbox Clicked: " + msg.isChecked);
		$event.stopPropagation();
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

	$scope.prevMsg = function() {
		$scope._setMsg($scope.msgIndex - 1);
	}

	$scope.nextMsg = function() {
		$scope._setMsg($scope.msgIndex + 1);
	}

	

	// public functions end here

	// initializations

	$scope.selectedFolder = "inbox";
	$scope.selectedFolderDN = "< " + $scope.selectedFolder;
	$scope.uid = 100;
	$scope.msgs = $scope._fetchMsgs("Inbox", $scope.uid, 300);
	$scope.msgsChecked = [];

}

