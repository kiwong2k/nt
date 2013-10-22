'use strict';

/* Controllers */

function LoginCtrl(iwcp) {

	this.dataChanged = function() {
		this.isDisabled = !(this.userName && this.password);
	}

	this.login = function() {
		console.log("LoginCtrl::login", this.userName, this.password)
	}

	console.log("LoginCtrl starts")

	this.dataChanged();

	iwcp.login(angular.toJson(angular.element('loginForm')));

}