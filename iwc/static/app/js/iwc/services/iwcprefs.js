'use strict';

/* Services */
iwc.app.service('iwcprefs', function($cacheFactory, iwcutil) {

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
			return null;
		}

	}

	this.cache = $cacheFactory('iwcprefs');	
});



/* sample of get_allprefs.iwc

{"iwcp": {
  "error-code": "0",
  "preferences": {
    "user_prefs": {
      "general": {
        "cn": "Jeff Lin",
        "screenname": "Jeff Lin",
        "email": "jeff.lin@us.oracle.com",
        "uid": "jl123",
        "userdomain": "us.oracle.com",
        "realdomain": "us.oracle.com",
        "language": "en",
        "dateformat": "M/D/Y",
        "datedelimiter": "/",
        "timeformat": "12",
        "timezone": "America/Los_Angeles",
        "theme": "theme_orange",
        "defaultapp": "mail",
        "usertags": "work, friends, collegues, external",
        "defaulttag": "work",
        "corpabautocompleteenabled": true,
        "pwdexpiringtime": "",
        "graceloginsleft": "",
        "audiovolume": ""
      },
      "mail": {
        "ui": {
          "msglist": {
            "sortby": "6",
            "descending": "R",
            "displaycolumns": "2,1,4,3,5,6,0,7",
            "msgscached": 20
          },
          "compose": {
            "fromlist": [],
            "autospell": false,
            "composeinhtml": true
          },
          "layout": {"previewenabled": true}
        },
        "foldermapping": {
          "trash": "Trash",
          "sent": "Sent",
          "drafts": "Drafts"
        },
        "personaldata": {
          "replyto": "",
          "signature": "<div><br /><\/div>Sent from iPad<br /><div>This is a test Ki<\/div>",
          "addsignature": true,
          "addvcard": false,
          "vcard": "begin\\3avcard$n\\3a;;;;$adr\\3a;;;;;;$version\\3a2.1$end\\3avcard$",
          "addbcc": false,
          "bcclist": ""
        },
        "settings": {
          "movetotrash": true,
          "expungeonexit": false,
          "forwardformat": "",
          "autoquote": true,
          "copysent": true,
          "blockimages": false
        },
        "forward": {
          "enabled": false,
          "keepcopy": true,
          "emaillist": []
        },
        "autoreply": {
          "enabled": true,
          "autoreplymode": "",
          "autoreplytimeout": "1",
          "autoreplysubject": "test",
          "autoreplytext": "",
          "autoreplytextinternal": "Ki is off today"
        },
        "vacation": {
          "vacationstartdate": "1378857600000",
          "vacationenddate": "1379548799000"
        },
        "antispam": {
          "spamactionenabled": true,
          "spamfolder": "Spam"
        },
        "externalaccounts": {"pop": {
          "refreshinterval": 600,
          "timeout": 600
        }},
        "restrictanyone": false
      },
      "abs": {
        "defaultcontactbook": "",
        "entriesperpage": "100",
        "phoneformat": {"enabled": false},
        "photo": {
          "maxsize": 102400,
          "maxwidth": 2000,
          "maxheight": 2000
        },
        "corpdirsettings": {"corpdir": [{
          "enabled": true,
          "bookremoteurl": "ldap://corpdirectory",
          "vlv": {
            "enabled": false,
            "sortby": ""
          }
        }]},
        "pstoresettings": {"pstore": [{"lookthrulimit": 0}]}
      },
      "calendar": {
        "wcap": {"version": "7.0"},
        "defaultcalendarview": "weekview",
        "defaulteventtag": "Breakfast",
        "defaulteventfilter": "",
        "reminder": {
          "alarmstart": "-PT30M",
          "alarmtype": "email",
          "alarmaddress": ""
        },
        "workweek": "2,3,4,5,6",
        "daystarttime": "9",
        "dayendtime": "18",
        "eventnotification": {
          "enabled": false,
          "notifyaddress": "jeff.lin@us.oracle.com"
        },
        "eventsmsnotification": {
          "enabled": false,
          "notifyaddress": "sms://"
        },
        "enablereminderpopup": false,
        "enableinvitenotification": true,
        "firstday": "1",
        "calcolormappings": "/home/jeff.lin@us.oracle.com/abc/^Green;/home/jeff.lin@us.oracle.com/zzz/^Orange"
      },
      "im": {
        "contactdefaultgroup": "Friends",
        "enableidle": false,
        "idletimeout": 10,
        "enableaway": false,
        "awaytimeout": 10,
        "chatfontname": "Arial",
        "chatfonttypeface": "Italic",
        "chatfontsize": 10,
        "chatfontcolor": "#ffffff",
        "chatbackground": "#000000",
        "autoapprovesubsc": false,
        "showemailnotifications": false,
        "showcalnotifications": false,
        "alertonstatus": "online,offline,away",
        "hidegroups": false,
        "persistlastpresence": true,
        "lastpresence": "offline",
        "lastpresencemsg": "Available",
        "showpane": true
      },
      "externalaccounts": {"profile": []},
      "senderidentities": {"identity": [{
        "identityname": "default",
        "default": true,
        "displayname": "Jeff Lin",
        "email": "jeff.lin@us.oracle.com",
        "replyto": "",
        "addsignature": true,
        "signature": "<div><br /><\/div>Sent from iPad<br /><div>This is a test Ki<\/div>",
        "addvcard": false,
        "vcard": "begin\\3avcard$n\\3a;;;;$adr\\3a;;;;;;$version\\3a2.1$end\\3avcard$"
      }]},
      "addons": {
        "imgateways": {
          "enabled": false,
          "gateways": [
            {
              "enabled": false,
              "serverurl": "talk.google.com:5222",
              "category": "federated",
              "name": "GTalk",
              "domain": "gmail.com",
              "type": "gtalk"
            },
            {
              "enabled": false,
              "category": "gateway",
              "type": "facebook"
            }
          ]
        },
        "social": {
          "enabled": false,
          "service": [
            {
              "id": "twitter",
              "enabled": true,
              "param": {
                "localeMap": {
                  "de": "de_DE",
                  "it": "it_IT",
                  "zh-cn": "zh_CN",
                  "fr-ca": "fr_CA",
                  "ko": "ko_KR",
                  "zh-tw": "zh_TW",
                  "fr": "fr_FR",
                  "en": "en_US",
                  "hi": "hi_IN",
                  "es": "es_ES",
                  "ja": "ja_JP"
                },
                "tokens": {"defaultStoreToken": true}
              }
            },
            {
              "id": "facebook",
              "enabled": true,
              "param": {
                "localeMap": {
                  "de": "de_DE",
                  "it": "it_IT",
                  "zh-cn": "zh_CN",
                  "fr-ca": "fr_CA",
                  "ko": "ko_KR",
                  "zh-tw": "zh_TW",
                  "fr": "fr_FR",
                  "en": "en_US",
                  "hi": "hi_IN",
                  "es": "es_ES",
                  "ja": "ja_JP"
                },
                "tokens": {"defaultStoreToken": true},
                "key": ""
              }
            },
            {
              "id": "flickr",
              "enabled": true,
              "key": ""
            }
          ]
        },
        "advertising": {
          "enabled": false,
          "regions": {
            "skyscraper": {
              "enabled": true,
              "closeEnable": true,
              "events": {
                "enabled": true,
                "adtime": 30,
                "allEvents": {
                  "mail": true,
                  "all": false,
                  "calendar": false
                }
              },
              "width": 160
            },
            "messageViewer": {
              "enabled": true,
              "locations": {
                "LeftAd": {
                  "enabled": false,
                  "height": 250,
                  "width": 250
                },
                "TopAd": {
                  "enabled": true,
                  "height": 60
                },
                "BottomAd": {
                  "enabled": true,
                  "height": 60
                },
                "RightAd": {
                  "enabled": true,
                  "height": 250,
                  "width": 250
                }
              }
            }
          },
          "plugin": "iwc.widget.addon.advertising.Plugin"
        },
        "sms": {
          "folder": "SMS",
          "twowaysmsenabled": true,
          "enabled": false,
          "numberhintenabled": true,
          "NDNFolder": "INBOX",
          "channel": "sms-handle"
        }
      }
    },
    "system_prefs": {"deployment": {
      "virtual-domain": true,
      "default-domain": "us.oracle.com",
      "login-separator": "@",
      "svr-url": "http://10.133.152.246:8080"
    }},
    "service_acl": {
      "mail-service": true,
      "calendar-service": true,
      "im-service": true,
      "abs-service": true,
      "smime-service": false,
      "iss-service": false,
      "c11n-service": true,
      "ens-service": false
    },
    "client_prefs": {
      "screennameeditable": false,
      "garbagecollectionbuttonenabled": true,
      "smarttimezones": "",
      "maildefaulttags": "",
      "uploadfilemethod": "html5",
      "autologouttimeout": "0",
      "defaulttags": "",
      "dictlocale": "en_US",
      "corporateabentriesperpage": "100",
      "mailcheckinterval": "30",
      "clientcustomizationenabled": true,
      "antispamserviceurl": "/antispam",
      "updateunreadcount": false,
      "timinganalysisenabled": false,
      "mailautosaveinterval": "40"
    }
  }
}}

*/