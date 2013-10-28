'use strict';

/* Services */
iwc.app.service('c11n', function(iwcprefs) {
	this.startup = function() {
		this.isEnabled = iwcprefs.get('service_acl.c11n-service');
	}

	this.loadModule = function(name) {

	}


});