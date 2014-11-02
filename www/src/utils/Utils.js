define(function(require, exports, module) {
	'use strict';

    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform =     require('famous/core/Transform');

	var $ = require('jquery');

	var Utils = {};

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

    Utils.usePlane = function(plane_name, add, returnValue){
        add = add || 0;
        if(!App.UI.Planes[plane_name]){
            // key doesn't exist, use 'content'
            plane_name = 'content';
        }
        // console.log(App.Planes[plane_name] + add);
        // console.log(0.001 + (App.Planes[plane_name] + add)/1000000);
        var value = 0.001 + (App.UI.Planes[plane_name] + add)/1000000;
        if(returnValue){
            return value;
        }
        return new StateModifier({
            transform: Transform.translate(0,0, value)
        });
    };

	module.exports = Utils;
});