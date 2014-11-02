/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/1/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Utility = require('famous/utilities/Utility');
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Scene = require('famous/core/Scene');

    /**
     * A view for displaying various title area elements,
     *  each having an optional event handler for click
     *  events
     *
     * @class StandardTitleBar
     * @extends View
     * @constructor
     *
     * @param {object} options overrides of default options
     */
    function StandardTitleBar(options) {
        View.apply(this, arguments);

        this.definition = this.options.definition;
        this.layout = new Scene(this.definition);
        this.elements = [];
        this._elementIds = {};

        //this._optionsManager.on('change', _updateOptions.bind(this));

        this.add(this.layout);
    }

    StandardTitleBar.prototype = Object.create(View.prototype);
    StandardTitleBar.prototype.constructor = StandardTitleBar;

    StandardTitleBar.DEFAULT_OPTIONS = {
        sections: [],
        size: [undefined, 50],
        direction: Utility.Direction.X,
        definition: {
            id: 'master',
            size: this.size,
            target:[]
        }
    };

    /**
     * Update the options for all components of the view
     *
     * @method _updateOptions
     *
     * @param {object} data component options
     */
    function _updateOptions(data) {
        var id = data.id;
        var value = data.value;

        if (id === 'direction') {
            this.layout.setOptions({dimensions: _resolveGridDimensions.call(this.elements.length, this.options.direction)});
        }
        else if (id === 'elements') {
            for (var i in this.elements) {
                this.elements[i].setOptions(value);
            }
        }
        else if (id === 'sections') {
            for (var sectionId in this.options.sections) {
                this.defineSection(sectionId, this.options.sections[sectionId]);
            }
        }
    }

    /**
     * Return an array of the proper dimensions for the tabs
     *
     * @method _resolveGridDimensions
     *
     * @param {number} count number of elements
     * @param {number} direction direction of the layout
     *
     * @return {array} the dimensions of the tab section
     */
    function _resolveGridDimensions(count, direction) {
        if (direction === Utility.Direction.X) return [count, 1];
        else return [1, count];
    }

    StandardTitleBar.prototype.addLeftElement = function(id, options) {

        var targetDef = {
            // transform: Transform.inFront,
            origin: [0, 0.5],
            target: element
        };
        var element = _createElement.call(this, id, options, targetDef);
        if (this.options.elements) element.setOptions(this.options.elements);
        element.setOptions(options);
    };

    StandardTitleBar.prototype.addRightElement = function(id, options) {

        var targetDef = {
            // transform: Transform.inFront,
            origin: [1, 0.5],
            align: [1, 0.5]
        };
        var element = _createElement.call(this, id, options, targetDef);
        if (this.options.elements) element.setOptions(this.options.elements);
        element.setOptions(options);
    };

    function _createElement(id, options, targetDef) {
        var element;
        var i = this._elementIds[id];

        if (i === undefined) {
            i = this.elements.length;
            this._elementIds[id] = i;
            element = new Surface({
                //size: [this.options.size[1], this.options.size[1],
                classes: options.classes,
                content: options.content
            });
            this.elements[i] = element;
            targetDef.target = element;
            this.definition.target.push(targetDef);
            this.layout.load(this.definition);

            element.on('click', function () {
                this._eventOutput.emit(id, {});
            }.bind(this));
        }
        else {
            element = this.elements[this._elementIds[id]];
        }

        return element;
    };

    module.exports = StandardTitleBar;
});
