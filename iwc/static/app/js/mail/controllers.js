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


function IwcMailMsgListCtrl($scope, $filter, selectMsg) {
	$scope.msgs = [
		{
			"uid": 1,
			"from": "ki.wong@oracle.com",
			"subject": "Testing future",
			"size": 2793,
			"date": 1399313580000,
			"shortText": "Future demo",
			"html": "<h2>Future demo</h2>"

		},	
		{
			"uid": 2,
			"from": "ki.wong@oracle.com",
			"subject": "Testing today",
			"size": 2793,
			"date": 1364406758488,
			"shortText": "Today demo",
			"html": "<h2>Today demo</h2>"

		},		
		{
			"uid": 3,
			"from": "ki.wong@oracle.com",
			"subject": "Testing yesterday",
			"size": 2793,
			"date": 1364321580000,
			"shortText": "yesterday demo",
			"html": "<h2>yesterday demo</h2>"

		},		
		{
			"uid": 4,
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

		},		{
			"uid": 7,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 7",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 7",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 8,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 8",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 8",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 9,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 9",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 9",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 10,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 10",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 10",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 11,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 11",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 11",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 12,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 12",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 12",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 13,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 13",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 13",
			"html": "<h2>this is a demo</h2>"

		},
		
				{
			"uid": 14,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 14",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 14",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 15,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 15",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 15",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 16,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 16",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 16",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 17,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 17",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 13",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 18,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 18",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 18",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 19,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 19",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 19",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 20,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 20",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 20",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 21,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 21",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 21",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 22,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 22",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 22",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 23,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 23",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 23",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 24,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 24",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 24",
			"html": "<h2>this is a demo</h2>"

		},		{
			"uid": 25,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo 25",
			"size": 2793,
			"date": 1359586362000,
			"shortText": "this is a demo 25",
			"html": "<h2>this is a demo</h2>"

		},
		
		{
			"uid": 26,
			"from": "ki.wong@oracle.com",
			"subject": "Last year American Idol",
			"size": 43134,
			"date": 1351275180000,
			"shortText": "Hello, this is season 11 of American Idol, the America most watched singing contest.",
			"html": "Hello, this is season 12 of American Idol, the America most watched singing contest."

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