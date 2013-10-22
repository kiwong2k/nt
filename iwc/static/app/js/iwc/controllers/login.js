'use strict';

/* Controllers */

function LoginCtrl(iwcp) {

	this.dataChanged = function() {
		this.isDisabled = !(this.userName && this.password);
	}

	this.login = function() {
		console.log("LoginCtrl::login", this.userName, this.password)
		iwcp.login({'username': this.userName, 'password': this.password});
	}

	console.log("LoginCtrl starts")

	this.dataChanged();

	iwcp.preLogin();

}