function IwcMailCtrl($scope) {
	$scope.panels = [
		{"template": 'js/mail/templates/navigator.html', "selected": true},
		{"template": 'js/mail/templates/viewer.html', "selected": true}
	]

	$scope.selectedFolder = "inbox";

	$scope.selectedFolderDN = "< " + $scope.selectedFolder;

	$scope.newFolder = function() {
		alert("Compose email not yet implemented");
	}


}

function IwcMailNavCtrl($scope) {

	$scope.panels = [
		{"template": 'js/mail/templates/navbar.html', "selected": true},
		{"template": 'js/mail/templates/msglist.html', "selected": true}
	]


}


function IwcMailMsgListCtrl($scope) {
	$scope.msgs = [
		{
			"uid": 1,
			"from": "Bill Abbott <william.abbott@oracle.com>",
			"To": "convergence scrum <cgbu-ucs-conv-scrum_ww@oracle.com>",
			"subject": "Convergence Sprint 73 retrospective",
			"date": "05 Mar 2013 11:31:09",
			"text_short": "All, We will have the sprint 73 retrospective : Wed, 3/6 8:30 AM  (PT) 866 682 4770 (US) +91 8039890080 (toll) 1800 30109800 (toll free) 0008 006103103 (toll free) cc: 9088189 sc: 1793",
			"html": 'uid message 1'
		},
		{
			"uid": 2,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo",
			"date": "04 Mar 2013 07:20:23",
			"text_short": "this is a demo",
			"html": "this is a demo"

		},
		{
			"uid": 3,
			"from": "ki.wong@oracle.com",
			"subject": "American Idol Season 12",
			"date": "04 Mar 2013 07:20:23",
			"text_short": "Hello, this is season 12 of American Idol, the America most watched singing contest.",
			"html": "Hello, this is season 12 of American Idol, the America most watched singing contest."

		}
	];

}

function MailViewerCtrl($scope) {
	$scope.$on('MailViewerCtrl-SelectMsg', function(event, uid, msg) {
		$scope.selectMsg(msg);
	});

	$scope.selectMsg = function(msg) {
		$scope.msg = msg;
	}

}