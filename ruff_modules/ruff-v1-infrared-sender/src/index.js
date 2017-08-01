/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var Sender = require('./infrared-sender.js');

var PIN = 12;

module.exports = driver({
    attach: function (inputs, context, next) {
        this._sender = new Sender();
        this._sender.open(PIN, next);
    },
    detach: function (callback) {
        this._sender.close(callback);
    },
    exports: {
        send: function (data, callback) {
            this._sender.send(data, callback);
        }
    }
});

