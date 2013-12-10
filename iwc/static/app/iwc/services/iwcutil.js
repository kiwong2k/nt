/* Services */
iwc.app.service('iwcutil', [ function() {

	// return the value of object o[key], key can be multiple levels separated by . 'dot'
	this.get = function(o /* object */, key /* must be a string e.g. 'a.b.c' */) {
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

	this.getUniqueUrl = function(url) {
		return url + '?' + this.random;
	}

	this.random = (new Date()).getTime();

}]);