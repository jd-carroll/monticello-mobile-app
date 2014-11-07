/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Surface =       require('famous/core/Surface');
    var Transform =     require('famous/core/Transform');
    var View =          require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility =       require('famous/utilities/Utility');
    var Scrollview =    require('famous/views/Scrollview');

    var ExhibitStory =  require('./ExhibitStory');

    function ExhibitStoryList() {
        View.apply(this, arguments);

        var height = window.innerHeight * 0.55;


        var backgroundSurface = new Surface({
            classes: ['exhibit-background']
        });
        backgroundSurface.SizeMod = new StateModifier({
            size: [undefined, height]
        });
        backgroundSurface.PosMod = new StateModifier({
            transform: Transform.translate(4, height , 0)
        });
        this.add(backgroundSurface.PosMod).add(backgroundSurface.SizeMod).add(backgroundSurface);

        // create the listview
        this._scrollview = new Scrollview({
            direction: Utility.Direction.X
        });
        this._scrollview.SizeMod = new StateModifier({
            size: [undefined, height]
        });
        this._scrollview.PosMod = new StateModifier({
            transform: Transform.translate(4, height , 0)
        });
        this.add(this._scrollview.PosMod).add(this._scrollview.SizeMod).add(this._scrollview);

        // get the model
        // create each gallery viewer
        this.galleries = [];
        for (var i = 0; i < 10; i++) {
            this.galleries[i] = new ExhibitStory();
            this.galleries[i].pipe(this._scrollview);
        }
        this._scrollview.sequenceFrom(this.galleries);

        // install the listener controls

        // set the first gallery to visible to kick things off
    }

    ExhibitStoryList.prototype = Object.create(View.prototype);
    ExhibitStoryList.prototype.constructor = ExhibitStoryList;

    module.exports = ExhibitStoryList;
});
