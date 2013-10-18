'use strict';

/* Controllers */

function LoginCtrl() {

	this.dataChanged = function() {
		this.isDisabled = !(this.userName && this.password);
	}

	this.dataChanged();

}