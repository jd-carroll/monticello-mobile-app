require.config({
    waitSeconds: 7,
    paths: {
        utils: '../src/utils/Utils'
    },
    urlArgs: "bust=" + (new Date()).getTime()
}

define(function(require, exports, module) {
    'use strict';

    // import dependencies

    // load App defaults
    App = {
        Env: {
            cordova: false
        },
        shortName: "monticello"
    }

    // load models

    // configure app

    // configure device

    // run application

    //////////////////////////////////

    // helper methods

    //////////////////////////////////



});