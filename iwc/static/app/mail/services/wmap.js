/**
* Low level API wrapper for wmap.
* google 'wmap specification'
* for more details on the methods and parameters found here.
*/
/* Services */
iwc.app.service('wmap', ['$http', '$q', 'iwcookies', 'iwcprefs',  
				function($http, $q, iwcookies, iwcprefs) {

	this._getGetMboxUrl = function(mbox, opthdrs, searchExpr, start, offset, uidsOnly, sortBy, sortOrder, byUID) {
		// It is legal for the value of start to be a negative number,
		// in which case messages are counted from the back. We use that
		// for "Most recent last" initial sorting.
		if (!mbox) {
			mbox = 'INBOX';
		}
		var url = this.MAILBOX_URL;

		if (typeof(sortBy)=="undefined") {
			sortBy = 'recv';
		}
		if (typeof(sortOrder)=="undefined") {
			sortOrder = 'F';
		}

		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			count: offset,
			date: true,
			lang: iwcookies.get('lang'),
			token: iwcookies.get('token'),
			sortby: sortBy,
			sortorder: sortOrder
		};
		// Get the envelopes starting by UID (needed when we sort)
		// instead of by index.
		if(byUID) {
			params.startuid = start;
		}
		else {
			params.start = start;
		}

		if (mbox == iwcprefs.get('mail.foldermapping.sent') ||
		    mbox == iwcprefs.get('mail.foldermapping.drafts')) {
			// For sent and drafts folder, change the from header to to
			params.from = 'to';
		}

		if (opthdrs && (!dojo.isArray(opthdrs) || (opthdrs.length>0))) {
			params.headerv = opthdrs;
		}

		if (searchExpr) {
			params.srch = searchExpr;
		}

		// sortBy possible values:
		//	"recv", "from", "size", "subj", "uid", "seen", "iwc.protocol.wmapriority", "attach"
		// sortOrder possible values:
		//	"R", "F"
		//
		if (typeof(uidsOnly)!="undefined" && uidsOnly) {
			params.uidlist = 1;
		}

		var query = $.param(params);
		url += "?"+query;
		return url;
	}

	//this.fetchMailbox = function(mboxName, opthdrs, searchExpr, start, offset, sortBy, sortOrder, byUID, mboxUrl) {
	this.fetchMailbox = function(param) {
		param = angular.extend(
			{
				rev: 3,
				sid: '',
				mbox: 'INBOX',
				count: 50,
				start: 0,
				sortby: 'recv',
				from: (param.mbox == iwcprefs.get('mail.foldermapping.sent') || param.mbox == iwcprefs.get('mail.foldermapping.drafts'))
					? 'to'
					: undefined,
				lang: iwcookies.get('lang'),
				token: iwcookies.get('token')
			}, 
			param
		);

		var url = this.MAILBOX_URL + '?' + $.param(param);
		return this._getRequest(url).
			then(function(response) {
				// returns a list of messages for mbox in the form of an object:
				var mailbox = null;
				var kwArgs = {};
				if (this._format == this.outputFormat.COMPACT) {
					// http://sims.red.iplanet.com/messaging/cascabel/funcspecs/webmail_compactwmap.txt
					// [errno,         0	error number, 0 if ok
					// 'errstr',       1	error string, if errno != 0
					// size,           2	number of messages in folder or search result
					// start,          3	index of first message returned
					// count           4	number of messages returned
					// [flagdata,*],   5	array of flags (empty if uidlist=1)
					// [msgdata,*],    6	array of messages
					// seen,           7	number of seen msgs in folder
					// quotaused,      8	in bytes, or 0 if no quotas
					// msgquotaused,   9	number of messages, or 0 if no quotas
					// lastuid        10	uid of last message in mailbox
					// ]
					//
					// flagdata:
					// ['name',        0	flag name
					// value]          1	bit to match with msgdata's flag
					//
					//
					// msgdata:
					//
					// [uid,      0	message uid
					// size,      1	size in bytes
					// date,      2	time_t value
					// flags,     3	or'ed bits for message flags
					// 'from',    4	from header, may be redefined by from argument
					// 'subject', 5
					// opthdrs    6 extra header values (if passed headerv args)
					// ]
					//
					// If uidlist=1 then msgdata is simply the unbracketed uid.

					if (response[0] === 0) {
						kwArgs.size         = response[2];
						kwArgs.start        = response[3];
						kwArgs.count        = response[4];
						kwArgs.flagdata     = response[5];
						kwArgs.msgdata      = response[6];
						kwArgs.seen         = response[7];
						kwArgs.quotaused    = response[8];
						kwArgs.msgquotaused = response[9];
						kwArgs.lastuid      = response[10];
						//mailbox = new iwc.datastruct.MailFolder(mboxName, kwArgs);
					} else {
						// protocol error
						//return this._createError(response[0], response[1]);
					}
				}
				return mailbox;
			}
		);
	}

	this._getRequest = function(url) {
		var deferred = $q.defer();
		var _this = this;

		$http.get(
			url // url
		).
		success(function(data, status) {
			// prelogin.iwc does not return any error-code
			return _this._handleMjs(data);
		}).
		error(function(data, status) {
			console.error('wmap::_getRequest failed', url);
			deferred.reject(data);
			//return $q.reject(data);
		});

		return deferred.promise;
	}

	this._postRequest = function(url, param) {

	}

	this._sendRequest = function(	param, // String || Form 
									sync,  // Boolean
									format ) {
		if (!sync) {
			sync = false;
		}
		if (typeof(format) == "undefined") {
			format=this._format;
		}
		if (typeof(param) == "object") {
			console.debug( "sync=", sync, " iwc.protocol.wmap::_sendRequest(): POST ", param.action);
		} else {
			console.debug("sync=", sync, "iwc.protocol.wmap::_sendRequest():  GET ", param);
		}

		var isFormData = ((typeof(param)=="object") &&
		                  param.enctype &&
		                  param.enctype.match("form-data") ) ? true : false;

		var timeout = iwc.options.timeout.request*1000;
		if (param.action) {
			if(param.action.indexOf("attach") > -1) {
				timeout = iwc.options.timeout.uploadRequest*1000;
			} else if (param.action.indexOf("collect") > -1) {
				timeout = (iwc.userPrefs.mail.externalaccounts &&
					   iwc.userPrefs.mail.externalaccounts.pop) ?
					   iwc.userPrefs.mail.externalaccounts.pop.timeout : 600;
				timeout *= 1000;
			}
		}

		var deferred;

		switch(format) {
			case this.outputFormat.JAVASCRIPT:
				if(typeof(param) == "object") {
					if (param.action.indexOf("attach") > -1) {
						timeout = iwc.options.timeout.uploadRequest*1000;
					}
				}

				deferred = dojo.io.iframe.send(
					{
						form: (typeof(param) == "object" ? param : null),
						url:  (typeof(param) == "string" ? param : null),
						content: isFormData ? null : {token: iwc.secureToken},
						preventCache: true,
						handleAs: "html",
						sync: sync,
						timeout: timeout
					}
				);
				deferred.addCallback(this._handleMsc);
				break;
			default:
				if (typeof(param) == "object") {
					if(param.rawPost) {
						deferred = dojo.rawXhrPost(
							dojo.mixin(
								{
									timeout: timeout,
									sync: sync
								},
								param.rawPost
							)
						);
					} else {
						deferred = dojo.xhrPost(
							{
								form: param,
								content: isFormData ? null : {token: iwc.secureToken, ttl:(timeout/1000)},
								preventCache: true,
								handleAs: "text",
								timeout: timeout,
								sync: sync
							}
						);
					}
				} else {
					deferred = dojo.xhrGet(
						{
							url: param,
							content: {token: iwc.secureToken},
							preventCache: true,
							handleAs: "text",
							timeout: timeout,
							sync: sync
						}
					);
				}
				deferred.addCallback(this._handleMjs);
		}

		deferred.addErrback(iwc.error.callback);
		return deferred;
	}
	

	this._handleMjs = function(response) {
		// strip the "while(1);\n"
		response = response.trim();
		if (response.indexOf("while(1);") === 0) {
			response = response.substring(10);
		}
		//response = angular.fromJson(response);
		response = eval("(" + response + ")"); // Object
		//console.log('iwc.protocol._handleMjs ', response);

		if(response && angular.isArray(response)){
			if(response[0] !== 0){
				var error = new Error(response[1]);
				// add member errno so cb can do additional handling
				error.errno = response[0];
				if(error.errno=='1101'&&response[2])
					error.gotoURL = response[2];
				console.warn('wmap protocol error: ', error);
				return error;
			} else {
				return response;
			}
		}

		return new Error(iwc.api.getLocalization().error_replyinvalid);
	}

	this.outputFormat = { COMPACT: "compact", JAVASCRIPT: "javascript" };
	this._format = this.outputFormat.COMPACT;

	this.URL = iwcookies.get('path') + "/svc/wmap/";
	this.ATTACH_URL  = this.URL+"attach.msc";
	this.ATTACH_URL_XHR  = this.URL+"attach.mjs";
	this.CONFIG_URL  = this.URL+"cfg.mjs";
	this.COMMAND_URL = this.URL+"cmd.mjs";
	this.MAILBOX_URL = this.URL+"mbox.mjs";
	this.MESSAGE_URL = this.URL+"msg.mjs";
	this.LIST_SHARED_MBOX_URL = this.URL+"list.mjs";
	this.LISTFOLDERS_CMD = this.URL+"listfolders.mjs";
	this.SPELL_CHECKER_URL = this.URL + "spell.msc";
	this.SPAM_URL = this.URL + "feedback.mjs";
	this.LDAP_URL = this.URL + "ldathis.msc";
	this.COLLECT_URL  = this.URL+"collect.mjs";
	this.LOOKUP_URL  = this.URL+"lookup.mjs";

}]);

