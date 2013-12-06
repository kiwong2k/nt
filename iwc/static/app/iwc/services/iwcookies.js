'use strict';

/* Services */
iwc.app.service('iwcookies', function($cacheFactory, $cookies, iwcutil) {
	this._getCookie = function(key) {
		var cookies = ($cookies['iwc-auth'] || "").split(':');
		var o = {};
		for (var i=0; i<cookies.length; i++) {
			var c = cookies[i].split('=');
			o[c[0]] = c[1];
		}

		// special case for context path 'path'
		// set it to '/iwc' if it does not exist
		o['path'] = o['path'] || '/iwc';

		this.put(o);
		return o[key];
	}

	this.put = function(value) {
		this.cache.put('cookies', value);
	}

	this.get = function(key) {
		return iwcutil.get(this.cache.get('cookies'), key) || this._getCookie(key);
	}

	this.cache = $cacheFactory('iwccache');	
});
