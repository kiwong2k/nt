'use strict';

/* Controllers */

function LoginCtrl(iwcp, $window) {

	this.dataChanged = function() {
		this.isDisabled = !(this.userName && this.password);
	}

	this.login = function() {
		console.log("LoginCtrl::login", this.userName, this.password)
		iwcp.login({'username': this.userName, 'password': this.password}).
			then(function(result) {
				console.log('LoginCtrl::login succeeded');
				$window.location = "/nt/iwc/static/app/main.html";
			}, function(result) {
				console.log('LoginCtrl::login failed');
			});
	}

	console.log("LoginCtrl starts")

	this.dataChanged();

	iwcp.preLogin()

}