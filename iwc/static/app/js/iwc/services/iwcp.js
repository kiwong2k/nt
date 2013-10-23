'use strict';

/* Services */
iwc.app.service('iwcp', function($http, $q, $cookies) {
	this._unescapeSenderIdentity = function(prefs) {

		// The following function is copied from iwc.datastruct.VCard._unescape_crlf
		// and rewritten using string.replace
		// this is intentionally be a local function
		var unescape_crlf_for_uwc = function(str) {
			if(!str) return '';
			var res = str.replace(/\$/g, '<br/>')
					.replace(/\\24/g, '$')
					.replace(/\\3a/g, ':')
					.replace(/\\22/g, '"')
					.replace(/\\7c/g, '|')
					.replace(/\\25/g, '%')
					.replace(/\\5e/g, '^')
					.replace(/\\28/g, '(')
					.replace(/\\29/g, ')')
					.replace(/\\5c/g, '\\');

			return res;
		}

		if (prefs.user_prefs.senderidentities) {
			angular.forEach(prefs.user_prefs.senderidentities.identity, function(identity) {
				if (identity.signature)
					identity.signature = unescape_crlf_for_uwc(identity.signature);
			});
		}

		return prefs;
	}

	this._serializeParams = function(param) {
		param = param || {};
		param['fmt-out'] = 'text/json';	// additional param
		var token = $cookies['iwc-auth'].replace(/(^token=|.*?:token=)([^:]*)(.*)/i, '$2')
		if (token != $cookies['iwc-auth'])
			param['token'] = token;
		return $.param(param);
	}

	this._postRequest = function(url, param) {
		var deferred = $q.defer();

		$http.post(
			url, // url
			this._serializeParams(param),
			{headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}}
		).
		success(function(data, status) {
			var errno = parseInt(data.iwcp['error-code']);
			if (errno == 0) {
				console.log('iwcp::_postRequest succeeded', url);
				deferred.resolve(data);
			} else {
				console.log('iwcp::_postRequest failed', errno, url);
				var error = new Error(data.iwcp["message"]);
				error.errno = parseInt(errno);
				if (error.errno==1101 || error.errno==18)
					error.gotoURL = data.iwcp["gotoUrl"]
				//return $q.reject(error);
				deferred.reject(error);
			}
		}).
		error(function(data, status) {
			console.log('iwcp::_postRequest failed', url);
			deferred.reject(data);
			//return $q.reject(data);
		});

		return deferred.promise;		
	}

	this.preLogin = function() {
		console.log('iwcp::preLogin');

		return this._postRequest(
			//"http://pacifier.us.oracle.com:8080/iwc/svc/iwcp/prelogin.iwc" // url
			"/iwc/svc/iwcp/prelogin.iwc" // url
		);
	}

	// param: {'username': user, 'password': password}
	this.login = function(param) {
		console.log('iwcp::login');

		return this._postRequest(
			//'http://pacifier.us.oracle.com:8080/iwc/svc/iwcp/login.iwc', // url
			'/iwc/svc/iwcp/login.iwc', // url
			param
		);
	}

	this.getAllPrefs = function() {
		console.log('iwcp::login');

		var _this = this;
		return this._postRequest(
			'/iwc/svc/iwcp/get_allprefs.iwc' // url
		).then(function(data) {
			return _this._unescapeSenderIdentity(data.iwcp.preferences);
		});
	}

});

