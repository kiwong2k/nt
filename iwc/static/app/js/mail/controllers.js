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


function IwcMailMsgListCtrl($scope, selectMsg) {
	$scope.msgs = [
		{
			"uid": 1,
			"from": "Dilip Mahadevappa <dilip.m@oracle.com>",
			"To": "convergence scrum <cgbu-ucs-conv-scrum_ww@oracle.com>",
			"subject": "Please preview Confluence 5!",
			"size": 1866,
			"date": 1361833284000,
			"shortText": "Hi, I have made Confluence v5.0.3 available on sandbox http://sc11136364.us.oracle.com/dashboard.action ; This release has *New Look, Feel *and *Flow!***",
			"html":   '<div text="#000000" bgcolor="#FFFFFF">' +
    '<font face="Calibri">Hi,<br>' +
      '<br>' +
      'I have made Confluence v5.0.3 </font><font face="Calibri"><font' +
        ' face="Calibri">available </font>on sandbox </font><font' +
      ' face="Calibri"><font face="Calibri"><a ' +
          'class="moz-txt-link-freetext" ' +
          'href="http://sc11136364.us.oracle.com/dashboard.action">http://sc11136364.us.oracle.com/dashboard.action</a>' +
           ' ; This release </font>has <b>New Look, Feel </b>and <b>Flow!</b><b>' +
      '</b><br>' +
      '<br>' +
      'I request you all to take some time and check if your respective' +
      'pages/spaces are not broken &amp; they work as expected.  <br>' +
      '<br>' +
      'I plan to upgrade the production on April </font><font' +
      'face="Calibri"><font face="Calibri">6th</font>.  </font><u></u><u><font' +
        'face="Calibri">Please get back to me by April 5th.</font></u><br>' +
    '<br>' +
    '<font face="Calibri"><font face="Calibri">Thanks in advance!<br>' +
        '<br>' +
      '</font></font><font face="Calibri">' + 
		'<a href="http://www.atlassian.com/en/software/confluence/whats-new-iframe/50#" ' +
        'class="next">Take a Quick Tour of the New Features</a></font><br>' +
    '<font face="Calibri">' +
        '<a href="http://www.atlassian.com/software/confluence/whats-new">What is' +
        'New</a></font><br>' +
    '<font face="Calibri"> </font><font face="Calibri"><i><br>' +
        'Note: </i><i><br>' +
      '</i><i> </i><i><br>' +
      '</i><i> Table plug is disabled since it is licensed now.</i><i><br>' +
      '</i><i>This instance has data up to March 2</i><i>1st</i><i>.<br>' +
        '<br>' +
        '--<br>' +
        'Dilip</i><i><br>' +
      '</i><i> </i><i> </i></font>' +
	  '</div>'

		},
		{
			"uid": 2,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo",
			"html": "<h2>this is a demo</h2>"

		},
		{
			"uid": 3,
			"from": "ki.wong@oracle.com",
			"subject": "American Idol Season 12",
			"size": 43134,
			"date": 1359407195000,
			"shortText": "Hello, this is season 12 of American Idol, the America most watched singing contest.",
			"html": "Hello, this is season 12 of American Idol, the America most watched singing contest."

		}
	];
	
	$scope.rowClicked = function(msg) {
		console.log("row clicked uid="+msg.uid);
		selectMsg(msg);
	}

}

function IwcMailViewerCtrl($scope) {
	$scope.msg = {};
	
	$scope.panels = [
		{"template": 'js/mail/templates/viewerbar.html', "selected": true},
		{"template": 'js/mail/templates/message.html', "selected": true}
		
	]
	
	$scope.$on('iwc-MailMessageSelected', function(event, msg) {
		$scope.msg = msg;
	});
	
	$scope.selectMsg = function(msg) {
		$scope.msg = msg;
	}

}