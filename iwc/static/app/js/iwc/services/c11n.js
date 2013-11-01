'use strict';

/* Services */
iwc.app.service('c11n', function($http, $q, $cacheFactory, iwcprefs, iwcutil) {

	this.initialize = function() {
		this.enabled = iwcprefs.get('service_acl.c11n-service');		
		this.cache = $cacheFactory.get('iwccache');
	}

	this.startup = function() {
		this.initialize();

		var deferred = $q.defer();
		if (this.enabled) {
	 		var _this = this;
			var configJSON = iwcutil.getUniqueUrl('c11n/config.json');
			$http.get(
				configJSON
			).
			success(function(json) {
				console.log("successfully loaded", configJSON)
				var userdomain = iwcprefs.get('general.userdomain');
				var config = json[userdomain] || json['allDomain'];
				_this.cache.put('c11n', config);
				deferred.resolve();
			}).
			error(function() {
				console.error("failed to load", configJSON)
				deferred.reject()
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}

	this.isEnabled = function() {
		return this.enabled;
	}

	this.loadModule = function(key, cb) {
		var moduleFilename = this.enabled && this.cache.get('c11n', 'js.enabled') 
			? iwcutil.get(this.cache.get('c11n'), 'js.module.'+key)
			: null;
		if (moduleFilename) {
			var depFound = true;
			moduleFilename = iwcutil.getUniqueUrl(moduleFilename);
			$script(moduleFilename, cb);

			/* the following codes do not work, function(notFoundDeps) always get called
			$script(moduleFilename, key);
			$script.ready([key], 
				function() {
					if (depFound && cb) cb();
				}, 
				function(notFoundDeps) {
					console.error("c11n::loadModule", moduleFilename, "not found");
					depFound = false;
				}
			);
			*/
		} else {
			if (cb) cb();
		}
	}

});


/* sample of config.json

{
	"allDomain": {
		"js": {
			"enabled": false,
			"module": {
				"IwcAppCtrl": "c11n/allDomain/js/iwc/c11nIwcAppCtrl.js"
			}
		}
	},

	"example.com": {
		"js": {
			"enabled": false
		}
	}

	
}

*/