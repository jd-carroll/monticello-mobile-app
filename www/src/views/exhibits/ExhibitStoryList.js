/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var View = require('famous/core/View');

    function ExhibitStoryList() {
        View.apply(this, arguments);

        // create the listview

        // get the model

        // create each exhibit viewer
        // - The number of exhibit viewers should be fixed

        // install the listener controls

        // Associate the first set of exhibits with viewers
    }

    ExhibitStoryList.prototype = Object.create(View.prototype);
    ExhibitStoryList.prototype.constructor = ExhibitStoryList;

    module.exports = ExhibitStoryList;
});
