/* Services */
iwc.app.service('iwcutil', function() {

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

});