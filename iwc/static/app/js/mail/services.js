'use strict';

/* Services */
iwc.app.
factory('selectMsg', function($rootScope) {
	return function(msg) {
		$rootScope.$broadcast('MailViewerCtrl-SelectMsg', msg);
	}	
})

