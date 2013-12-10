'use strict';

/* Services */
iwc.app.service('c11n', ['$http', '$injector', '$q', '$cacheFactory', 'iwcprefs', 'iwcutil',
					function($http, $injector, $q, $cacheFactory, iwcprefs, iwcutil) {

	this.initialize = function() {
		this.enabled = this.enabled || iwcprefs.get('service_acl.c11n-service');		
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
				console.log('c11n:startup', configJSON, 'loaded')
				var userdomain = iwcprefs.get('general.userdomain');
				var config = json[userdomain] || json['allDomain'];
				_this.cache.put('c11n', config);
				deferred.resolve();
			}).
			error(function() {
				console.error('c11n::startup failed to load', configJSON)
				deferred.reject()
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}

	this.enable = function() {
		this.enabled = true;
	}

	this.isEnabled = function() {
		return this.enabled;
	}

	this.isModuleDefined = function(key) {
		return this.enabled && this.cache.get('c11n', 'js.enabled') 
				? iwcutil.get(this.cache.get('c11n'), 'js.module.'+key)
				: false;
	}

	this.loadModule = function(key, cb, param) {
		var moduleFilename = this.isModuleDefined(key);
		if (moduleFilename) {
			var depFound = true;
			moduleFilename = iwcutil.getUniqueUrl(moduleFilename);
			//$script(moduleFilename, cb);
			$script(moduleFilename, function() {
				try {
					$injector.invoke(eval(key), null, param);
					console.log('c11n::loadModule', moduleFilename, 'loaded');
					cb();
				} catch (e) {
					console.error('c11n::loadModule', 'failed to load', moduleFilename);
					throw(e);
				}
			})
			console.log('c11n::loadModule', 'loading', moduleFilename);

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

}]);


/* sample of config.json

{
	"allDomain": {
		"js": {
			"enabled": false,
			"module": {
				"IwcAppCtrl": "c11n/allDomain/iwc/c11nIwcAppCtrl.js"
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