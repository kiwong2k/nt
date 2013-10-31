'use strict';

/* Services */
iwc.app.service('c11n', function($http, $cacheFactory, iwcprefs) {

	this.initialize = function() {
		this.enabled = false;
		this.cache = $cacheFactory.get('iwccache');
	}

	this.startup = function() {
		this.initialize();

		this.enabled = iwcprefs.get('service_acl.c11n-service');
		var _this = this;

		if (this.enabled) {
			var userdomain = iwcprefs.get('general.userdomain');
			var configJSON = 'c11n_sample/config.json';
			$http.get(
				configJSON
			).
			success(function(json) {
				console.log("successfully loaded", configJSON)
				var config = json[userdomain] || json['allDomain'];

				_this.enabled = config.enabled;
				if (_this.enabled) {
					_this.cache.put('c11n', config);
				}
			}).
			error(function() {
				console.error("failed to load", configJSON)
			})
		}		
	}

	this.isEnabled = function() {
		return this.enabled;
	}

	this.loadModule = function(key) {
		if (!this.enabled) return;

		var moduleFilename = this.cache.get(key);
		if (moduleFilename) {
			
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