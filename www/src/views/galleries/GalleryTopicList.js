/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var View = require('famous/core/View');

    var PositionScrollview =    require('views/common/PositionScrollview');
    var GallerySummaryPhotos =  require('./GallerySummaryPhotos');

    function GalleryTopicList() {
        View.apply(this, arguments);

        // create the listview

        // get the model

        // create each gallery viewer

        // install the listener controls

        // set the first gallery to visible to kick things off
        this.gallery = new GallerySummaryPhotos();
        this.add(this.gallery);
    }

    GalleryTopicList.prototype = Object.create(View.prototype);
    GalleryTopicList.prototype.constructor = GalleryTopicList;

    module.exports = GalleryTopicList;
});
