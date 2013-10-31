/* Services */
iwc.app.service('i18n', function($cacheFactory, iwcutil) {

	this.put = function(value) {
		this.cache.put("i18n", value);
	}

	this.get = function(key /* must be a string */) {
		return iwcutil.get(this.cache.get("i18n"), key);
	}

	this.cache = $cacheFactory.get('iwccache');	
});