/*
	this.preLogin = function() {
	    console.log("Pre Login request");
	    deferred = this._sendRequest(
	            {
	                url:iwc.literal.iwcp.PRE_LOGIN_URL,
	                prelogin: "true"
	            }, true, 'text/json');
	    deferred.addCallback(
	        function(response) {
	            // return response.this.preLoginResponse;
		}
	    );
	    return deferred;
	}


	this.login = function(form) {
		// Summary: logs in to iWC
		// takes a form as an input
		var deferred;
		if (arguments.length == 1) {
			form.action = iwc.literal.iwcp.LOGIN_URL;
			deferred = this._sendRequest(form, true, "text/json");// true  always sync
			deferred.addCallback(
				function(json) {
					dojo.cookie("cacheBustId", json.iwcp.loginResponse.cacheBustId);
					return json.iwcp.loginResponse;
				}
			);
			return deferred;
		} else {
			deferred = new dojo.Deferred();
			var error = new Error("Login parameters are invalid");
			deferred.errback(error);  
		}
		return deferred;
	}

	this.logout = function(params) {
		// Summary: logs out of iWC
		return this._sendRequest(iwc.literal.iwcp.LOGOUT_URL + "?" + params);
	}

	this.getAllPrefs = function(sync) {
		// Summary: returns the all preferences
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var deferred =  this._sendRequest(iwc.literal.iwcp.GETALLPREFS_URL, sync, "text/json");
		deferred.addCallback(
			function(response) {
				return response.iwcp.preferences;
			}
		);
		deferred.addCallback(iwcp, "_unescapeSenderIdentity");
		return deferred;
	}

	this._sendRequest = function(param, sync,
											  fmtOut) {
		if (!param) return;
		if (!sync) sync = false;
		fmtOut = fmtOut || "text/json";
		var isFormData = (param.nodeName && param.nodeName.toLowerCase()=="form");
		var deferred = new dojo.Deferred();
		var parseResponse = function(response, ioArgs) {
			if(response instanceof Error){
				deferred.addErrback(iwc.error.callback);
				deferred.errback(response, ioArgs);
			} else {
				var errno = response.iwcp["error-code"];
				if (errno == 0) {
	                if(response.iwcp.logoutResponse){
	                    var nextURI = response.iwcp.logoutResponse['nextURI'];
	                    if(nextURI)
	                        response.nextURI = nextURI;
	                }
					deferred.callback(response);
				} else {
					deferred.addErrback(iwc.error.callback);
					var error = new Error(response.iwcp["message"]);
					error.errno = parseInt(errno);
	                if(error.errno==1101 || error.errno==18)
	                    error.gotoURL = response.iwcp["gotoUrl"]
					deferred.errback(error, ioArgs);  
				}
			}
		}
		
		if(isFormData){
			dojo.xhrPost({
				form: param,
				content: {token: iwc.secureToken, "fmt-out": fmtOut},
				preventCache: true,
				handleAs: 'json',
				timeoutSeconds: 5000,
				sync: sync,
				handle: parseResponse
			});
		}
		else if(dojo.isObject(param)){
			var ct = {token: iwc.secureToken};
			if (param.content) {
				var content = param.content;
				for(var i=0; i< content.length; i++) {
					ct[content[i].name] = content[i].value;
				}
			} else {
				for(var p in param) {
					if(p == 'url') continue;
					ct[p] = param[p];
				}
			}
			ct['fmt-out'] = ct['fmt-out'] || fmtOut;
			dojo.xhrPost({      
				url: param.url,
				content: ct,
				preventCache: true,
				handleAs: 'json',
				timeoutSeconds: 5000,
				sync: sync,
				handle: parseResponse
			});
		}
		else {
			var ct = {token: iwc.secureToken};
			
			if ( param.indexOf('fmt-out') <=0 && fmtOut )
				ct['fmt-out'] = fmtOut;
			
			dojo.xhrGet({
				url: param,
				content: ct,
				preventCache: true,
				handleAs: 'json',
				timeoutSeconds: 5000,
				sync: sync,
				handle: parseResponse
			});
		}

		return deferred;
	}

	if (!iwc.literal) iwc.literal = {};
	iwc.literal.iwcp = {};
	iwc.literal.iwcp.PRE_LOGIN_URL      = iwc.config.session.contextPath + "/svc/iwcp/prelogin.iwc";
	iwc.literal.iwcp.LOGIN_URL          = iwc.config.session.contextPath + "/svc/iwcp/login.iwc";
	iwc.literal.iwcp.LOGOUT_URL         = iwc.config.session.contextPath + "/svc/iwcp/logout.iwc";
	iwc.literal.iwcp.GETALLPREFS_URL = iwc.config.session.contextPath + "/svc/iwcp/get_allprefs.iwc";
	iwc.literal.iwcp.SETUSERPREFS_URL   = iwc.config.session.contextPath + "/svc/iwcp/set_userprefs.iwc";
	iwc.literal.iwcp.CHANGE_PASSWORD_URL = iwc.config.session.contextPath + "/svc/iwcp/change_password.iwc";

	// Sender indeitity related protocol commands
	iwc.literal.iwcp.GET_SENDERIDENTITIES_URL = iwc.config.session.contextPath + "/svc/iwcp/get_senderidentities.iwc";
	iwc.literal.iwcp.CREATE_SENDERIDENTITY_URL = iwc.config.session.contextPath + "/svc/iwcp/create_senderidentity.iwc";
	iwc.literal.iwcp.SET_SENDERIDENTITY_URL = iwc.config.session.contextPath + "/svc/iwcp/set_senderidentity.iwc";
	iwc.literal.iwcp.DELETE_SENDERIDENTITY_URL = iwc.config.session.contextPath + "/svc/iwcp/delete_senderidentity.iwc";

	// External account profile related protocol commands
	iwc.literal.iwcp.GET_EXTACCTPROFILES_URL = iwc.config.session.contextPath + "/svc/iwcp/get_extacctprofiles.iwc";
	iwc.literal.iwcp.CREATE_EXTACCTPROFILE_URL = iwc.config.session.contextPath + "/svc/iwcp/create_extacctprofile.iwc";
	iwc.literal.iwcp.SET_EXTACCTPROFILE_URL = iwc.config.session.contextPath + "/svc/iwcp/set_extacctprofile.iwc";
	iwc.literal.iwcp.DELETE_EXTACCTPROFILE_URL = iwc.config.session.contextPath + "/svc/iwcp/delete_extacctprofile.iwc";

*/

	/*
	this.setUserPrefs = function(content) {
		var isEmpty = !(content && content.length);
		var list = content;
		if (content.action) {
			list = dojo.query("input", content);
			
		}

		// the codes below save the prefs back to the iwc.userPrefs global variables
		dojo.forEach(list, function(item, idx) {
			var names = ("iwc.userPrefs." + item.name).split('.');
			var context = eval(names.slice(0, names.length-1).join('.'));
			if (item.value == 'true')  // checkboxes return strings 'true' & 'false'
				context[names[names.length-1]] = true;
			else if (item.value == 'false')
				context[names[names.length-1]] = false;
			else
				context[names[names.length-1]] = item.value;
		});

		if (!content.action) {
			content = {content: content, url: iwc.literal.iwcp.SETUSERPREFS_URL};
		}

		var deferred = null;
		if (isEmpty) {
			deferred = new dojo.Deferred();
			deferred.callback(0);
		} else {
			deferred = iwcp._sendRequest(content, true, "text/json");
		}
		deferred.addCallback(
			function(respXML) {
				return 0;
			}
		);
		return deferred;
	}

	this.changePassword = function(form) {
		// Do we need to send a get here?
		var content = {content: form, url: iwc.literal.iwcp.CHANGE_PASSWORD_URL};
		var deferred =  iwcp._sendRequest(content, true );
		deferred.addCallback(
			function(respXML) {
			   return 0;
			}
		);
		return deferred;	
	}

	//To Clean Up.  There is no need to write callback function for each one.  The caller should construct the right argument
	//before calling _sendRequest(); the caller can handle the response directly too.

	this.getExternalAccountProfiles = function(profilename, sync) {
		// Summary: Returns external account profiles indentified by profilename, if passed
		//          otherwise it will return all the external account profiles.
		//
		// profilename:
		//		Name of the external account profile for which it should return. Returns all if it is null.
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var url = iwc.literal.iwcp.GET_EXTACCTPROFILES_URL;

		if (profilename)
			url += "?profilename="+profilename;
		var deferred = iwcp._sendRequest(url, sync, "text/json" );
		deferred.addCallback(
			function(respJSON) {
				var profiles = null;
				if ( respJSON.iwcp && respJSON.iwcp.preferences )
						profiles = respJSON.iwcp.preferences;
				return profiles;
			}
		);

		return deferred;
	}

	this.createExternalAccountProfile = function(content, sync) {
		// Summary: Createa an external account profile.
		//
		// content: Form or ContentObj
		//		All the required information to create an external account profile. This can be
		//		either an object or form
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.CREATE_EXTACCTPROFILE_URL;

		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);

		return deferred;
	}

	this.deleteExternalAccountProfile = function(content, sync) {
		// Summary: Deletes a single or multiple external account profiles and sender identities.
		//
		// content: Form or ContentObj
		//		All the required information to delete external account profile and sender identities.
	    //		This can be either an object or form
	    //
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.DELETE_EXTACCTPROFILE_URL;

		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);

		return deferred;
	}

	this.setExternalAccountProfile = function(content, sync) {
		// Summary: Sets/modifies one or more attributes of an external account profile.
		//
		// content: Form or ContentObj
		//		All the required information to modify an external account profile. This can be
		//		either an object or form
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.SET_EXTACCTPROFILE_URL;

		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);

		return deferred;
	}


	this.getSenderIdentities = function(identityname, sync) {
		// Summary: Returns sender identity indentified by identityname, if passed
		//          otherwise it will return all the sender indetities.
		//
		// identityname:
		//		Name of the sender identity for which it should return. Returns all if it is null.
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var url = iwc.literal.iwcp.GET_SENDERIDENTITIES_URL;

		if (identityname)
			url += "?identityname="+identityname;
		var deferred = iwcp._sendRequest(url, sync, "text/json" );
		deferred.addCallback(
			function(respJSON) {
				var identities = null;
				if ( respJSON.iwcp && respJSON.iwcp.preferences )
						identities = respJSON.iwcp.preferences;
				return identities;
			}
		);
		
		return deferred;
	}

	this.createSenderIdentity = function(content, sync) {
		// Summary: Createa a sender identity.
		//
		// content: Form or ContentObj
		//		All the required information to create a sender identity. This can be
		//		either an object or form
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.CREATE_SENDERIDENTITY_URL;
		
		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);
		
		return deferred;
	}

	this.deleteSenderIdentity = function(content, sync) {
		// Summary: Deletes a single or multiple sender identyties.
		//
		// content: Form or ContentObj
		//		All the required information to delete sender identities. This can be
		//		either an object or form
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.DELETE_SENDERIDENTITY_URL;

		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);

		return deferred;
	}

	iwcp.setSenderIdentity = function(contentOrig, sync) {
		// Summary: Sets/modifies one or more attributes of a sender identity.
		//
		// contentOrig: Form or ContentObj
		//		All the required information to modify a sender identity. This can be
		//		either an object or form
		// sync:	Boolean
		//		Whether the request has to be synchronous or not, default is false
		var requestURL = iwc.literal.iwcp.SET_SENDERIDENTITY_URL;

		var content = dojo.clone(contentOrig);	// content may be changed for escape/unescape signature

		var isFormData = (content.nodeName && content.nodeName.toLowerCase()=="form");
		if ( isFormData )
			content.action = requestURL;
		else if (dojo.isObject(content) )
			content.url = requestURL;

		// KW - escape the signature data the same way as uwc for compatibility purpose
		content = iwcp._escapeSenderIdentity(content);

		var deferred =  iwcp._sendRequest(content, sync, 'text/json');
		deferred.addCallback(
			function(respJSON) {
			   return 0;
			}
		);

		return deferred;
	}

	// KW - these functions are written for the purpose to maintain signature compatibility with uwc
	// uwc always escape the signature data when saving the data and unescape it when retreiving it
	// the escape and unescape functions are based on the VCard _escape_crlf() and _unescape_crlf()
	//
	this._escapeSenderIdentity = function(identity) {

		// The following function is copied from iwc.datastruct.VCard._escape_crlf
		// and rewritten using string.replace
		// this is intentionally be a local function
		var escape_crlf_for_uwc = function(str) {
			if(!str) return '';
			var res = str.replace(/\\/g, '\\5c')
					.replace(/\$/g, '\\24')
					.replace(/\r\n|\n/g, '$')
					.replace(/:/g, '\\3a')
					.replace(/\"/g, '\\22')
					.replace(/\|/g, '\\7c')
					.replace(/%/g, '\\25')
					.replace(/\^/g, '\\5e')
					.replace(/\(/g, '\\28')
					.replace(/\)/g, '\\29');
			
			return res;
		}

		if (identity.signature)
			identity.signature = escape_crlf_for_uwc(identity.signature);

		return identity;

	}

	this._unescapeSenderIdentity = function(prefs) {

		// The following function is copied from iwc.datastruct.VCard._unescape_crlf
		// and rewritten using string.replace
		// this is intentionally be a local function
		var unescape_crlf_for_uwc = function(str) {
			if(!str) return '';
			var res = str.replace(/\$/g, '<br/>')
					.replace(/\\24/g, '$')
					.replace(/\\3a/g, ':')
					.replace(/\\22/g, '"')
					.replace(/\\7c/g, '|')
					.replace(/\\25/g, '%')
					.replace(/\\5e/g, '^')
					.replace(/\\28/g, '(')
					.replace(/\\29/g, ')')
					.replace(/\\5c/g, '\\');

			return res;
		}

		if (prefs.user_prefs.senderidentities) {
			dojo.forEach(prefs.user_prefs.senderidentities.identity, function(identity) {
				if (identity.signature)
					identity.signature = unescape_crlf_for_uwc(identity.signature);
			});
		}

		return prefs;
	}

});
*/