'use strict';

/* Services */
iwc.app.service('iwcprefs', function($cacheFactory) {

	this.put = function(value) {
		this.cache.put("allprefs", value);
	}

	this.get = function(key) {
		var o = this.cache.get("allprefs");
		
	}

	this.cache = $cacheFactory('iwcprefs');	
});