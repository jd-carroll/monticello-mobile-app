define(function(require, exports, module) {
    'use strict';

    var Utils = require('utils');

    var Credentials = JSON.parse(require('text!credentials.json'));

    var Analytics = {};

    Analytics.init = function(){
        try {
            App.Analytics = window.plugins.gaPlugin;
            App.Analytics.init(function(){
                // success
                console.log('Success init gaPlugin');
            }, function(){
                // error
                if(App.Env.cordova) {
                    console.error('Failed init gaPlugin');
                    // TODO: Revisit this, if this fails in Production do we really want to display a message?
                    Utils.Notification.Toast('Failed init gaPlugin');
                }
            }, Credentials.GoogleAnalytics, 30);
        }catch(err){
            if(App.Env.cordova){
                console.error(err);
            }
            return false;
        }

        return true;
    };

    Analytics.trackRoute = function(pageRoute){
        // needs to wait for Utils.Analytics.init()? (should be init'd)
        try{
            App.Analytics.trackPage(function(){
                // success
                // console.log('success');
            }, function(){
                // error
                // console.error('ganalyticserror');
            }, App.shortName + '/' + pageRoute);
        }catch(err){
            if(App.Env.cordova){
                console.error('Utils.Analytics.trackPage');
                console.error(err);
                debugger;
            }
        }
    }
}

});