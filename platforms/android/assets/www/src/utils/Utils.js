define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery');


	var Utils = {};

	Utils.Notification = {
		//
		Toast: function(msg, position){
			// attempting Toast message
			// - position is ignored
			var defer = $.Deferred();
			try {
				window.plugins.toast.showShortBottom(msg,
					function(a){
						defer.resolve(a);
					},
					function(b){
						defer.reject(b);
					}
				);
			} catch(err) {
				console.log('TOAST failed');
			}
			return defer.promise();
		}
	}

	module.exports = Utils;
}