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

    var ExhibitStory =  require('./ExhibitStory');

    function ExhibitStoryList() {
        View.apply(this, arguments);

        var height = window.innerHeight * 0.55;
        // create the listview
        this._scrollview = new Scrollview({
            direction: Utility.Direction.X
        });
        this._scrollview.SizeMod = new StateModifier({
            size: [undefined, height]
        });
        this._scrollview.PosMod = new StateModifier({
            transform: Transform.translate(0, height , 0)
        });
        this.add(this._scrollview.PosMod).add(this._scrollview.SizeMod).add(this._scrollview);

        // get the model
        // create each gallery viewer
        this.galleries = [];
        for (var i = 0; i < 1; i++) {
            this.galleries[i] = new ExhibitStory();
        }
        this._scrollview.sequenceFrom(this.galleries);

        // install the listener controls

        // set the first gallery to visible to kick things off
    }

    ExhibitStoryList.prototype = Object.create(View.prototype);
    ExhibitStoryList.prototype.constructor = ExhibitStoryList;

    module.exports = ExhibitStoryList;
});
