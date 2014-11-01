define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery');


	var Utils = {};

	Utils.Notification = {
		//
		Toast: function(msg, position){
			// attempting Toast message
			// - position is ignored for now
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
	};

    Utils.Locale = {

        normalize: function(value){
            var tmpValue = value.toString().toLowerCase();
            // TODO: Read supported locales from config file
            var allowed_locales = {
                'en' : ['undefined','en','en_us','en-us']
            };

            var normalized = false;
            _.each(allowed_locales, function(locales, locale_normalized){
                if(locales.indexOf(tmpValue) !== -1){
                    normalized = locale_normalized;
                }
            });

            return normalized;
        }

    };

	module.exports = Utils;
});