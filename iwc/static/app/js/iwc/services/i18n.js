/* Services */
iwc.app.service('i18n', function($cacheFactory) {

	this.put = function(value) {
		this.cache.put("allprefs", value);
	}

	this.get = function(key /* must be a string */) {
		var o = this.cache.get("allprefs");

		try {
			var parts = key.split('.');
			var obj = o;
			angular.forEach(parts, function(p) {
				obj = obj[p];
			})
			return obj;
		} catch(e) {
			return undefined;
		}

	}

	this.cache = $cacheFactory('iwcprefs');	
});