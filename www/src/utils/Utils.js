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

    Utils.usePlane = function(layer, plane, add, returnValue){
        var scale = add || 0;
        if (typeof layer === 'number') {
            scale += Math.abs(layer);
        }
        else {
            if (App.UI.Layers[layer] === undefined) {
                console.error("Layer: " + layer + " does not exist, using 'content'");
                layer = 'content';
            }
            scale += App.UI.Layers[layer];
        }

        if (typeof plane === 'number') {
            scale += Math.abs(plane);
        }
        else {
            if (plane && App.UI.Planes[plane] === undefined) {
                console.error("Plane: " + plane + " does not exist, using 'default'");
                plane = 'default';
            } else if (!plane) {
                plane = 'default';
            }
            scale += App.UI.Planes[plane];
        }

        // console.log(App.Planes[plane_name] + add);
        // console.log(0.001 + (App.Planes[plane_name] + add)/100000000);
        var z = scale/100000000;
        if(returnValue){
            return z;
        }
        return new StateModifier({
            transform: Transform.translate(0,0, z)
        });
    };

	module.exports = Utils;
});