/*
	var p = iwc.protocol.wmap;
	p.outputFormat = { COMPACT: "compact", JAVASCRIPT: "javascript" };
	p._format = p.outputFormat.COMPACT;

	p.getGetMboxListUrl = function(getUnreadCount) {
		if (getUnreadCount == undefined) {
			getUnreadCount = true;
		}
		var url = p.LISTFOLDERS_CMD;
		var params = {
			rev: 3,
			sid: '',
			unread: (getUnreadCount)?1:0
		 };

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getGetSharedMboxListUrl = function(username) {
		var url = p.LIST_SHARED_MBOX_URL;
		var params = {
			rev: 3,
			sid: '',
			username: username
		};

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getGetMboxUrl = function(mbox, opthdrs, searchExpr, start, offset, uidsOnly, sortBy, sortOrder, byUID) {
		// It is legal for the value of start to be a negative number,
		// in which case messages are counted from the back. We use that
		// for "Most recent last" initial sorting.
		if (!mbox) {
			mbox = 'INBOX';
		}
		var url = p.MAILBOX_URL;

		if (typeof(sortBy)=="undefined") {
			sortBy = 'recv';
		}
		if (typeof(sortOrder)=="undefined") {
			sortOrder = 'F';
		}

		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			count: offset,
			date: true,
			lang: djConfig.locale,
			sortby: sortBy,
			sortorder: sortOrder
		};
		// Get the envelopes starting by UID (needed when we sort)
		// instead of by index.
		if(byUID) {
			params.startuid = start;
		}
		else {
			params.start = start;
		}

		if ((mbox == iwc.userPrefs.mail.foldermapping.sent) ||
		    (mbox == iwc.userPrefs.mail.foldermapping.drafts)) {
			// For sent and drafts folder, change the from header to to
			params.from = "to";
		}

		if (opthdrs && (!dojo.isArray(opthdrs) || (opthdrs.length>0))) {
			params.headerv = opthdrs;
		}

		if (searchExpr) {
			params.srch = searchExpr;
		}

		// sortBy possible values:
		//	"recv", "from", "size", "subj", "uid", "seen", "iwc.protocol.wmapriority", "attach"
		// sortOrder possible values:
		//	"R", "F"
		//
		if (typeof(uidsOnly)!="undefined" && uidsOnly) {
			params.uidlist = 1;
		}

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getGetMsgUrl = function(mbox, uid, isDraft, leftAsUnseen) {
		var url = p.MESSAGE_URL;

		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			uid: uid,
			//process: "html,js,target,binhex" + (isDraft ? "" : ",link"),
			process: "html,js,target,binhex" + (isDraft ? "" : ",link"),
			//maxtext: iwc.config.availableServices.mail.options.maxTextSize,
			security: false,
			lang: djConfig.locale
		};

		if (leftAsUnseen) params.unseen = true;
		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getPostMsgUrl = function() {
		var url = p.MESSAGE_URL;
		var params = {
			rev: 3,
			sid: ''
		};

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getAttachUrl = function(useXhr) {
		// Force using msc since dojo.xhrPost does not support file upload
		var url = useXhr ? p.ATTACH_URL_XHR : p.ATTACH_URL;
		var params = {
			token: iwc.secureToken,
			rev: 3,
			sid: '',
			security: false
		};
		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};
	
	p.getGetCfgUrl = function() {
		var url = p.CONFIG_URL;

		var params = {
			rev: 3,
			sid: '',
			lang: djConfig.locale
		};

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getCmdUrl = function(mbox, cmd) {
		var url = p.COMMAND_URL;
		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			cmd: cmd
		 };
		var query = dojo.objectToQuery(params);
		url += "?"+query;
		for (var i = 2; i < arguments.length; i++) {
			if (typeof(arguments[i]) != "undefined") {
				url += "&argv=" + encodeURIComponent(arguments[i]);
			}
		}
		return  url;
	};

	p.getSetACLUrl = function(mbox, idaccesslist) {
		var url = this.getCmdUrl(mbox, "setacl");
		for(var id in idaccesslist) if (idaccesslist.hasOwnProperty(id)) {
			url += "&argv=" + id + "&argv=" + idaccesslist[id];
		}
		return url;
	};

	p.getCreateMboxUrl = function(mbox) {
		var url;
		if (dojo.isArray(mbox)) {
			url = p.getCmdUrl(mbox[0], "create");
			dojo.forEach(mbox.slice(1),
				function(m) {
					url += "&argv=" + encodeURIComponent(m);
				}
			);
		} else {
			url = p.getCmdUrl(mbox, "create");
		}
		return url;
	};

	p.getSubscribeMboxUrl = function(mbox) {
		var url;
		if (dojo.isArray(mbox)) {
			url = p.getCmdUrl(mbox[0], "subscribe");
			dojo.forEach(mbox.slice(1),
				function(m) {
					url += "&argv=" + encodeURIComponent(m);
				}
			);
		} else {
			url = p.getCmdUrl(mbox, "subscribe");
		}
		return url;
	};

	p.getSendMsgUrl = function() {
		var url = p.MESSAGE_URL;
		var params = {
			rev: 3,
			sid: ''
		};

		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return url;
	};

	p.getForwardMsgUrl = function(mbox, uid) {
		var url = p.getSendMsgUrl();
		var params = {
			mbox: mbox.value,
			uid: uid.value
		};

		var query = dojo.objectToQuery(params);
		url += "&"+query;
		return url;
	};

	p.getCollectExternalMailsUrl = function() {
		var url = p.COLLECT_URL;
		var params = {
			rev: 3,
			sid: ''
		 };

		 var query = dojo.objectToQuery(params);
		 url += "?"+query;
		 return url;
	};

	p.getGetLookupUrl = function(uid, email) {
		var url = p.LOOKUP_URL;
		var params = {
			rev: 3,
			sid: ''
		 };
		if (uid) params.uid = uid;
		if (email) params.mail = email;
		var query = dojo.objectToQuery(params);
		url += "?"+query;
		return  url;
	};

	p.fetchConfig = function(sync) {
		var deferred = p._sendRequest(p.getGetCfgUrl(), sync);
		deferred.addCallback(function(response) {
			var config = {};
			var i, j;
			var userAttribute = null;
			// returns the configuration parameters as the following object
			// {
			//  userAttributes:    array of userattr
			//  spellLanguages:    array of languages available for spellchecker
			//  maxMessageSize:    max total size of a composed message (in bytes)
			//  maxPostSize:       max size of an attachment upload (in bytes)
			//  quotaWarn:         percent value - 0 if not set
			//  mailDomain:        user's domain
			//  defaultDomain:     default domain of the server
			//  dnsSupport:        bitmask, see below
			// }
			//
			// userattr:
			// {
			//  name:              string
			//  values:            array
			// }
			//
			// [errno,         0	error number, 0 if ok
			// 'errstr',       1	error string, if errno != 0
			// [userattr,*]    2	array of user attributes (see below)
			// [smimeparams]   3	array of smime attributes (TBD). null if no smime for user
			// 'spelllang',    4	languages available for spellchecker
			// maxmessagesize, 5	max total size of a composed message
			// maxpostsize,    6	max size of an attachment upload
			// quotawarn,      7	percent value - 0 if not set
			// maildomain,     8	user's domain
			// defaultdomain,  9
			// dsnsupport]     10	this variable is a bitmask of
																		//			server capabilities:
																		//			1 dsnsupport
																		//			2 reporting spam
																		//			4 reporting not spam
			//
			// userattr:
			// [name,          0
			// readonly,       1
			// value,*         2+	1 element per value when multiple values
			// ]

			config.spellLanguages = response[4].split(",");
			config.maxMessageSize = response[5];
			config.maxPostSize    = response[6];
			config.quotaWarn      = response[7];

			// quotaWarn default should be 90, but some versions do will
			// return '0' if it is not set instead of the default value.
			// We must set the default value (90) if the value returned
			// by the server is 0.
			if(config.quotaWarn == 0){
				config.quotaWarn = 90;
			}


			config.mailDomain     = response[8];
			config.defaultDomain  = response[9];
			config.dsnSupport     = ((response[10] & 1) !== 0);
			config.spamReport     = ((response[10] & 2) !== 0);
			config.notspamReport  = ((response[10] & 4) !== 0);
			config.wmap_version   = response[11];
			if (config.wmap_version >= 14) {
				config.enableExtAccnts = ((response[10] & 8) !== 0);
			} else {
				config.enableExtAccnts = true;
			}
			config.userAttributes = {};
			for (i=0; i<response[2].length; i++) {
				userAttribute = {};
				userAttribute.readonly = response[2][i][1];
				userAttribute.values   = [];
				for (j=2; j<response[2][i].length; j++) {
					userAttribute.values.push(response[2][i][j]);
				}
				config.userAttributes[response[2][i][0]] = userAttribute;
			}

			// smimeparams (wmap_version >= 4):
			config.smime = null;
			if (response[3] instanceof Array && response[3].length == 16) {
				config.smime = {};
				dojo.forEach([

					'alwaysencrypt',              //0     boolean, 0 or 1
					'alwayssign',                 //1     boolean, 0 or 1
					'platformparams',             //2     dll name, e.g. "MOZILLA:library=libsoftokn3.so;"
					'SSLrootcerts',               //3     array of strings
					'CArootcerts',                //4     array of strings
					'timestampdelta',             //5     number
					'logging',                    //6     boolean, 0 or 1
					'CRLdisable',                 //7     0: do CRL, 1: always OK, 2: always unknown-policy
					'CRLreadsigncert',            //8     boolean, 0 or 1
					'CRLsendsigncert',            //9     boolean, 0 or 1
					'CRLsendencryptcert',         //10    boolean, 0 or 1
					'CRLsendsigncertrevoked',     //11    boolean: 0 = disallow, 1 = allow
					'CRLsendencryptcertrevoked',  //12    boolean: 0 = disallow, 1 = allow
					'CRLrevocationunknown',       //13    boolean: 0 = revoked,  1 = ok
					'CRLcheckoverSSL',            //14    boolean, 0 or 1
					'CRLSSLport'                  //15    integer

				], function(param, index) {

					config.smime[param] = response[3][index];

				});
				config.smime.platformparams = {};
				dojo.forEach([

					'Win32',         //2.0    dll name, e.g. CAPI:library=capibridge.dll
					'MacIntel',      //2.1    dll name, e.g. MOZILLA:library=libsoftokn3.dylib
					'MacPPC',        //2.2    dll name, e.g. MOZILLA:library=libsoftokn3.dylib
					'Linux x86',     //2.3    dll name, e.g. MOZILLA:library=libsoftokn3.so
					'Linux x86_64',  //2.4    dll name, e.g. MOZILLA:library=libsoftokn3.so
					'SunOS sun4u',   //2.6    dll name, e.g. MOZILLA:library=libsoftokn3.sl
					'SunOS x86',     //2.7    dll name, e.g. MOZILLA:library=libsoftokn3.sl
					'SunOS x86_64',  //2.8    dll name, e.g. MOZILLA:library=libsoftokn3.sl
					'HPUX'           //2.5    dll name, e.g. MOZILLA:library=libsoftokn3.sl

				], function(param, index) {

					if (response[3][2][index]) {
						config.smime.platformparams[param] = response[3][2][index];
					}

				});
			}

			// quota information are integer
			if (config.userAttributes.mailQuota &&
					config.userAttributes.mailQuota.values.length > 0) {
				config.userAttributes.mailQuota.values = dojo.map(config.userAttributes.mailQuota.values, parseInt);
			}
			if (config.userAttributes.mailMsgQuota &&
					config.userAttributes.mailMsgQuota.values.length > 0) {
				config.userAttributes.mailMsgQuota.values = dojo.map(config.userAttributes.mailMsgQuota.values, parseInt);
			}

			return config;

		});
		return deferred;
	};

	p.fetchMailboxList = function(getUnreadCount, sync) {
		// Summary: fetches the list of mailboxes
		// getUnreadCount: boolean // wether to get the unread count, default is true
		// sync:	boolean
		// 		whether or not the operation should be performed synchronously

		var deferred = p._sendRequest(p.getGetMboxListUrl(getUnreadCount), sync);
		deferred.addCallback(
			function(response) {
				// returns a list of mailboxes in the form of an object:
				// {
				//  personal:   array of personal mailboxes
				//  subscribed: array of subscribed mailboxes not owned by the user
				// }
				var mailboxes = {personal:[], subscribed:[]};
				var i;
				if (p._format == p.outputFormat.COMPACT) {
					// http://sims.red.iplanet.com/messaging/cascabel/funcspecs/webmail_compactwmap.txt
					//
					// [
					//  errno,       0	error number, 0 if ok
					//  'errstr',    1	error string, if errno != 0
					//  [mbox,*],    2	personal mailboxes
					//  [mbox,*]     3	subscribed mailboxes not owned by the user
					// ]

					//mbox:
					// [
					//  name,   0
					//  flags,  1	noinferiors=1 hasnochildren=2 haschildren=4 noselect=8
					//  msgs,   2	number of messages in mailbox
					//  size,   3	mailbox size in kb
					//  acl,    4
					//  unread  5	number of unread messages
					// ]
					//
					// Note: this is an expensive command and the client code should update
					// folder list locally whenever possible, including unread counts.

					if (response[0] === 0) {
						for (i=0; i<response[2].length; i++) {
							mailboxes.personal.push(
								new iwc.datastruct.MailFolderEnvelope(
									response[2][i][0],
									response[2][i][1],
									response[2][i][2],
									response[2][i][3],
									response[2][i][4],
									response[2][i][5]
								)
							);
						}
						for (i=0; i<response[3].length; i++) {
							mailboxes.subscribed.push(
								new iwc.datastruct.MailFolderEnvelope(
									response[3][i][0],
									response[3][i][1],
									response[3][i][2],
									response[3][i][3],
									response[3][i][4],
									response[3][i][5]
								)
							);
						}
					} else {
						// protocol error
						return p._createError(response[0], response[1]);
					}
				}
				return mailboxes;
			}
		);
		return deferred;
	};

	p.fetchSharedMboxList = function(uid) {
		var deferred = p._sendRequest(p.getGetSharedMboxListUrl(uid), true);
		return deferred;
	};

	p.fetchUids = function(mbox, searchExpr, start, offset, sortBy, sortOrder) {
		var deferred = p._sendRequest(p.getGetMboxUrl(mbox, null, searchExpr, start, offset, true, sortBy, sortOrder));
		deferred.addCallback(
			function(response) {
				console.debug("iwc.protocol.wmap.fetchUids(): ", response);
				if (p._format == p.outputFormat.COMPACT) {
					// http://sims.red.iplanet.com/messaging/cascabel/funcspecs/webmail_compactwmap.txt
					// [errno,         0	error number, 0 if ok
					// 'errstr',       1	error string, if errno != 0
					// size,           2	number of messages in folder or search result
					// start,          3	index of first message returned
					// count           4	number of messages returned
					// [flagdata,*],   5	array of flags (empty if uidlist=1)
					// [msgdata,*],    6	array of messages
					// seen,           7	number of seen msgs in folder
					// quotaused,      8	in bytes, or 0 if no quotas
					// msgquotaused,   9	number of messages, or 0 if no quotas
					// lastuid        10	uid of last message in mailbox
					// ]
					//
					// If uidlist=1 then msgdata is simply the unbracketed uid.
					return dojo.clone(response[6]);
				}
			}
		);
		return deferred;
	};
        
       
	p.fetchMailbox = function(mboxName, opthdrs, searchExpr, start, offset, sortBy, sortOrder, byUID,mboxUrl) {
		var deferred = p._sendRequest(mboxUrl||p.getGetMboxUrl(mboxName, opthdrs, searchExpr, start, offset, false, sortBy, sortOrder, byUID));
		deferred.addCallback(
			function(response) {
				// returns a list of messages for mbox in the form of an object:
				var mailbox = null;
				var kwArgs = {};
				if (p._format == p.outputFormat.COMPACT) {
					// http://sims.red.iplanet.com/messaging/cascabel/funcspecs/webmail_compactwmap.txt
					// [errno,         0	error number, 0 if ok
					// 'errstr',       1	error string, if errno != 0
					// size,           2	number of messages in folder or search result
					// start,          3	index of first message returned
					// count           4	number of messages returned
					// [flagdata,*],   5	array of flags (empty if uidlist=1)
					// [msgdata,*],    6	array of messages
					// seen,           7	number of seen msgs in folder
					// quotaused,      8	in bytes, or 0 if no quotas
					// msgquotaused,   9	number of messages, or 0 if no quotas
					// lastuid        10	uid of last message in mailbox
					// ]
					//
					// flagdata:
					// ['name',        0	flag name
					// value]          1	bit to match with msgdata's flag
					//
					//
					// msgdata:
					//
					// [uid,      0	message uid
					// size,      1	size in bytes
					// date,      2	time_t value
					// flags,     3	or'ed bits for message flags
					// 'from',    4	from header, may be redefined by from argument
					// 'subject', 5
					// opthdrs    6 extra header values (if passed headerv args)
					// ]
					//
					// If uidlist=1 then msgdata is simply the unbracketed uid.

					if (response[0] === 0) {
						kwArgs.size         = response[2];
						kwArgs.start        = response[3];
						kwArgs.count        = response[4];
						kwArgs.flagdata     = response[5];
						kwArgs.msgdata      = response[6];
						kwArgs.seen         = response[7];
						kwArgs.quotaused    = response[8];
						kwArgs.msgquotaused = response[9];
						kwArgs.lastuid      = response[10];
						mailbox = new iwc.datastruct.MailFolder(mboxName, kwArgs);
					} else {
						// protocol error
						return p._createError(response[0], response[1]);
					}
				}
				return mailbox;
			}
		);
		return deferred;
	};

	p.runCommand = function(mbox, cmd) {
		console.log("iwc.protocol.wmap::runCommand(",arguments,")");
		//return p._sendRequest(this.getCmdUrl.apply(this, arguments));
		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			cmd: cmd,
			token: iwc.secureToken
		};
		var args=[];
		for (var i = 2; i < arguments.length; i++) {  //argument is special array, can't splice()
			if (typeof(arguments[i]) != "undefined")
				args.push(arguments[i]);
		}
		if (args.length>0)
			params.argv=args;
		var query = dojo.objectToQuery(params);
		return p._sendRequest({rawPost: {url: p.COMMAND_URL, postData: query}});
	};
	//
	// Download an attachment synchronously
	//
	p.downloadAttachment = function(url) {
	    //return p._sendRequest(url, true, p.outputFormat.TEXT);
	    var response = null;
	    dojo.xhrGet(
		    {
			    url: url,
			    content: {token: iwc.secureToken},
			    preventCache: true,
			    handleAs: "text",
			    load: function(data){
				response = data;
			    },
			    timeout: iwc.options.timeout.request*1000,
			    sync: true
		    }
	    );
	    return response;
	};

	p.subscribeMailbox = function(mbox) {
		return p._sendRequest(p.getSubscribeMboxUrl(mbox));
	};

	p.createMailbox = function(mbox, sync) {
		return p._sendRequest(p.getCreateMboxUrl(mbox), sync);
	};

	p.renameMailbox = function(old_fqname, new_fqname) {
		return p._sendRequest(p.getCmdUrl(old_fqname, "rename", new_fqname));
	};

	p.deleteMailbox = function(mbox) {
		return p._sendRequest(p.getCmdUrl(mbox, "delete"));
	};

	p.fetchMessage = function(envelope, leftAsUnseen) {
		if (!envelope instanceof iwc.datastruct.MailMessageEnvelope) {
			throw new Error('iwc.protocol.fetchMessage was passed an invalid envelope');
		}
		var deferred = p._sendRequest(p.getGetMsgUrl(envelope.mboxName, envelope.uid, envelope.isDraft(), leftAsUnseen));
		deferred.addCallback(
			function(response) {
				// Returns a iwc.datastruct.MailMessage object
				var message = null;
				var kwArgs = {};
				var i,j;
				if (p._format == p.outputFormat.COMPACT) {
					// http://sims.red.iplanet.com/messaging/cascabel/funcspecs/webmail_compactwmap.txt
					//
					// [errno,       0	error number, 0 if ok
					// 'errstr',     1	error string, if errno != 0
					// 'mbox',       2	mailbox name
					// uid,          3
					// internaldate, 4
					// sentdate,     5
					// size,         6
					// flags,        7
					// [partobj,*]   8	array of parts
					// ]

					if (response[0] === 0) {
						kwArgs.mbox      = response[2];
						kwArgs.uid       = response[3];
						kwArgs.recvdate  = response[4];
						kwArgs.sentdate  = response[5];
						kwArgs.size      = response[6];
						kwArgs.flags     = response[7];
						kwArgs.parts     = response[8];
						message = new iwc.datastruct.MailMessage(envelope, kwArgs);
					}
				}
				return message;
			}
		);
		return deferred;
	};

	p.postMessage = function(form) {
		// Summary: Submits a message to the server
		//
		// form: Form
		//		Form containing all the necessary fields of an email message
		//
		form.action  = p.getPostMsgUrl();
		form.method  = "POST";
		form.enctype = "application/x-www-form-urlencoded";

		var deferred = p._sendRequest(form);
		deferred.addCallback(
			function(response) {
				// returns an object with the uid and the size of the posted message
				// {
				//  uid:   array of personal mailboxes
				//  size: array of subscribed mailboxes not owned by the user
				// }
				var postmark = {};
				if (p._format == p.outputFormat.COMPACT) {
					if (response[0] === 0) {
						postmark.uid  = response[2];
						postmark.size = response[3];
					}
				}
				return postmark;
			}
		);
		return deferred;
	};

	p.sendMessage = function(form) {
		// Summary: Sends a message, return a dojo.Deferred object
		//
		// form: Form
		//		Form containing all the necessary fields of an email message
		//
                if(!(form.copy && form.copy.value))
                    form.copy.value  = iwc.userPrefs.mail.settings.copysent ? iwc.userPrefs.mail.foldermapping.sent : "";
		if(iwc.supportedServices.sms && (form.copy.value ==  iwc.supportedServices.sms.smsFolder) && !iwc.supportedServices.sms.twowaysmsenabled)
		    form.copy.value = "";	
		form.draft.value = "";
		form.smtp.value  = "true";
		form.tzoffset.value = (new Date()).getTimezoneOffset()/60;

		return p.postMessage(form);
	};

	p.saveMessageAsDraft = function(form) {
		// Summary: Saves a message to the server, return a dojo.Deferred object
		//
		// form: Form
		//		Form containing all the necessary fields of an email message
		//
		form.copy.value  = "";
		// TODO: this does not return a value!
		form.draft.value = iwc.userPrefs.mail.foldermapping.drafts;
		form.smtp.value  = "false";

		return p.postMessage(form);
	};

	p.uploadhtml5 = function(form, cb) {
		form.action  = iwc.protocol.wmap.getAttachUrl(true);

		var fd = new FormData();
		fd.append("fileToUpload", form.file.files[0]);

		form.rawPost = { url: form.action, postData: fd, cbProgress: cb, contentType: false};
		var deferred = this._sendRequest(form);

		deferred.addCallback(
			function(response) {
				// returns an object with the uid, size and filename of the posted message
				// {
				//  uid: uid of the uploaded attachment file 
				//  size: size of the attachment file
				//  filename: name of the attachment file
				// }
				var postmark = {};
				if (response[0] === 0) {
					postmark.uid  = response[2];
					postmark.size = response[3];
					postmark.filename = response[4]
				}
				return postmark;
			}
		);
		return deferred;
	};

	p.uploadiframe = function(form) {
		form.action  = iwc.protocol.wmap.getAttachUrl();
		form.method  = "POST";
		form.enctype = "multipart/form-data";
		// on IE form created dynamically have to have the encoding set as well as
		// the standard enctype:
		//	- http://www.talkphp.com/javascript-ajax-e4x/1176-form-enctype-internet-explorer.html
		//	- http://verens.com/archives/2005/07/06/ie-bugs-dynamically-creating-form-elements/
		form.encoding = "multipart/form-data";

		var deferred = this._sendRequest(form, false, p.outputFormat.JAVASCRIPT);

		deferred.addCallback(
			function(response) {
				// returns an object with the uid, size and filename of the posted message
				// {
				//  uid: uid of the uploaded attachment file 
				//  size: size of the attachment file
				//  filename: name of the attachment file
				// }
				var postmark = {};
				if (response.errno === 0) {
					postmark.uid  = response.uid;
					postmark.size = response.size;
					postmark.filename = response.filename;
				}
				return postmark;
			}
		);
		return deferred;
	};

	p.upload = function(form, cb) {
		return p["upload" + iwc.clientPrefs.uploadfilemethod](form, cb);
	};

	p.validateUser = function(userid) {
		var filter = "(&(mailuserstatus=active)(objectclass=inetmailuser)(uid="+userid+"))";
		var url = p.LDAP_URL;
		var params = {
			token: iwc.secureToken,
			rev: 3,
			sid: '',
			security: false
		};
		params.filter = filter;
		params.count = 1;
		params.ldapurl = "";
		params.start = 0;
		var query = dojo.objectToQuery(params);
		url += "?"+query;
		var deferred = this._sendRequest(url, false, p.outputFormat.JAVASCRIPT);
		deferred.addCallback(
			function(response) {
				var isValid = false;
				if(response){
					var size = response.size;
					if(size == 1) isValid = true;
				}
				return isValid;
			}
		);
		return deferred;
	};

	p.reportSpam = function(mbox, uid, spam) {

		// Make sure the webmail SpamReport and NotSpamReport is enabled before sending spam feedback.
		// Otherwise, simulate a deferred callback...
		if ( (spam && !iwc.supportedServices.mail._config["spamReport"]) ||
		     (!spam && !iwc.supportedServices.mail._config["notspamReport"]) ) {
			var deferred = new dojo.Deferred();
			deferred.callback([0, ""]);
			return deferred;	
		}

		var params = {
			rev: 3,
			sid: '',
			mbox: mbox,
			uid: uid,
			type: (spam ? "abuse" : "not-spam"),
			token: iwc.secureToken
		};
		var query = dojo.objectToQuery(params);
		var deferred = p._sendRequest({rawPost: {url: p.SPAM_URL, postData: query}});
		return deferred;
	};

	p.checkSpelling = function(words, lang) {

		var def = new dojo.Deferred();
		var url = iwc.protocol.wmap.SPELL_CHECKER_URL + "?"+dojo.objectToQuery({
			token: iwc.secureToken,
			sid: "",
			rev: 3,
			security: false
		});

		dojo.xhrPost({
			url: url,
			content: {
				lang: lang,
				cmd: "check",
				data: words,
				preventCache: true,
				timeout: iwc.options.timeout.request*1000

			},
			load: function(response){
				//console.log("Processing response ", response);
				// The results are returned as HTML, which unfortunately
				// we can't easily process with dojo.xhrPost (as opposed
				// to dojo.io.iframe). Not worth creating a form
				// to use that, so we'll just process the output.
				response = response.substr(response.indexOf("<script>")+8);
				response = response.substr(0, response.indexOf("</script>"));
				var result = {};
				try{
					result = eval("(function(){ "+response+"; if(errstr && errstr.length) throw new Error(errstr); return mispelled_words; })()");

				}catch(e){
					def.errback(e);
					return;
				}

				var words = {};
				dojo.forEach(result, function(wordObj){
					words[wordObj.word] = {
						offset: wordObj.offset,
						len: wordObj.word.length,
						srcWord: wordObj.word,
						alternatives: wordObj.suggestions
					};
				});
				def.callback(words);
			},

			error: function(error) {
				def.errback(error);
			}
			});
			return def;
	};

	p.collectExternalMails = function(form) {
                // Summary: Submits a message to the server
                //
                // form: Form
                //              Form containing all the necessary fields of an email message
                //
                form.action  = p.getCollectExternalMailsUrl();
                form.method  = "POST";
                form.enctype = "application/x-www-form-urlencoded";

                var deferred = p._sendRequest(form);
                deferred.addCallback(
                        function(response) {
                                //Response:
                                //
                                //Field             pos
                                //
                                //[errno,                   0       error number, 0 if ok
                                //'errstr',                 1       error string, if errno != 0
                                //count,                    2       number of messages retrieved
                                //'uidl'                    3       UIDL of last message retrieved from mailbox
                                //]

                                var result = {};
                                if (p._format == p.outputFormat.COMPACT) {
                                        if (response[0] === 0) {
                                                result.count = response[2];
                                                result.uid  = response[3];
                                        }
                                } else {
                                        // protocol error
                                        return p._createError(response[0], response[1]);
                                }
                                return result;
                        }
                );
                return deferred;
        };

	p.lookupEmail = function(uid) {
		var deferred = p._sendRequest(p.getGetLookupUrl(uid, ""), true);
		deferred.addCallback(function(response){return response[2];});
		return deferred;
	};

	p.lookupUid = function(email) {
		var deferred = p._sendRequest(p.getGetLookupUrl("", email), true);
		deferred.addCallback(function(response){return response[2];});
		return deferred;
	};

	// used to see if service is up
	p.noop = function() {
		return p._sendRequest(p.getCmdUrl('INBOX', 'noop'));
	};

	// accessList is an object whose properties are ids, and property
	// values are the permission changes to apply. { user: "-p" }
	p.setACL = function(mbox, idaccesslist) {
		return p._sendRequest(p.getSetACLUrl(mbox, idaccesslist));
	};

	p._createError = function(errno, errstr) {
                var error = new Error(errstr);
                error.errno = errno;
		return error;
	};

	p._sendRequest = function( param, // String || Form 
		                       sync,  // Boolean
		                       format //) {
		if (!sync) {
			sync = false;
		}
		if (typeof(format) == "undefined") {
			format=p._format;
		}
		if (typeof(param) == "object") {
			console.debug( "sync=", sync, " iwc.protocol.wmap::_sendRequest(): POST ", param.action);
		} else {
			console.debug("sync=", sync, "iwc.protocol.wmap::_sendRequest():  GET ", param);
		}

		var isFormData = ((typeof(param)=="object") &&
		                  param.enctype &&
		                  param.enctype.match("form-data") ) ? true : false;

		var timeout = iwc.options.timeout.request*1000;
		if (param.action) {
			if(param.action.indexOf("attach") > -1) {
				timeout = iwc.options.timeout.uploadRequest*1000;
			} else if (param.action.indexOf("collect") > -1) {
				timeout = (iwc.userPrefs.mail.externalaccounts &&
					   iwc.userPrefs.mail.externalaccounts.pop) ?
					   iwc.userPrefs.mail.externalaccounts.pop.timeout : 600;
				timeout *= 1000;
			}
		}

		var deferred;

		switch(format) {
			case p.outputFormat.JAVASCRIPT:
				if(typeof(param) == "object") {
					if (param.action.indexOf("attach") > -1) {
						timeout = iwc.options.timeout.uploadRequest*1000;
					}
				}

				deferred = dojo.io.iframe.send(
					{
						form: (typeof(param) == "object" ? param : null),
						url:  (typeof(param) == "string" ? param : null),
						content: isFormData ? null : {token: iwc.secureToken},
						preventCache: true,
						handleAs: "html",
						sync: sync,
						timeout: timeout
					}
				);
				deferred.addCallback(p._handleMsc);
				break;
			default:
				if (typeof(param) == "object") {
					if(param.rawPost) {
						deferred = dojo.rawXhrPost(
							dojo.mixin(
								{
									timeout: timeout,
									sync: sync
								},
								param.rawPost
							)
						);
					} else {
						deferred = dojo.xhrPost(
							{
								form: param,
								content: isFormData ? null : {token: iwc.secureToken, ttl:(timeout/1000)},
								preventCache: true,
								handleAs: "text",
								timeout: timeout,
								sync: sync
							}
						);
					}
				} else {
					deferred = dojo.xhrGet(
						{
							url: param,
							content: {token: iwc.secureToken},
							preventCache: true,
							handleAs: "text",
							timeout: timeout,
							sync: sync
						}
					);
				}
				deferred.addCallback(p._handleMjs);
		}

		deferred.addErrback(iwc.error.callback);
		return deferred;
	};
	
	p._handleMsc = function(response) {
		var w = response.defaultView||response.parentWindow;
		if (w.errno) {
			var error = new Error(w.errstr);
			// add member errno so cb can do additional handling
			error.errno = w.errno;
			response = error;
		} else if ((response.URL && response.URL.match("^"+p.ATTACH_URL) == p.ATTACH_URL) && (typeof(w.errno) == "undefined" || !w.size) ) {
			var error = (w.size === 0 && typeof(w.filename) != "undefined")? new Error(w.filename + iwc.l10n.error_attachment):
					new Error(iwc.l10n.attach_problem);
			error.errno = 999;
			response = error;
		}

		if(response instanceof Error){
			if(response.dojoType=="cancel"){
				console.error("We cancelled this request.");
			} else if(response.dojoType=="timeout"){
				console.error("The request timed out; timeout limit is " + iwc.options.timeout.request);
			}
			return response;
		} else {
			//console.debug("iwc.protocol.wmap::_sendRequest() iFrame Response: ",response);
			return w;
		}
		return response;
	};

	// TODO - KW should use deferred object from xhr request to handle
	// errback and callback functions. Since xhr request errback
	// returns dojoType error such as Timeout, Cancel and http no connection
	// error
	p._handleMjs = function(response) {
		// strip the "while(1);\n"
		response = dojo.string.trim(response);
		if (response.indexOf("while(1);") === 0) {
			response = response.substring(10);
		}
		response = dojo.fromJson(response);
		//console.log('iwc.protocol._handleMjs ', response);

		if(response && dojo.isArray(response)){
			if(response[0] !== 0){
				var error = new Error(response[1]);
				// add member errno so cb can do additional handling
				error.errno = response[0];
				if(error.errno=='1101'&&response[2])
					error.gotoURL = response[2];
				console.warn('wmap protocol error: ', error);
				return error;
			} else {
				return response;
			}
		}

		return new Error(iwc.api.getLocalization().error_replyinvalid);
	};


	p.URL             = iwc.config.session.contextPath + "/svc/wmap/";
	p.ATTACH_URL  = p.URL+"attach.msc";
	p.ATTACH_URL_XHR  = p.URL+"attach.mjs";
	p.CONFIG_URL  = p.URL+"cfg.mjs";
	p.COMMAND_URL = p.URL+"cmd.mjs";
	p.MAILBOX_URL = p.URL+"mbox.mjs";
	p.MESSAGE_URL = p.URL+"msg.mjs";
	p.LIST_SHARED_MBOX_URL = p.URL+"list.mjs";
	p.LISTFOLDERS_CMD = p.URL+"listfolders.mjs";
	p.SPELL_CHECKER_URL = p.URL + "spell.msc";
	p.SPAM_URL = p.URL + "feedback.mjs";
	p.LDAP_URL = p.URL + "ldap.msc";
	p.COLLECT_URL  = p.URL+"collect.mjs";
	p.LOOKUP_URL  = p.URL+"lookup.mjs";

*/

