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
    var ImageSurface =  require('famous/surfaces/ImageSurface');
    var Timer =         require('famous/utilities/Timer');
    var Lightbox =      require('famous/views/Lightbox');

    var PositionScrollview  = require('views/common/PositionScrollview');
    var Utils               = require('utils');

    var GalleryData = [
        {
            text: "Objects in the mirror are unluckier than they appear.",
            content: "./img/covers/mirror.jpg",
            name: "Steve Kuzminski"
        },
        {
            text: "Kylie Wilson changed her profile picture",
            content: "./img/covers/kylie.jpg",
            name: "Kylie Wilson"
        },
        {
            text: "Sick gifs from Sochi",
            content: "./img/covers/sochi.jpg",
            name: "Chris Zimmerman"
        }
    ];

    function GallerySummaryPhotos() {
        View.apply(this, arguments);

        // Create the lightbox
        this._lightbox = new Lightbox();
        this._lightbox.SizeMod = new StateModifier({
            size: [undefined, undefined]
        });
        this.add(this._lightbox.SizeMod).add(this._lightbox);

        // load the transitions
        // TODO: Refactor plane definitions
        var transitions = Object.create(this.DEFAULT_OPTIONS.DefaultTransition);
        this._lightbox.setOptions(transitions);
        this._lightbox.options = transitions;

        // associate the model
        this.galleries = [];
        for (var t = 0; t < GalleryData.length; t++) {
            var i = new ImageSurface(GalleryData[t]);
            this.galleries.push(i)
        }
        var galleryIndex = 0;
        this._lightbox.show(this.galleries[0]);

        // set the timer
        // TODO: Once multiple galleries are going we should set the time directly on the Engine instead of using
        //  the provided wrapper.  This was we can remove the event from the engine when the view is not visible
        Timer.setInterval(function () {
            galleryIndex++;
            if (galleryIndex === this.galleries.length) galleryIndex = 0;
            this._lightbox.show(this.galleries[galleryIndex]);
        }.bind(this), 5500); // TODO: Property?
    }

    GallerySummaryPhotos.prototype = Object.create(View.prototype);
    GallerySummaryPhotos.prototype.constructor = GallerySummaryPhotos;
    GallerySummaryPhotos.prototype.DEFAULT_OPTIONS = {
        DefaultTransition: {
            inTransform: Transform.identity,
            inOpacity: 0,
            inOrigin: [.5, .5],
            outTransform: Transform.identity,
            outOpacity: 0,
            outOrigin: [.5, .5],
            showTransform: Transform.identity,
            showOpacity: 1,
            showOrigin: [.5, .5],
            inTransition: {
                duration: 1e3
            },
            outTransition: {
                duration: 1e3
            },
            overlap: !0
        }
    };

    module.exports = GallerySummaryPhotos;
});
