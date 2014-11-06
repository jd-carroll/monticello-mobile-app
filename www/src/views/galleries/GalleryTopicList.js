/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility =       require('famous/utilities/Utility');
    var Scrollview =    require('famous/views/Scrollview');

    var PositionScrollview =    require('views/common/PositionScrollview');
    var GallerySummaryPhotos =  require('./GallerySummaryPhotos');

    function GalleryTopicList() {
        View.apply(this, arguments);

        // create the listview
        this._scrollview = new Scrollview({
            direction: Utility.Direction.X
        });
        this._scrollview.SizeMod = new StateModifier({
            size: [undefined, undefined]
        });
        this._scrollview.PosMod = new StateModifier({
            align: [0, 0],
            origin: [0, 0]
        });
        this.add(this._scrollview.PosMod).add(this._scrollview.SizeMod).add(this._scrollview);

        // get the model
        // create each gallery viewer
        this.galleries = [];
        for (var i = 0; i < 1; i++) {
            this.galleries[i] = new GallerySummaryPhotos();
        }
        this._scrollview.sequenceFrom(this.galleries);

        // install the listener controls

        // set the first gallery to visible to kick things off
    }

    GalleryTopicList.prototype = Object.create(View.prototype);
    GalleryTopicList.prototype.constructor = GalleryTopicList;

    module.exports = GalleryTopicList;
});
