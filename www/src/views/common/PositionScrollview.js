/**
 * Copyright (c) 2014 Joseph Carroll.
 * All rights reserved.
 *
 * Created by Joseph Carroll on 11/2/2014.
 */
define(function(require, exports, module) {
    "use strict";

    var Scrollview = require('famous/views/Scrollview');

    function PositionScrollview() {
        Scrollview.apply(this, arguments);

    }

    PositionScrollview.prototype = Object.create(Scrollview.prototype);
    PositionScrollview.prototype.constructor = PositionScrollview;

    module.exports = PositionScrollview;
});
