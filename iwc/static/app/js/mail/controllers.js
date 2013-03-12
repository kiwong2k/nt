function MailCtrl($scope) {
	$scope.msgs = [
		{
			"id": 1,
			"from": "Bill Abbott <william.abbott@oracle.com>",
			"To": "convergence scrum <cgbu-ucs-conv-scrum_ww@oracle.com>",
			"subject": "Convergence Sprint 73 retrospective",
			"date": "05 Mar 2013 11:31:09",
			"text_short": "All, We will have the sprint 73 retrospective : Wed, 3/6 8:30 AM  (PT) 866 682 4770 (US) +91 8039890080 (toll) 1800 30109800 (toll free) 0008 006103103 (toll free) cc: 9088189 sc: 1793",
			"html": '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' +
				'<html><head><meta http-equiv=3D"content-type" content=3D"text/html; charset=3DUTF-8="></head>' +
				'<body bgcolor=3D"#ffffff" text=3D"#000000">All,<br><br>We will have the sprint 73 retrospective :<br>' +
				'<br>Wed, 3/6<br>8:30 AM=C2=A0 (PT)<br>	866 682 4770 (US)<br>+91 8039890080 (toll)<br>1800 30109800 (toll free)<br>0008 006103103 (toll free)<br>' +
				'<br>cc: 9088189<br>sc: 1793<br><br>Please update the <a href=3D"http://ucs.us.oracle.com/display/commsproducts/Convergence+Sprint+73">Sprint' +
				'73 table</a> and take a look at the Sprint <a href=3D"http://ucs.us.oracle.com/display/commsproducts/Convergence+Sprint+74">74' +
				'goals</a>.<br>	<br>Thanks,<br>	<br>=C2=A0 Bill<br>	<br><br></body>	</html>'
		},
		{
			"id": 2,
			"from": "ki.wong@oracle.com",
			"subject": "Convergence Demo",
			"date": "04 Mar 2013 07:20:23",
			"text_short": "this is a demo",
			"html": "this is a demo"

		},
		{
			"id": 3,
			"from": "ki.wong@oracle.com",
			"subject": "American Idol Season 12",
			"subject": "Convergence Demo",
			"date": "04 Mar 2013 07:20:23",
			"text_short": "Hello, this is season 12 of American Idol, the America most watched singing contest.",
			"html": "Hello, this is season 12 of American Idol, the America most watched singing contest.",

		}
	];

}